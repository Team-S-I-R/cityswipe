import { requireUser } from "@/lib/user";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function MatchLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const answers = await prisma.quizAnswer.count({ where: { userId: user.id } });
  if (!answers) redirect("/quiz");
  return children;
}
