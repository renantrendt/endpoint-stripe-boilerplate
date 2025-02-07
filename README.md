# Stripe Webhook Dashboard Boilerplate

A Next.js + Supabase boilerplate for handling Stripe webhooks with automatic data extraction and a beautiful dashboard interface.

## Features

- 🔄 Real-time webhook event monitoring
- 📊 Beautiful dashboard interface
- 🔒 Secure webhook handling with Stripe signatures
- 📱 Responsive design
- 🎯 Automatic data extraction from Stripe payloads

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/endpoint-stripe-boilerplate.git
cd endpoint-stripe-boilerplate
npm install
```

### 2. Environment Setup

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. Database Setup

1. Create a new project in Supabase
2. Run the following migration in Supabase SQL Editor:

```sql
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
```

3. Create the trigger function for automatic data extraction:

```sql
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
    
    -- Extract customer information
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
    
    -- Set payload size
    NEW.payload_size := octet_length(NEW.payload::text);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER process_webhook_payload
    BEFORE INSERT ON webhook_events
    FOR EACH ROW
    EXECUTE FUNCTION process_stripe_webhook_payload();
```

4. Set up the necessary permissions:

```sql
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
```

### 4. Edge Function Setup

1. Create a new Edge Function in Supabase:
   ```bash
   supabase functions new stripe-webhook
   ```

2. Add the following code to the function:
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   }

   serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders })
     }

     try {
       const supabase = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
       )

       const payload = await req.json()

       const { error } = await supabase
         .from('webhook_events')
         .insert([
           {
             payload: payload,
           },
         ])

       if (error) throw error

       return new Response(JSON.stringify({ success: true }), {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 200,
       })
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 400,
       })
     }
   })
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy stripe-webhook
   ```

### 5. Stripe Webhook Configuration

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add Endpoint"
3. Add your Supabase Edge Function URL:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/functions/v1/stripe-webhook
   ```
4. Select the events you want to listen to (e.g., `payment_intent.succeeded`)
5. Copy the Webhook Signing Secret and add it to your environment variables

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your webhook dashboard!

## Contributing

Feel free to open issues and pull requests!

## License

MIT
