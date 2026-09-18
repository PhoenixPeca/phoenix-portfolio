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

    if (url.pathname === "/gwa-certification") {
      ctx.waitUntil(logDocumentAccess(request, env, "gwa_certification"));
      return Response.redirect(gwaCertificationUrl, 302);
    }

    if (url.pathname === "/resume" || url.pathname === "/resume.pdf") {
      const action = url.searchParams.get("download") === "1" ? "download" : "view";
      ctx.waitUntil(logDocumentAccess(request, env, action));

      const resumeUrl = new URL("/resume.pdf", request.url);
      const response = await env.ASSETS.fetch(new Request(resumeUrl, request));
      const headers = new Headers(response.headers);
      headers.set("Content-Disposition", `${action === "download" ? "attachment" : "inline"}; filename="Phoenix-Eve-Aspacio-Resume.pdf"`);
      headers.set("Cache-Control", "private, no-store");
      return new Response(response.body, { status: response.status, headers });
    }

    return env.ASSETS.fetch(request);
  },
};
