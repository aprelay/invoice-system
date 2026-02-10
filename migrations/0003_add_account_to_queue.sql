-- Add account_used field to email_queue to track which account sent each email
ALTER TABLE email_queue ADD COLUMN account_used TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_email_queue_account ON email_queue(account_used);
