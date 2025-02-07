import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Environment variables:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey
})

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  try {
    console.log('Starting webhook processing...')
    
    // Parse request body
    const body = await req.json()
    console.log('Parsed request body successfully')
    
    // Extract payment intent
    const paymentIntent = body.object
    console.log('Payment Intent:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    })
    
    // Extract charge
    const charge = paymentIntent.charges.data[0]
    console.log('Charge:', {
      id: charge.id,
      status: charge.status,
      shipping: charge.shipping,
      billing: charge.billing_details
    })
    
    // Prepare data for insertion
    const insertData = {
      type: 'payment_intent.succeeded',
      status: 'success',
      payment_status: paymentIntent.status,
      customer_name: charge.shipping?.name || charge.billing_details?.name || null,
      customer_email: charge.billing_details?.email || null,
      customer_phone: charge.shipping?.phone || charge.billing_details?.phone || null,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      raw_payload: body
    }
    console.log('Prepared data for insertion:', insertData)

    // Insert into Supabase
    console.log('Attempting to insert into Supabase...')
    const { data, error } = await supabase
      .from('stripe_webhook_events')
      .insert(insertData)
      .select()

    if (error) {
      console.error('Error inserting webhook event:', error)
      return new NextResponse(JSON.stringify(error), { status: 500 })
    }

    console.log('Successfully inserted data:', data)
    return new NextResponse(JSON.stringify({ success: true, data }), { status: 200 })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new NextResponse(JSON.stringify({ error: String(err) }), { status: 400 })
  }
}
