import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { license_id, success_url, cancel_url } = await req.json();

    if (!license_id) {
      return new Response(
        JSON.stringify({ error: 'license_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating Stripe checkout for license: ${license_id}`);

    // Fetch the license request by license_id (not database id)
    const { data: request, error: requestError } = await supabase
      .from('license_requests')
      .select('*')
      .eq('license_id', license_id)
      .single();

    if (requestError || !request) {
      console.error('License not found:', license_id);
      return new Response(
        JSON.stringify({ error: 'License not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify license is approved before creating checkout
    if (request.status !== 'approved' && request.status !== 'awaiting_payment' && request.status !== 'awaiting_signature') {
      return new Response(
        JSON.stringify({ error: 'License must be approved before payment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify license_id exists
    if (!request.license_id) {
      return new Response(
        JSON.stringify({ error: 'License ID not generated' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if Stripe is configured
    if (!stripeSecretKey) {
      console.log('Stripe not configured - returning mock checkout URL');
      // Return mock URL for development/testing
      return new Response(
        JSON.stringify({
          success: true,
          checkout_url: `${success_url}?session_id=mock_session_${license_id}`,
          message: 'Stripe not configured. Using mock checkout.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Import Stripe dynamically
    const Stripe = (await import("https://esm.sh/stripe@14.21.0")).default;
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Prepare licensee name
    const licenseeName = request.first_name && request.last_name 
      ? `${request.first_name} ${request.last_name}`
      : request.licensee_legal_name || 'Unknown';

    // Prepare metadata (locked format per spec)
    const metadata = {
      license_id: request.license_id,
      track_title: request.track_title || request.song_title || 'Unknown Track',
      licensee_email: request.licensee_email || '',
      licensee_name: licenseeName,
    };

    // Get or create amount (in cents)
    const amount = request.license_fee 
      ? Math.round(request.license_fee * 100) 
      : (request.proposed_fee ? Math.round(request.proposed_fee * 100) : 0);

    if (amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'License fee not set' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: request.currency?.toLowerCase() || 'usd',
            product_data: {
              name: `License: ${metadata.track_title}`,
              description: `License ID: ${request.license_id}`,
              metadata,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url || `${supabaseUrl}/agreement/${request.id}?payment=success`,
      cancel_url: cancel_url || `${supabaseUrl}/agreement/${request.id}?payment=cancelled`,
      customer_email: request.licensee_email || undefined,
      metadata,
      payment_intent_data: {
        metadata,
      },
    });

    console.log(`Stripe checkout session created: ${session.id} for license: ${request.license_id}`);

    // Update request with pending payment status
    await supabase
      .from('license_requests')
      .update({
        payment_status: 'pending',
      })
      .eq('id', request.id);

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: session.url,
        session_id: session.id,
        license_id: request.license_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in create-stripe-checkout:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
