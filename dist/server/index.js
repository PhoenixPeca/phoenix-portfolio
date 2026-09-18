const createDownloadsTable = `
  CREATE TABLE IF NOT EXISTS resume_downloads (
    id INTEGER PRIMARY KEY,
    downloaded_at TEXT NOT NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT
  )
`;

const createDownloadedAtIndex = `
  CREATE INDEX IF NOT EXISTS idx_resume_downloads_downloaded_at
  ON resume_downloads(downloaded_at)
`;

let databaseReady;
const gwaCertificationUrl = "https://drive.google.com/file/d/1480e45vMyRMuDOfHcEok43X-P21HcGBs/view?usp=sharing";
const externalDestinations = {
  "resume-link": "https://drive.google.com/file/d/1CO6aJz0FBqTlbBVSd61vT6Oe9bGjIcuk/view?usp=sharing",
  "gwa-certification-link": gwaCertificationUrl,
  "phoenix-aspacio-blog": "https://phoenix.aspac.io/",
  "phoenix-aspacio-linkedin": "https://linkedin.com/in/phoenix-aspacio/",
  "phoenix-aspacio-github": "https://github.com/PhoenixPeca",
};
const approvedExternalUrls = new Set([
  ...Object.values(externalDestinations),
  "https://wendyourway.com/",
  "https://www.rakwireless.com/en-us",
  "https://getmntd.com/",
  "https://www.seaplanehk.com/",
  "https://spud.edu.ph/",
  "https://www.ingenuiti.com/",
  "https://livehelp4us.com/",
  "https://docs.rakwireless.com/",
  "https://downloads.rakwireless.com/",
  "https://print-docs.rakwireless.com/",
  "https://news.rakwireless.com/",
  "https://store.rakwireless.com/",
  "https://learn.rakwireless.com/",
].map((destination) => new URL(destination).href));
const caseStudyRoutes = new Set(["/case-study/wend", "/case-study/rakwireless"]);

function decodeApprovedDestination(encodedDestination) {
  if (!encodedDestination || !/^[A-Za-z0-9_-]+$/.test(encodedDestination)) return null;

  try {
    const base64 = encodedDestination.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const target = new URL(decoded);
    return approvedExternalUrls.has(target.href) ? target.href : null;
  } catch {
    return null;
  }
}

function ensureDatabase(env) {
  if (!databaseReady) {
    databaseReady = env.DB.batch([
      env.DB.prepare(createDownloadsTable),
      env.DB.prepare(createDownloadedAtIndex),
    ]).catch((error) => {
      databaseReady = undefined;
      throw error;
    });
  }
  return databaseReady;
}

async function logDocumentAccess(request, env, action) {
  const ipAddress = request.headers.get("CF-Connecting-IP") || null;
  const userAgent = (request.headers.get("User-Agent") || "unavailable").slice(0, 512);

  await ensureDatabase(env);
  await env.DB.prepare(
    "INSERT INTO resume_downloads (downloaded_at, action, ip_address, user_agent) VALUES (?, ?, ?, ?)",
  )
    .bind(new Date().toISOString(), action, ipAddress, userAgent)
    .run();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/external") {
      const encodedDestination = url.searchParams.get("dest");
      const destination = url.searchParams.get("destination");
      const target = encodedDestination
        ? decodeApprovedDestination(encodedDestination)
        : (destination ? externalDestinations[destination] : null);

      if (!target) {
        return new Response("This external destination is not configured yet.", { status: 404 });
      }

      ctx.waitUntil(logDocumentAccess(request, env, `external:${encodedDestination ? `dest:${encodedDestination}` : destination}`));
      return Response.redirect(target, 302);
    }

    if (caseStudyRoutes.has(url.pathname.replace(/\/$/, ""))) {
      return env.ASSETS.fetch(new Request(new URL("/case-study.html", request.url), request));
    }

    if (url.pathname === "/") {
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }

    return env.ASSETS.fetch(request);
  },
};
