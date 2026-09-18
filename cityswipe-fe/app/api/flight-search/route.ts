import { NextResponse } from "next/server";
import Amadeus from "amadeus";
import { z } from "zod";

const searchSchema = z.object({
  originLocationCode: z.string().regex(/^[A-Z]{3}$/),
  destinationLocationCode: z.string().regex(/^[A-Z]{3}$/),
  departureDate: z.string().date().refine(value => value >= new Date().toISOString().slice(0, 10)),
  adults: z.coerce.number().int().min(1).max(9).default(1),
});

export async function GET(request: Request) {
  const parsed = searchSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Provide valid airport codes, a future departure date, and 1–9 adults" }, { status: 400 });
  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;
  if (!clientId || !clientSecret || clientId === "..." || clientSecret === "...") {
    return NextResponse.json({ error: "Flight search is currently unavailable" }, { status: 503 });
  }
  try {
    const amadeus = new Amadeus({ clientId, clientSecret });
    const response = await amadeus.client.get("/v2/shopping/flight-offers", { ...parsed.data, max: 10 });
    if (!response?.result) throw new Error("Invalid flight response");
    return NextResponse.json(response.result);
  } catch {
    return NextResponse.json({ error: "Unable to fetch flight offers" }, { status: 502 });
  }
}
