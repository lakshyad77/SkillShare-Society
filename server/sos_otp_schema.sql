-- Run this in Supabase SQL Editor

-- SOS ALERTS TABLE
CREATE TABLE IF NOT EXISTS sos_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
    latitude FLOAT8,
    longitude FLOAT8,
    address TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempt_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all" ON sos_alerts;
DROP POLICY IF EXISTS "Allow all" ON otp_verifications;

CREATE POLICY "Allow all" ON sos_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON otp_verifications FOR ALL USING (true) WITH CHECK (true);

-- Add phone_verified to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
