// Booking.com API route for fetching hotels in a city
import { NextResponse } from 'next/server';

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const BOOKING_API_HOST = 'booking-com.p.rapidapi.com';

// GET route for fetching hotels from Booking.com
export async function GET(request: Request) {
  if (!RAPID_API_KEY) {
    return NextResponse.json({ error: 'RAPID_API_KEY is not set' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get('cityName') || 'Paris';
  const checkinDate = searchParams.get('checkinDate') || '2024-11-27';
  const checkoutDate = searchParams.get('checkoutDate') || '2024-11-28';
  const adultsNumber = searchParams.get('adultsNumber') || '2';
  const roomNumber = searchParams.get('roomNumber') || '1';

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
    }
  };

  try {
    const locationResponse = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${cityName}&locale=en-gb`, options);
    const locationData = await locationResponse.json();
    const destId = locationData[0]?.dest_id;

    if (!destId) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const response = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/search?dest_id=${destId}&units=metric&checkin_date=${checkinDate}&dest_type=city&locale=en-gb&adults_number=${adultsNumber}&order_by=popularity&filter_by_currency=EUR&room_number=${roomNumber}&page_number=0&checkout_date=${checkoutDate}&include_adjacency=true`, options);
    const result = await response.json();

    return NextResponse.json({ hotels: result.result });
  } 
  catch (error) {
    console.error('booking.com API error:', error);
    return NextResponse.json({ error: 'error fetching hotels from Booking.com' }, { status: 500 });
  }
}