import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;

    // Verify webhook signature if secret is configured
    if (stripeSecretKey && stripeWebhookSecret && signature) {
      const Stripe = (await import("https://esm.sh/stripe@14.21.0")).default;
      const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
      
      try {
        event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Parse without verification (for development)
      event = JSON.parse(body);
      console.warn('Stripe webhook signature not verified - development mode');
    }

    console.log('Received Stripe webhook:', event.type);

    // Handle relevant events
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const obj = event.data.object;
      const metadata = obj.metadata || {};
      const licenseId = metadata.license_id;

      if (!licenseId) {
        console.error('No license_id in webhook metadata');
        return new Response(
          JSON.stringify({ error: 'No license_id in metadata' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Processing payment for license: ${licenseId}`);

      // Look up by license_id (not database id)
      const { data: request, error: requestError } = await supabase
        .from('license_requests')
        .select('*')
        .eq('license_id', licenseId)
        .single();

      if (requestError || !request) {
        console.error('License not found for license_id:', licenseId);
        return new Response(
          JSON.stringify({ error: 'License not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Extract payment details
      const paymentIntentId = event.type === 'payment_intent.succeeded' 
        ? obj.id 
        : obj.payment_intent;
      const chargeId = obj.latest_charge || null;

      // Update payment status
      const updateData: Record<string, unknown> = {
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntentId,
        paid_at: new Date().toISOString(),
      };

      if (chargeId) {
        updateData.stripe_charge_id = chargeId;
      }

      // Check if signature is also complete to advance to 'done'
      if (request.signature_status === 'completed') {
        updateData.status = 'done';
      } else {
        // Payment complete but awaiting signature
        updateData.status = 'awaiting_signature';
      }

      const { error: updateError } = await supabase
        .from('license_requests')
        .update(updateData)
        .eq('id', request.id);

      if (updateError) {
        console.error('Error updating license:', updateError);
      }

      // Add audit entry to status_history
      await supabase.from('status_history').insert({
        request_id: request.id,
        from_status: request.status,
        to_status: updateData.status as string,
        notes: `Payment completed. License ID: ${licenseId}. Payment Intent: ${paymentIntentId}`,
      });

      console.log(`Payment processed for license ${licenseId}. Status: ${updateData.status}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          license_id: licenseId,
          payment_status: 'paid',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle failed payments
    if (event.type === 'payment_intent.payment_failed') {
      const obj = event.data.object;
      const metadata = obj.metadata || {};
      const licenseId = metadata.license_id;

      if (licenseId) {
        const { data: request } = await supabase
          .from('license_requests')
          .select('id, status')
          .eq('license_id', licenseId)
          .single();

        if (request) {
          await supabase
            .from('license_requests')
            .update({ payment_status: 'failed' })
            .eq('id', request.id);

          await supabase.from('status_history').insert({
            request_id: request.id,
            from_status: request.status,
            to_status: request.status,
            notes: `Payment failed. License ID: ${licenseId}`,
          });

          console.log(`Payment failed for license ${licenseId}`);
        }
      }
    }

    // Handle refunds
    if (event.type === 'charge.refunded') {
      const obj = event.data.object;
      const metadata = obj.metadata || {};
      const licenseId = metadata.license_id;

      if (licenseId) {
        const { data: request } = await supabase
          .from('license_requests')
          .select('id, status')
          .eq('license_id', licenseId)
          .single();

        if (request) {
          await supabase
            .from('license_requests')
            .update({ payment_status: 'refunded' })
            .eq('id', request.id);

          await supabase.from('status_history').insert({
            request_id: request.id,
            from_status: request.status,
            to_status: request.status,
            notes: `Payment refunded. License ID: ${licenseId}`,
          });

          console.log(`Payment refunded for license ${licenseId}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in stripe-webhook:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
