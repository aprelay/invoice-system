-- Add account_email and template_used fields to email_queue
ALTER TABLE email_queue ADD COLUMN account_email TEXT;
ALTER TABLE email_queue ADD COLUMN template_used TEXT;
ALTER TABLE email_queue ADD COLUMN subject_line TEXT;
