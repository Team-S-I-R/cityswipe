import { NextResponse } from "next/server";
import { z } from "zod";

const searchSchema = z.object({
  cityName: z.string().trim().min(1).max(100),
  checkinDate: z.string().date(),
  checkoutDate: z.string().date(),
  adultsNumber: z.coerce.number().int().min(1).max(30).default(2),
  roomNumber: z.coerce.number().int().min(1).max(30).default(1),
}).refine(value => value.checkinDate >= new Date().toISOString().slice(0, 10) && value.checkoutDate > value.checkinDate);

export async function GET(request: Request) {
  const parsed = searchSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Provide a city, valid future check-in/check-out dates, and guest counts" }, { status: 400 });
  const apiKey = process.env.RAPID_API_KEY;
  if (!apiKey || apiKey === "...") return NextResponse.json({ error: "Hotel search is currently unavailable" }, { status: 503 });
  const options = {
    headers: { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": "booking-com.p.rapidapi.com" },
    signal: AbortSignal.timeout(15000),
  };
  const { cityName, checkinDate, checkoutDate, adultsNumber, roomNumber } = parsed.data;
  try {
    const locationResponse = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/locations?${new URLSearchParams({ name: cityName, locale: "en-gb" })}`, options);
    if (!locationResponse.ok) throw new Error("Location service failed");
    const locations = await locationResponse.json();
    const location = locations.find((item: { dest_type: string }) => item.dest_type === "city");
    if (!location?.dest_id) return NextResponse.json({ error: "City not found" }, { status: 404 });
    const params = new URLSearchParams({
      dest_id: String(location.dest_id), dest_type: "city", locale: "en-gb", units: "metric",
      checkin_date: checkinDate, checkout_date: checkoutDate, adults_number: String(adultsNumber),
      room_number: String(roomNumber), order_by: "popularity", filter_by_currency: "EUR", page_number: "0",
    });
    const response = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/search?${params}`, options);
    if (!response.ok) throw new Error("Hotel service failed");
    const result = await response.json();
    return NextResponse.json({ hotels: result.result || [] });
  } catch {
    return NextResponse.json({ error: "Unable to fetch hotels" }, { status: 502 });
  }
}
