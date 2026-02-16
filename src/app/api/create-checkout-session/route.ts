import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: Request) {
  try {
    const { service, provider, balance } = await request.json();

    // Basic validation
    if (!service || !provider || !balance) {
      return NextResponse.json({ error: 'Missing required bill information' }, { status: 400 });
    }

    // Get the origin URL for constructing success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create a Checkout Session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // Change currency if needed
            product_data: {
              name: service,
              description: `Billed by: ${provider}`,
            },
            unit_amount: Math.round(balance * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    });

    return NextResponse.json({ session });

  } catch (err: unknown) {
    console.error('Error creating Stripe session:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Error creating checkout session', details: message },
      { status: 500 },
    );
  }
}