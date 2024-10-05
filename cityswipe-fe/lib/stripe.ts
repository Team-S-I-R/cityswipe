import Stripe from 'stripe';

const sk = process.env.STRIPE_SECRET_KEY as string

export const stripe = new Stripe(sk, {
    typescript: true,
})


export const getStripeSession = async ({ priceId, domainUrl, customerId }: { priceId: string, domainUrl: string, customerId: string }) => {
    
    let priceData = {}
    
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        billing_address_collection: 'auto',
        line_items: [
            { 
                price: priceId, 
                quantity: 1,
            }
        ],
        payment_method_types: ['card'],
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
        success_url: `${domainUrl}/results/success`,
        cancel_url: `${domainUrl}/results/cancelled`, // Added missing comma
    });
  
    return session.url as string;
};