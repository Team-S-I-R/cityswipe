import { Suspense } from 'react';
import Explore from './page';
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function fetchUserData() {
    const clerkuser = await currentUser();

    if (!clerkuser) {
        redirect("/sign-in");
        return null; // Ensure function returns null if redirecting
    }

    // find user in database by Clerk ID or email
    let user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: clerkuser.id },
                { email: clerkuser.emailAddresses[0]?.emailAddress || "" }
            ]
        },
    });

    return user;
}

 export async function fetchUserMatches() {
    const clerkuser = await currentUser();

    let matches = prisma?.match.findMany({
        where: {
            userId: clerkuser?.id
        }
    });

    return matches
}

export async function fetchQuestions() {
    const clerkuser = await currentUser();

    if (!clerkuser) {
        redirect("/sign-in");
    }

    let questions = await prisma?.quizAnswer.findMany({
        where: {
            userId: clerkuser?.id
        }
    })

    revalidatePath('/');
    revalidatePath('/quiz');
    revalidatePath('/match');
    revalidatePath('/explore');


    if (questions.length < 1) {
        redirect("/quiz");
    }

    return questions
}

export async function fetchItinerary() {
    const clerkuser = await currentUser();

    if (!clerkuser) {
        redirect("/sign-in");
    }

    let allItineraryBlocks = await prisma?.itinerary.findMany({
        where: {
            userId: clerkuser?.id
        }
    })

    revalidatePath('/');
    revalidatePath('/quiz');
    revalidatePath('/match');
    revalidatePath('/explore');


    return allItineraryBlocks
}

export default async function ExploreServer() {
    const data = await fetchUserData();
    const matches = await fetchUserMatches();
    const questions = await fetchQuestions();
    const itinerary = await fetchItinerary();
    
    return (
        <main className="w-screen h-screen overflow-y-hidden">
            <Explore clerkdata={data} matches={matches} questions={questions} itinerary={itinerary} />
        </main>
    );
}