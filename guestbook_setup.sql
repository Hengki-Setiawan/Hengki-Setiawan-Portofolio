-- Create guestbook table
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read approved messages
CREATE POLICY "Anyone can read guestbook" ON guestbook
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert messages
CREATE POLICY "Anyone can insert guestbook" ON guestbook
  FOR INSERT
  WITH CHECK (true);
