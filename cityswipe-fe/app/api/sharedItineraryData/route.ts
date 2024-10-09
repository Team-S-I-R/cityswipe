'use server'

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { currentUserName, getItinerary, currentUserMatches } from "@/app/actions";
import { get } from "http";




export async function POST(request: any) {
    const requestBody = await request.json();
    const uId = requestBody?.userId

    const itinerary = await getItinerary(uId)
    const usersName = await currentUserName(uId)
    const matches = await currentUserMatches(uId)

    return Response.json({ 
      itinerary: itinerary,
      usersName: usersName,
      matches: matches 
    })
  }







  
  
