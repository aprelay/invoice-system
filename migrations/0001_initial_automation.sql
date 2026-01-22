-- Email Queue Table
CREATE TABLE IF NOT EXISTS email_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  work_order TEXT NOT NULL,
  reference TEXT NOT NULL,
  service TEXT NOT NULL,
  due_date TEXT NOT NULL,
  contact_email TEXT,
  status TEXT DEFAULT 'pending',  -- pending, sent, failed
  batch_id INTEGER,
  sent_at DATETIME,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Batch Tracking Table
CREATE TABLE IF NOT EXISTS batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_size INTEGER NOT NULL,
  emails_sent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'queued',  -- queued, sending, completed, failed
  url_used TEXT,
  account_used TEXT,
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- URL Rotation Table
CREATE TABLE IF NOT EXISTS url_rotation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Automation Config Table
CREATE TABLE IF NOT EXISTS automation_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),  -- Only one config row
  is_paused INTEGER DEFAULT 0,  -- 0 = running, 1 = paused
  current_url_position INTEGER DEFAULT 0,
  min_delay_minutes INTEGER DEFAULT 4,
  max_delay_minutes INTEGER DEFAULT 7,
  min_batch_size INTEGER DEFAULT 2,
  max_batch_size INTEGER DEFAULT 6,
  total_accounts INTEGER DEFAULT 10,
  warm_up_start_date TEXT,
  warm_up_multiplier REAL DEFAULT 0.2,  -- Start at 20% capacity
  last_send_time DATETIME,
  next_send_time DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Account Rotation Table
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_email TEXT NOT NULL UNIQUE,
  account_index INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  last_used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Metrics Table
CREATE TABLE IF NOT EXISTS metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  emails_sent INTEGER DEFAULT 0,
  emails_failed INTEGER DEFAULT 0,
  batches_completed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_batch_id ON email_queue(batch_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_url_rotation_position ON url_rotation(position);
CREATE INDEX IF NOT EXISTS idx_url_rotation_active ON url_rotation(is_active);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_active ON oauth_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date);

-- Insert default config
INSERT OR IGNORE INTO automation_config (id) VALUES (1);
