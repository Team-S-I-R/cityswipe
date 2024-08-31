import { Suspense } from 'react';
import Explore from './page';
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

async function fetchData() {
    const clerkuser = await currentUser();

    if (!clerkuser) {
        throw new Error("No current user found");
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

export default async function ExploreServer() {
    
    const data = await fetchData();
    console.log(data);
    return (
            <main className="w-screen h-screen overflow=y-hidden">
               <Explore clerkdata={data} />
            </main>
    )
}