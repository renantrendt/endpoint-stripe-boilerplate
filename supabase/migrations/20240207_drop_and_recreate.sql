-- First, drop all related objects
DROP TRIGGER IF EXISTS process_webhook_payload ON webhook_events;
DROP TRIGGER IF EXISTS update_webhook_events_updated_at ON webhook_events;
DROP FUNCTION IF EXISTS process_stripe_webhook_payload();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS webhook_events;

-- Create webhook_events table
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR,
    status VARCHAR,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    response_time INTEGER DEFAULT NULL,
    payload_size INTEGER DEFAULT NULL,
    attribution VARCHAR,
    created TIMESTAMPTZ DEFAULT NOW(),
    invoice VARCHAR DEFAULT NULL,
    currency VARCHAR DEFAULT NULL,
    customer VARCHAR DEFAULT NULL,
    livemode BOOLEAN DEFAULT NULL,
    metadata JSONB DEFAULT NULL,
    shipping_name VARCHAR DEFAULT NULL,
    shipping_phone VARCHAR DEFAULT NULL,
    shipping_address_city VARCHAR DEFAULT NULL,
    shipping_address_line1 VARCHAR DEFAULT NULL,
    shipping_address_line2 VARCHAR DEFAULT NULL,
    shipping_address_state VARCHAR DEFAULT NULL,
    shipping_address_country VARCHAR DEFAULT NULL,
    shipping_address_postal_code VARCHAR DEFAULT NULL,
    client_secret VARCHAR DEFAULT NULL,
    latest_charge VARCHAR DEFAULT NULL,
    amount_received BIGINT DEFAULT NULL,
    amount_capturable BIGINT DEFAULT NULL,
    customer_name VARCHAR DEFAULT NULL,
    customer_email VARCHAR DEFAULT NULL,
    customer_phone VARCHAR DEFAULT NULL,
    amount_paid BIGINT DEFAULT NULL,
    capture_method VARCHAR DEFAULT NULL,
    payment_method VARCHAR DEFAULT NULL,
    payment_method_types JSONB DEFAULT NULL,
    statement_descriptor VARCHAR DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    payload JSONB DEFAULT NULL
);

-- Create function to process Stripe webhook payload
CREATE OR REPLACE FUNCTION process_stripe_webhook_payload()
RETURNS TRIGGER AS $$
BEGIN
    -- Extract basic information
    NEW.type := NEW.payload->>'object';
    NEW.status := NEW.payload->>'status';
    NEW.created := to_timestamp((NEW.payload->>'created')::bigint);
    NEW.currency := NEW.payload->>'currency';
    NEW.customer := NEW.payload->>'customer';
    NEW.livemode := (NEW.payload->>'livemode')::boolean;
    NEW.payment_method := NEW.payload->>'payment_method';
    NEW.invoice := NEW.payload->>'invoice';
    NEW.statement_descriptor := NEW.payload->>'statement_descriptor';
    NEW.amount_received := (NEW.payload->>'amount')::bigint;
    NEW.amount_paid := (NEW.payload->>'amount')::bigint;
    
    -- Extract customer information from billing_details and shipping
    NEW.customer_name := COALESCE(
        NEW.payload->'billing_details'->>'name',
        NEW.payload->'shipping'->>'name'
    );
    NEW.customer_email := NEW.payload->'billing_details'->>'email';
    NEW.customer_phone := COALESCE(
        NEW.payload->'billing_details'->>'phone',
        NEW.payload->'shipping'->>'phone'
    );
    
    -- Extract shipping information
    NEW.shipping_name := NEW.payload->'shipping'->>'name';
    NEW.shipping_phone := NEW.payload->'shipping'->>'phone';
    NEW.shipping_address_city := NEW.payload->'shipping'->'address'->>'city';
    NEW.shipping_address_line1 := NEW.payload->'shipping'->'address'->>'line1';
    NEW.shipping_address_line2 := NEW.payload->'shipping'->'address'->>'line2';
    NEW.shipping_address_state := NEW.payload->'shipping'->'address'->>'state';
    NEW.shipping_address_country := NEW.payload->'shipping'->'address'->>'country';
    NEW.shipping_address_postal_code := NEW.payload->'shipping'->'address'->>'postal_code';
    
    -- Extract metadata and payment method types
    NEW.metadata := NEW.payload->'metadata';
    NEW.payment_method_types := NEW.payload->'payment_method_types';
    
    -- Set payload size
    NEW.payload_size := octet_length(NEW.payload::text);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER process_webhook_payload
    BEFORE INSERT ON webhook_events
    FOR EACH ROW
    EXECUTE FUNCTION process_stripe_webhook_payload();

CREATE TRIGGER update_webhook_events_updated_at
    BEFORE UPDATE ON webhook_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS webhook_events_timestamp_idx ON webhook_events(timestamp);
CREATE INDEX IF NOT EXISTS webhook_events_type_idx ON webhook_events(type);
CREATE INDEX IF NOT EXISTS webhook_events_status_idx ON webhook_events(status);

-- Enable Row Level Security
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "service_role_access" ON webhook_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "anon_read_access" ON webhook_events
    FOR SELECT
    TO anon
    USING (true);

-- Grant necessary permissions
GRANT ALL ON webhook_events TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON webhook_events TO anon;
