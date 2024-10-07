// hotels

import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// GET route for fetching hotels purely via city
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityCode = searchParams.get('cityCode') || 'PAR';

  try {
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode
    });
    const parsedHotels = response.data.map((hotel: any) => ({
      hotelId: hotel.hotelId,
      name: hotel.name,
      iataCode: hotel.iataCode,
      address: hotel.address,
      geoCode: hotel.geoCode,
      chainCode: hotel.chainCode
    }));
    return NextResponse.json({ hotels: parsedHotels });
  } 
  catch (error) {
    console.error('Amadeus API error:', error);
    return NextResponse.json({ error: 'Error fetching hotels' }, { status: 500 });
  }
}

// POST route for detailed hotel search, this one doesn't work yet
export async function POST(request: Request) {
  const body = await request.json();
  const { cityCode, checkInDate, checkOutDate, adults, roomQuantity } = body;
  try {
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: cityCode,
      checkOutDate: checkOutDate,
      adults: adults,
      roomQuantity: roomQuantity,
      currency: 'USD',
      paymentPolicy: 'NONE',
      includeClosed: false,
      bestRateOnly: true,
      view: 'FULL'
    });

    const parsedOffers = response.data.map((offer: any) => ({
      type: offer.type,
      hotel: {
        hotelId: offer.hotel.hotelId,
        chainCode: offer.hotel.chainCode,
        name: offer.hotel.name,
        cityCode: offer.hotel.cityCode,
        latitude: offer.hotel.latitude,
        longitude: offer.hotel.longitude
      },
      available: offer.available,
      offers: offer.offers.map((hotelOffer: any) => ({
        id: hotelOffer.id,
        checkInDate: hotelOffer.checkInDate,
        checkOutDate: hotelOffer.checkOutDate,
        rateCode: hotelOffer.rateCode,
        room: {
          type: hotelOffer.room.type,
          typeEstimated: hotelOffer.room.typeEstimated,
          description: hotelOffer.room.description
        },
        guests: hotelOffer.guests,
        price: {
          currency: hotelOffer.price.currency,
          total: hotelOffer.price.total,
          variations: hotelOffer.price.variations
        },
        policies: hotelOffer.policies
      }))
    }));

    return NextResponse.json({ offers: parsedOffers });
  } 
  catch (error) {
    console.error('Amadeus API error:', error);
    return NextResponse.json({ error: 'Error fetching hotel offers' }, { status: 500 });
  }
}