import QuizClient from "./QuizClient";
import { requireUser } from "@/lib/user";

export default async function QuizPage() {
  const user = await requireUser();
  return <QuizClient clerkdata={user} />;
}
