import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUserName, getItinerary, currentUserMatches } from "@/app/actions";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = z.object({ userId: z.string().trim().min(1).max(200) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "A userId is required" }, { status: 400 });
  try {
    const [itinerary, usersName, matches] = await Promise.all([
      getItinerary(parsed.data.userId), currentUserName(parsed.data.userId), currentUserMatches(parsed.data.userId),
    ]);
    if (!usersName && !itinerary.length) return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    return NextResponse.json({ itinerary, usersName: usersName || "Traveler", matches });
  } catch {
    return NextResponse.json({ error: "Unable to load the itinerary" }, { status: 503 });
  }
}
