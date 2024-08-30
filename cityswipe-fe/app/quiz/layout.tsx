import QuizClient from "./page";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";


export default function QuizServer() {

    return (
        <>
        <QuizClient />
        </>
    )
}