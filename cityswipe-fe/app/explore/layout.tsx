import { Suspense } from 'react';
import Explore from './page';
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { useSavedDestinationContext } from '@/context/savedDestinationContext';
import { redirect } from 'next/navigation';

async function fetchData() {
    const clerkuser = await currentUser();

    if (!clerkuser) {
        redirect("/sign-in");
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