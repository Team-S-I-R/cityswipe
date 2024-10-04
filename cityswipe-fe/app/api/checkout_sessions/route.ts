import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { handleSubscriber } from '@/app/actions'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// essentially the goal is to just set this data and give it to the "handleSubscriber" function
let stripDataGoingToSupabase = {
  interval: "",
  currentPeriodEnd: 0,
  currentPeriodStart: 0,
  userId: "",
  stripeSubscriptionId: "",
  // we will reference the subscription status throughout the app
  status: "",
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json()
  
  try {
    const plan = data.plan

    console.log("plan: ", data);

    let priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData

    if (plan === 'Pro Monthly') {
      priceData = {
        currency: 'usd',
        product_data: {
          name: 'Pro Monthly Subscription',
        },
        unit_amount: 500, // $5.00
        recurring: {
          interval: 'month',
        },
      }

      
    } else if (plan === 'Pro Yearly') {
      priceData = {
        currency: 'usd',
        product_data: {
          name: 'Pro Yearly Subscription',
        },
        unit_amount: 5000, // $50.00
        recurring: {
          interval: 'year',
        },
      }

    } else {
      throw new Error('Invalid plan selected')
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: priceData,
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
    
    stripDataGoingToSupabase = {
      interval: priceData?.recurring?.interval || "",
      // how do i get this ?
      currentPeriodEnd: 0,
      currentPeriodStart: 0,
      userId: "",
      // and how do i get this ?
      stripeSubscriptionId: "",
      // we will reference the subscription status throughout the app
      status: checkoutSession.status || "",
    }

    // ANCHOR WILL ADD RESULTS TO DATABASE HERE
    await handleSubscriber(stripDataGoingToSupabase)

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