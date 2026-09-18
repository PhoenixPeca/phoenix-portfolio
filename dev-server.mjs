import { createServer } from "node:http";
import { appendFile, mkdir, readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 4173);
const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const distDirectory = resolve(projectRoot, "dist");
const logDirectory = resolve(projectRoot, "logs");
const accessLogPath = resolve(logDirectory, "external-link-access.jsonl");

const destinations = {
  "resume-link": "https://drive.google.com/file/d/1CO6aJz0FBqTlbBVSd61vT6Oe9bGjIcuk/view?usp=sharing",
  "gwa-certification-link": "https://drive.google.com/file/d/1480e45vMyRMuDOfHcEok43X-P21HcGBs/view?usp=sharing",
  "phoenix-aspacio-blog": "https://phoenix.aspac.io/",
  "phoenix-aspacio-linkedin": "https://linkedin.com/in/phoenix-aspacio/",
  "phoenix-aspacio-github": "https://github.com/PhoenixPeca",
  "wend-philippines": "https://wendyourway.com/",
  "rakwireless": "https://www.rakwireless.com/en-us",
  "mntd": "https://getmntd.com/",
  "seaplane": "https://www.seaplanehk.com/",
  "spud": "https://spud.edu.ph/",
  "ingenuiti": "https://www.ingenuiti.com/",
  "livehelp4us": "https://livehelp4us.com/",
};
const caseStudyDestinations = [
  "https://docs.rakwireless.com/",
  "https://downloads.rakwireless.com/",
  "https://print-docs.rakwireless.com/",
  "https://news.rakwireless.com/",
  "https://store.rakwireless.com/",
  "https://learn.rakwireless.com/",
];
const approvedDestinations = new Set([...Object.values(destinations), ...caseStudyDestinations].map((destination) => new URL(destination).href));
const caseStudyRoutes = new Set(["/case-study/wend", "/case-study/rakwireless"]);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function clientIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const address = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return address?.split(",")[0].trim() || request.socket.remoteAddress || "unknown";
}

function decodeApprovedDestination(encodedDestination) {
  if (!encodedDestination || !/^[A-Za-z0-9_-]+$/.test(encodedDestination)) return null;

  try {
    const target = new URL(Buffer.from(encodedDestination, "base64url").toString("utf8"));
    return approvedDestinations.has(target.href) ? target.href : null;
  } catch {
    return null;
  }
}

async function logExternalAccess(request, destination) {
  await mkdir(logDirectory, { recursive: true });
  const record = {
    timestamp: new Date().toISOString(),
    action: `external:${destination}`,
    ipAddress: clientIp(request),
    userAgent: request.headers["user-agent"] || "unknown",
  };
  await appendFile(accessLogPath, `${JSON.stringify(record)}\n`, "utf8");
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

  if (method !== "GET" && method !== "HEAD") {
    response.writeHead(405, { allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  if (url.pathname === "/external") {
    const encodedDestination = url.searchParams.get("dest");
    const destination = url.searchParams.get("destination");
    const target = encodedDestination
      ? decodeApprovedDestination(encodedDestination)
      : (destination ? destinations[destination] : null);
    if (!target) {
      response.writeHead(404).end("This external destination is not configured yet.");
      return;
    }

    try {
      await logExternalAccess(request, encodedDestination ? `dest:${encodedDestination}` : destination);
      response.writeHead(302, { location: target }).end();
    } catch (error) {
      console.error("Could not log external-link access", error);
      response.writeHead(500).end("Could not record external-link access.");
    }
    return;
  }

  if (caseStudyRoutes.has(url.pathname.replace(/\/$/, ""))) {
    await serveStaticFile(response, "/case-study.html", method);
    return;
  }

  await serveStaticFile(response, url.pathname, method);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}/`);
  console.log(`External-link access log: ${accessLogPath}`);
});
