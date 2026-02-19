-- Add OTP fields to requests table
ALTER TABLE requests ADD COLUMN IF NOT EXISTS session_otp TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS otp_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMPTZ;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS session_verified_at TIMESTAMPTZ;

-- Verify
SELECT id, status, session_otp, otp_verified FROM requests LIMIT 5;
