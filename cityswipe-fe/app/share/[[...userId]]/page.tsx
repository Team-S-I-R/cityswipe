import SharedItineraryClient from "./SharedItineraryClient";
import { notFound } from "next/navigation";

export default function SharedItineraryPage({ params }: { params: { userId?: string[] } }) {
  if (params.userId?.length !== 1) notFound();
  return <SharedItineraryClient userId={params.userId[0]} />;
}
