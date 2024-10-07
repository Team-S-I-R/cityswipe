'use server'

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { getItinerary } from "@/app/actions";
import { get } from "http";




export async function POST(request: any) {
    const requestBody = await request.json();
    const uId = requestBody?.userId

    const itinerary = await getItinerary(uId)

    return Response.json({ itinerary })
  }







  
  
