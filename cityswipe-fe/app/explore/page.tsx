import ExploreClient from "./ExploreClient";
import { requireUser } from "@/lib/user";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ExplorePage() {
  const user = await requireUser();
  const [matches, questions, itinerary] = await Promise.all([
    prisma.match.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } }),
    prisma.quizAnswer.findMany({ where: { userId: user.id } }),
    prisma.itinerary.findMany({ where: { userId: user.id }, orderBy: { blockNum: "asc" } }),
  ]);
  if (!questions.length) redirect("/quiz");
  return <ExploreClient clerkdata={user} matches={matches} questions={questions} itinerary={itinerary} />;
}
