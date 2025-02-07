-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access" ON webhook_events;

-- Enable RLS
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access
CREATE POLICY "Allow anonymous read access"
ON webhook_events
FOR SELECT
TO anon
USING (true);

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON webhook_events TO anon;
