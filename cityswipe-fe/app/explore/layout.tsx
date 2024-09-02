import { Suspense } from 'react';
import Explore from './page';
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';

async function fetchUserData() {
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

async function fetchUserMatches() {
    const clerkuser = await currentUser();

    let matches = prisma?.match.findMany({
        where: {
            userId: clerkuser?.id
        }
    });

    return matches
}

async function fetchQuestions() {
    const clerkuser = await currentUser();

    if (!clerkuser) {
        redirect("/sign-in");
    }

    let questions = await prisma?.quizAnswer.findMany({
        where: {
            userId: clerkuser?.id
        }
    })

    if (questions.length < 1) {
        redirect("/quiz");
    }

    return questions
}

export default async function ExploreServer() {
    const data = await fetchUserData();
    const matches = await fetchUserMatches();
    const questions = await fetchQuestions();
    
    console.log("server user matches: ", matches)
    return (
        <main className="w-screen h-screen overflow-y-hidden">
            <Explore clerkdata={data} matches={matches} />
        </main>
    );
}