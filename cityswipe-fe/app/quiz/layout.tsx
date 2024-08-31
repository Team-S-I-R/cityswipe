import QuizClient from "./page";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// check if user exists in database
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

    // create user in database if not exists or update missing fields
    if (!user) {
        user = await prisma.user.create({
            data: {
                id: clerkuser.id,
                name: clerkuser.fullName || "",
                email: clerkuser.emailAddresses[0]?.emailAddress || "",
                username: clerkuser.username || "",
                stripeCustomerId: "",
            },
        });
    } else {
        console.log("updating user: ", user);
        const updateData: { name?: string; email?: string; stripeCustomerId?: string; username?: string } = {};
        if (!user.name) updateData.name = clerkuser.fullName || "";
        if (!user.email) updateData.email = clerkuser.emailAddresses[0]?.emailAddress || "";
        if (!user.stripeCustomerId) updateData.stripeCustomerId = "";
        if (!user.username) updateData.username = clerkuser.username || "";

        if (Object.keys(updateData).length > 0) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });
        }
    }

    return user;
}

export default async function QuizServer() {
    // try {
        const data = await fetchData();
        return (
            <>
                <QuizClient clerkdata={data} />
            </>
        );
    // } catch (error) {
        // return <div className="w-full h-screen flex place-content-center place-items-center">Something went wrong</div>;
    // }
}