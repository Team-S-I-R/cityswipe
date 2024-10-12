/*
import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY || '';
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET || '';
const amadeus = new Amadeus({
  clientId: AMADEUS_API_KEY,
  clientSecret: AMADEUS_API_SECRET
});

export async function GET(request: Request) {
  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    return NextResponse.json({ error: 'Amadeus API credentials are not set' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const adults = searchParams.get('adults') || '1';

  if (!originLocationCode || !destinationLocationCode || !departureDate) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const response = await amadeus.client.get('/v2/shopping/flight-offers', {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults: parseInt(adults,10),
      max: 10
    });

    if (!response || !response.result) {
      throw new Error('invalid response from Amadeus API');
    }

    return NextResponse.json(response.result);
  } catch (error) {
    console.error('amadeus API error:', error);
    return NextResponse.json({ error: 'error fetching flight offers', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
*/

// Boilerplate code to prevent build errors
export async function GET(request: Request) {
  return new Response('This is a placeholder response.');
}