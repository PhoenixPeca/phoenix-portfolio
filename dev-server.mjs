import { createServer } from "node:http";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { appendFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

async function loadLocalEnvironment() {
  try {
    const values = await readFile(resolve(projectRoot, ".env"), "utf8");
    for (const line of values.split(/\r?\n/)) {
      const separator = line.indexOf("=");
      if (separator === -1 || line.trimStart().startsWith("#")) continue;
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^(['\"])(.*)\1$/, "$2");
      if (key && !process.env[key]) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") console.error("Could not load local environment", error);
  }
}

await loadLocalEnvironment();

const port = Number(process.env.PORT || 4173);
const distDirectory = resolve(projectRoot, "dist");
const logDirectory = resolve(projectRoot, "logs");
const accessLogPath = resolve(logDirectory, "external-link-access.jsonl");
const accessLogsPassword = process.env.ACCESS_LOGS_PASSWORD;
const accessLogsSessionLifetime = 60 * 60 * 1000;
const maximumAccessLogEntries = 100;
let pendingAccessLogWrite = Promise.resolve();

const caseStudyRoutes = new Set(["/case-study/wend", "/case-study/rakwireless"]);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function clientIp(request) {
  const cloudflare = request.headers["cf-connecting-ip"];
  const forwardedFor = request.headers["x-forwarded-for"];
  const forwarded = request.headers.forwarded;
  const realIp = request.headers["x-real-ip"];
  const first = (value) => (Array.isArray(value) ? value[0] : value)?.split(",")[0].trim();
  const standardForwardedIp = first(forwarded)?.match(/(?:^|;)\s*for=(?:"?\[?)([^;\]",]+)/i)?.[1];
  return first(cloudflare) || first(forwardedFor) || standardForwardedIp || first(realIp) || request.socket.remoteAddress || "unknown";
}

function decodeExternalDestination(encodedDestination) {
  const normalizedDestination = encodedDestination?.replace(/=+$/, "");
  if (!normalizedDestination || !/^[A-Za-z0-9_-]+$/.test(normalizedDestination)) return null;

  try {
    const target = new URL(Buffer.from(normalizedDestination, "base64url").toString("utf8"));
    return target.protocol === "https:" ? target.href : null;
  } catch {
    return null;
  }
}

function constantTimeEquals(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function accessLogsSignature(payload) {
  return createHmac("sha256", accessLogsPassword).update(payload).digest("base64url");
}

function createAccessLogsSession() {
  const expiresAt = Date.now() + accessLogsSessionLifetime;
  const payload = `${expiresAt}.${randomBytes(18).toString("base64url")}`;
  return `${payload}.${accessLogsSignature(payload)}`;
}

function accessLogsSessionIsValid(request) {
  const session = request.headers.cookie?.match(/(?:^|;\s*)access_logs_session=([^;]+)/)?.[1];
  if (!session || !accessLogsPassword) return false;
  const separator = session.lastIndexOf(".");
  if (separator === -1) return false;
  const payload = session.slice(0, separator);
  const expiresAt = Number(payload.slice(0, payload.indexOf(".")));
  return Number.isFinite(expiresAt)
    && expiresAt > Date.now()
    && constantTimeEquals(session.slice(separator + 1), accessLogsSignature(payload));
}

function accessLogsCookie(request, value, maxAge) {
  const secure = request.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
  return `access_logs_session=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${secure}`;
}

async function requestJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 10_000) throw new Error("Request body is too large.");
  }
  return JSON.parse(body || "{}");
}

function destinationFromAction(action) {
  const identifier = action?.replace(/^external:/, "");
  if (!identifier) return "Unknown destination";
  return identifier.startsWith("dest:") ? decodeExternalDestination(identifier.slice(5)) || identifier : identifier;
}

function sourceFromRequest(url) {
  return url.searchParams.get("source")?.trim().slice(0, 100) || "unknown";
}

function shouldLogExternalAccess(request) {
  return !/(bot|canva)/i.test(request.headers["user-agent"] || "");
}

async function latestAccessLogs() {
  try {
    const contents = await readFile(accessLogPath, "utf8");
    return contents
      .trim()
      .split("\n")
      .filter(Boolean)
      .slice(-maximumAccessLogEntries)
      .reverse()
      .flatMap((line) => {
        try {
          const record = JSON.parse(line);
          return [{
            timestamp: record.timestamp || "Unknown time",
            accessed: destinationFromAction(record.action),
            source: record.source || "unknown",
            ipAddress: record.ipAddress || "unknown",
            userAgent: record.userAgent || "unknown",
          }];
        } catch {
          return [];
        }
      });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function appendAndTrimAccessLog(record) {
  await mkdir(logDirectory, { recursive: true });
  await appendFile(accessLogPath, `${JSON.stringify(record)}\n`, "utf8");
  const records = (await readFile(accessLogPath, "utf8")).split("\n").filter(Boolean);
  if (records.length > maximumAccessLogEntries) {
    await writeFile(accessLogPath, `${records.slice(-maximumAccessLogEntries).join("\n")}\n`, "utf8");
  }
}

function logExternalAccess(request, destination, source) {
  const record = {
    timestamp: new Date().toISOString(),
    action: `external:${destination}`,
    source,
    ipAddress: clientIp(request),
    userAgent: request.headers["user-agent"] || "unknown",
  };
  const write = pendingAccessLogWrite.catch(() => {}).then(() => appendAndTrimAccessLog(record));
  pendingAccessLogWrite = write;
  return write;
}

function clearAccessLogs() {
  const clear = pendingAccessLogWrite
    .catch(() => {})
    .then(async () => {
      await mkdir(logDirectory, { recursive: true });
      await writeFile(accessLogPath, "", "utf8");
    });
  pendingAccessLogWrite = clear;
  return clear;
}

function staticFileFor(pathname) {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = resolve(distDirectory, relativePath);
  return filePath.startsWith(`${distDirectory}${sep}`) ? filePath : null;
}

async function serveStaticFile(response, pathname, method) {
  const filePath = staticFileFor(pathname);
  if (!filePath) {
    response.writeHead(404).end("Not found");
    return;
  }

  try {
    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) throw new Error("Not a file");
    const body = method === "HEAD" ? undefined : await readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
      "content-length": String(fileInfo.size),
    });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const method = request.method || "GET";
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  const normalizedPathname = url.pathname.replace(/\/$/, "") || "/";
  const isAccessLogsLogin = normalizedPathname === "/api/access-logs/session";
  const isAccessLogsClear = normalizedPathname === "/api/access-logs" && method === "DELETE";
  if (method !== "GET" && method !== "HEAD" && !(method === "POST" && isAccessLogsLogin) && !isAccessLogsClear) {
    response.writeHead(405, { allow: "DELETE, GET, HEAD, POST" }).end("Method not allowed");
    return;
  }

  if (url.pathname === "/external") {
    const encodedDestination = url.searchParams.get("dest");
    const target = decodeExternalDestination(encodedDestination);
    if (!target) {
      response.writeHead(404).end("This external destination is not configured yet.");
      return;
    }

    try {
      if (shouldLogExternalAccess(request)) {
        await logExternalAccess(request, `dest:${encodedDestination}`, sourceFromRequest(url));
      }
      response.writeHead(302, { location: target }).end();
    } catch (error) {
      console.error("Could not log external-link access", error);
      response.writeHead(500).end("Could not record external-link access.");
    }
    return;
  }

  if (isAccessLogsLogin) {
    if (!accessLogsPassword) {
      response.writeHead(503, { "content-type": "text/plain; charset=utf-8" }).end("Access-log protection is not configured.");
      return;
    }
    try {
      const { password } = await requestJson(request);
      if (typeof password !== "string" || !constantTimeEquals(password, accessLogsPassword)) {
        response.writeHead(401, { "content-type": "application/json; charset=utf-8" }).end(JSON.stringify({ error: "Incorrect password." }));
        return;
      }
    } catch {
      response.writeHead(400, { "content-type": "application/json; charset=utf-8" }).end(JSON.stringify({ error: "Invalid sign-in request." }));
      return;
    }
    response.writeHead(204, { "set-cookie": accessLogsCookie(request, createAccessLogsSession(), accessLogsSessionLifetime / 1000) }).end();
    return;
  }

  if (normalizedPathname === "/api/access-logs") {
    if (!accessLogsPassword) {
      response.writeHead(503, { "content-type": "application/json; charset=utf-8" }).end(JSON.stringify({ error: "Access-log protection is not configured." }));
      return;
    }
    if (!accessLogsSessionIsValid(request)) {
      response.writeHead(401, { "content-type": "application/json; charset=utf-8" }).end(JSON.stringify({ error: "Sign in required." }));
      return;
    }
    if (method === "DELETE") {
      await clearAccessLogs();
      response.writeHead(204).end();
      return;
    }
    const records = await latestAccessLogs();
    const body = JSON.stringify(records);
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "content-length": String(Buffer.byteLength(body)),
    });
    response.end(method === "HEAD" ? undefined : body);
    return;
  }

  if (["/access-logs", "/access-logs.html"].includes(normalizedPathname)) {
    await serveStaticFile(response, "/access-logs.html", method);
    return;
  }

  if (caseStudyRoutes.has(normalizedPathname)) {
    await serveStaticFile(response, "/case-study.html", method);
    return;
  }

  await serveStaticFile(response, url.pathname, method);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}/`);
  console.log(`External-link access log: ${accessLogPath}`);
});
