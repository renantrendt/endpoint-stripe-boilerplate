-- Drop old table
DROP TABLE IF EXISTS webhook_events;

-- Create new table with a different name
CREATE TABLE stripe_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    payment_status VARCHAR,
    customer_name VARCHAR,
    customer_email VARCHAR,
    customer_phone VARCHAR,
    amount INTEGER,
    currency VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    raw_payload JSONB NOT NULL
);

-- Create indexes
CREATE INDEX stripe_webhook_events_created_at_idx ON stripe_webhook_events(created_at DESC);
CREATE INDEX stripe_webhook_events_payment_status_idx ON stripe_webhook_events(payment_status);
CREATE INDEX stripe_webhook_events_customer_email_idx ON stripe_webhook_events(customer_email);

-- Enable RLS
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow anonymous read access"
ON stripe_webhook_events FOR SELECT
TO anon
USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON stripe_webhook_events TO anon;
GRANT INSERT ON stripe_webhook_events TO service_role;
GRANT UPDATE ON stripe_webhook_events TO service_role;
