-- Run this in the Supabase SQL Editor to set up the visa_policies table.

CREATE TABLE visa_policies (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  passport TEXT NOT NULL,
  destination TEXT NOT NULL,
  policy INTEGER NOT NULL DEFAULT 1,
  duration INTEGER NOT NULL DEFAULT 0,
  UNIQUE(passport, destination)
);

-- Index for fast lookups by passport country
CREATE INDEX idx_visa_policies_passport ON visa_policies (passport);

-- Enable Row Level Security
ALTER TABLE visa_policies ENABLE ROW LEVEL SECURITY;

-- Allow public reads (the anon key can read)
CREATE POLICY "Allow public read" ON visa_policies
  FOR SELECT USING (true);

-- Allow inserts/updates/deletes only via service role (API routes use ADMIN_PASSWORD check)
CREATE POLICY "Allow authenticated writes" ON visa_policies
  FOR ALL USING (true) WITH CHECK (true);
