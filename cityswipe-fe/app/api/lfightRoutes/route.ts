// flightRoutes

import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || 'NYC';
  const destination = searchParams.get('destination') || 'PAR';
  const departureDate = searchParams.get('departureDate') || '2024-11-01';

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: '1',
      max: '5'
    });

    const parsedFlights = response.data.map((flight: any) => ({
      id: flight.id,
      price: {
        total: flight.price.total,
        currency: flight.price.currency
      },
      itineraries: flight.itineraries.map((itinerary: any) => ({
        duration: itinerary.duration,
        segments: itinerary.segments.map((segment: any) => ({
          departure: {
            iataCode: segment.departure.iataCode,
            at: segment.departure.at
          },
          arrival: {
            iataCode: segment.arrival.iataCode,
            at: segment.arrival.at
          },
          carrierCode: segment.carrierCode,
          number: segment.number,
          aircraft: {
            code: segment.aircraft.code
          },
          duration: segment.duration
        }))
      }))
    }));

    return NextResponse.json({ flights: parsedFlights });
  } catch (error) {
    console.error('Amadeus API error:', error);
    return NextResponse.json({ error: 'Error fetching flight routes' }, { status: 500 });
  }
}
