export const resumeDownloadsSchema = `
  CREATE TABLE IF NOT EXISTS resume_downloads (
    id INTEGER PRIMARY KEY,
    downloaded_at TEXT NOT NULL,
    action TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'unknown',
    ip_address TEXT,
    user_agent TEXT
  )
`;
