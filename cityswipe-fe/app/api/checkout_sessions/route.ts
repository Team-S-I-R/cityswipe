import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { NextRequest } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest): Promise<NextResponse> {
//   const data = await req.json()
  
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Pro Subscription`,
            },
            unit_amount: Math.round(19.99 * 100),
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get(
        'origin',
      )}/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        'origin',
      )}/results?session_id={CHECKOUT_SESSION_ID}`,
    }
    
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)
    
    return NextResponse.json(checkoutSession, {
      status: 200,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
        status: 500,
      })
    }
    return new NextResponse(JSON.stringify({ error: { message: 'An unknown error occurred' } }), {
      status: 500,
    })
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  const session_id = searchParams.get('session_id')

  try {
    if (!session_id) {
      throw new Error('Session ID is required')
    }

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(session_id)

    return NextResponse.json(checkoutSession)
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
    return NextResponse.json({ error: { message: 'An unknown error occurred' } }, { status: 500 })
  }
}