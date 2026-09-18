const createDownloadsTable = `
  CREATE TABLE IF NOT EXISTS resume_downloads (
    id INTEGER PRIMARY KEY,
    downloaded_at TEXT NOT NULL,
    action TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'unknown',
    ip_address TEXT,
    user_agent TEXT
  )
`;

const createDownloadedAtIndex = `
  CREATE INDEX IF NOT EXISTS idx_resume_downloads_downloaded_at
  ON resume_downloads(downloaded_at)
`;
const addSourceColumn = `
  ALTER TABLE resume_downloads
  ADD COLUMN source TEXT NOT NULL DEFAULT 'unknown'
`;
const pruneAccessLogs = `
  DELETE FROM resume_downloads
  WHERE id NOT IN (
    SELECT id FROM resume_downloads
    ORDER BY downloaded_at DESC, id DESC
    LIMIT 100
  )
`;

let databaseReady;
const caseStudyRoutes = new Set(["/case-study/wend", "/case-study/rakwireless"]);
const accessLogsSessionLifetime = 60 * 60 * 1000;
const encoder = new TextEncoder();

function decodeExternalDestination(encodedDestination) {
  const normalizedDestination = encodedDestination?.replace(/=+$/, "");
  if (!normalizedDestination || !/^[A-Za-z0-9_-]+$/.test(normalizedDestination)) return null;

  try {
    const base64 = normalizedDestination.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const target = new URL(decoded);
    return target.protocol === "https:" ? target.href : null;
  } catch {
    return null;
  }
}

function bytesToBase64Url(bytes) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function accessLogsSignature(payload, password) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function createAccessLogsSession(password) {
  const expiresAt = Date.now() + accessLogsSessionLifetime;
  const payload = `${expiresAt}.${crypto.randomUUID()}`;
  return `${payload}.${await accessLogsSignature(payload, password)}`;
}

async function accessLogsSessionIsValid(request, password) {
  const session = request.headers.get("Cookie")?.match(/(?:^|;\s*)access_logs_session=([^;]+)/)?.[1];
  if (!session || !password) return false;
  const separator = session.lastIndexOf(".");
  if (separator === -1) return false;
  const payload = session.slice(0, separator);
  const expiresAt = Number(payload.slice(0, payload.indexOf(".")));
  return Number.isFinite(expiresAt)
    && expiresAt > Date.now()
    && session.slice(separator + 1) === await accessLogsSignature(payload, password);
}

function accessLogsCookie(request, value, maxAge) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `access_logs_session=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${secure}`;
}

function destinationFromAction(action) {
  const identifier = action?.replace(/^external:/, "");
  if (!identifier) return "Unknown destination";
  return identifier.startsWith("dest:") ? decodeExternalDestination(identifier.slice(5)) || identifier : identifier;
}

function sourceFromUrl(url) {
  return url.searchParams.get("source")?.trim().slice(0, 100) || "unknown";
}

function shouldLogExternalAccess(request) {
  return !/bot/i.test(request.headers.get("User-Agent") || "");
}

async function latestAccessLogs(env) {
  await ensureDatabase(env);
  const result = await env.DB.prepare(
    "SELECT downloaded_at, action, source, ip_address, user_agent FROM resume_downloads ORDER BY downloaded_at DESC, id DESC LIMIT 100",
  ).all();
  return result.results.map((record) => ({
    timestamp: record.downloaded_at,
    accessed: destinationFromAction(record.action),
    source: record.source || "unknown",
    ipAddress: record.ip_address || "unknown",
    userAgent: record.user_agent || "unknown",
  }));
}

function ensureDatabase(env) {
  if (!databaseReady) {
    databaseReady = (async () => {
      await env.DB.batch([
        env.DB.prepare(createDownloadsTable),
        env.DB.prepare(createDownloadedAtIndex),
      ]);
      const columnInfo = await env.DB.prepare("PRAGMA table_info(resume_downloads)").all();
      if (!columnInfo.results.some((column) => column.name === "source")) {
        try {
          await env.DB.prepare(addSourceColumn).run();
        } catch (error) {
          if (!String(error).includes("duplicate column name")) throw error;
        }
      }
    })().catch((error) => {
      databaseReady = undefined;
      throw error;
    });
  }
  return databaseReady;
}

async function logDocumentAccess(request, env, action, source) {
  const forwardedFor = request.headers.get("X-Forwarded-For");
  const forwarded = request.headers.get("Forwarded");
  const forwardedIp = forwarded?.match(/(?:^|;)\s*for=(?:"?\[?)([^;\]",]+)/i)?.[1];
  const ipAddress = request.headers.get("CF-Connecting-IP")
    || forwardedFor?.split(",")[0].trim()
    || forwardedIp
    || request.headers.get("X-Real-IP")
    || null;
  const userAgent = (request.headers.get("User-Agent") || "unavailable").slice(0, 512);

  await ensureDatabase(env);
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO resume_downloads (downloaded_at, action, source, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)",
    ).bind(new Date().toISOString(), action, source, ipAddress, userAgent),
    env.DB.prepare(pruneAccessLogs),
  ]);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const normalizedPathname = url.pathname.replace(/\/$/, "") || "/";
    const isAccessLogsLogin = normalizedPathname === "/api/access-logs/session";
    if (isAccessLogsLogin) {
      if (!env.ACCESS_LOGS_PASSWORD) {
        return new Response("Access-log protection is not configured.", { status: 503 });
      }
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      try {
        const { password } = await request.json();
        if (typeof password !== "string" || password !== env.ACCESS_LOGS_PASSWORD) {
          return Response.json({ error: "Incorrect password." }, { status: 401 });
        }
      } catch {
        return Response.json({ error: "Invalid sign-in request." }, { status: 400 });
      }
      return new Response(null, {
        status: 204,
        headers: { "Set-Cookie": accessLogsCookie(request, await createAccessLogsSession(env.ACCESS_LOGS_PASSWORD), accessLogsSessionLifetime / 1000) },
      });
    }
    if (normalizedPathname === "/api/access-logs") {
      if (!env.ACCESS_LOGS_PASSWORD) {
        return Response.json({ error: "Access-log protection is not configured." }, { status: 503 });
      }
      if (!await accessLogsSessionIsValid(request, env.ACCESS_LOGS_PASSWORD)) {
        return Response.json({ error: "Sign in required." }, { status: 401 });
      }
      if (request.method === "DELETE") {
        await ensureDatabase(env);
        await env.DB.prepare("DELETE FROM resume_downloads").run();
        return new Response(null, { status: 204 });
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", { status: 405, headers: { Allow: "DELETE, GET, HEAD" } });
      }
      return Response.json(await latestAccessLogs(env), { headers: { "Cache-Control": "no-store" } });
    }
    if (["/access-logs", "/access-logs.html"].includes(normalizedPathname)) {
      return env.ASSETS.fetch(new Request(new URL("/access-logs.html", request.url), request));
    }

    if (url.pathname === "/external") {
      const encodedDestination = url.searchParams.get("dest");
      const target = decodeExternalDestination(encodedDestination);

      if (!target) {
        return new Response("This external destination is not configured yet.", { status: 404 });
      }

      if (shouldLogExternalAccess(request)) {
        ctx.waitUntil(logDocumentAccess(request, env, `external:dest:${encodedDestination}`, sourceFromUrl(url)));
      }
      return Response.redirect(target, 302);
    }

    if (caseStudyRoutes.has(normalizedPathname)) {
      return env.ASSETS.fetch(new Request(new URL("/case-study.html", request.url), request));
    }

    if (url.pathname === "/") {
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }

    return env.ASSETS.fetch(request);
  },
};
