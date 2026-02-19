-- SkillShare Society - Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone_number TEXT,
    emergency_contact TEXT, -- Added for safety features
    apartment_name TEXT,
    block TEXT,
    flat_number TEXT,
    role TEXT DEFAULT 'Requester',
    skills_offered TEXT[] DEFAULT '{}',
    availability TEXT[] DEFAULT '{}',
    latitude FLOAT8,
    longitude FLOAT8,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- REQUESTS TABLE (Updated with session tracking columns)
CREATE TABLE IF NOT EXISTS requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    required_skill TEXT NOT NULL,
    requested_time TEXT,
    distance FLOAT8 DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    
    -- New columns for session security and tracking
    session_otp TEXT,
    otp_verified BOOLEAN DEFAULT FALSE,
    session_started_at TIMESTAMPTZ,
    session_verified_at TIMESTAMPTZ,
    session_ended_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow all operations (Development Mode)
DROP POLICY IF EXISTS "Allow all" ON users;
DROP POLICY IF EXISTS "Allow all" ON requests;
DROP POLICY IF EXISTS "Allow all" ON notifications;

CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- MIGRATION SCRIPT (Run if tables already exist)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
-- ALTER TABLE requests ADD COLUMN IF NOT EXISTS session_otp TEXT;
-- ALTER TABLE requests ADD COLUMN IF NOT EXISTS otp_verified BOOLEAN DEFAULT FALSE;
-- ALTER TABLE requests ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMPTZ;
-- ALTER TABLE requests ADD COLUMN IF NOT EXISTS session_verified_at TIMESTAMPTZ;
-- ALTER TABLE requests ADD COLUMN IF NOT EXISTS session_ended_at TIMESTAMPTZ;
