CREATE TABLE IF NOT EXISTS resume_downloads (
  id INTEGER PRIMARY KEY,
  downloaded_at TEXT NOT NULL,
  action TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'unknown',
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_resume_downloads_downloaded_at
ON resume_downloads(downloaded_at);
