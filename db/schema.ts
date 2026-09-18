export const resumeDownloadsSchema = `
  CREATE TABLE IF NOT EXISTS resume_downloads (
    id INTEGER PRIMARY KEY,
    downloaded_at TEXT NOT NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT
  )
`;
