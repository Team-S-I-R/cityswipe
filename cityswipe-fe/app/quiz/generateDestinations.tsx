"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "pexels";
import { requireUser } from "@/lib/user";
import quizQuestions from "../quiz-questions/questions";
import fallbackImage from "../assets/imgs/destination-img-1.jpg";

const destinationSchema = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
  compatibility: z.number().min(0).max(100),
  budget: z.number().int().nonnegative(),
  description: z.string().min(1),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
});

export async function generateDestinations(responses: string[], excludedCities: string[] = []) {
  await requireUser();
  const answers = z.array(z.string().trim().min(1).max(2000)).length(quizQuestions.length).parse(responses);
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY === "...") {
    throw new Error("Destination suggestions require a Google AI API key.");
  }

  const { object } = await generateObject({
    model: google(process.env.GEMINI_MODEL || "models/gemini-flash-latest"),
    schema: z.object({ destinations: z.array(destinationSchema).length(8) }),
    prompt: `Suggest exactly eight varied travel destinations based on these preferences:
${quizQuestions.map((question, index) => `${question.question}: ${answers[index]}`).join("\n")}
Use compatibility scores from 0 to 100 and estimated daily budgets in US dollars per person.
Describe each destination with relevant pros and cons. Include less familiar destinations.
Exclude the user's current city and these previously suggested cities: ${excludedCities.join(", ")}.`,
    maxRetries: 1,
    abortSignal: AbortSignal.timeout(60000),
  });

  const photoKey = process.env.PEXELS_API_KEY;
  const photoClient = photoKey && photoKey !== "..." ? createClient(photoKey) : null;
  return Promise.all(object.destinations.map(async (destination, index) => {
    let illustration = fallbackImage.src;
    if (photoClient) {
      try {
        const response = await photoClient.photos.search({
          query: `${destination.city} ${destination.country} landscape`, per_page: 1,
        });
        if ("photos" in response && response.photos.length) illustration = response.photos[0].src.landscape;
      } catch {
        // Suggestions remain usable when the optional photo service is unavailable.
      }
    }
    return { ...destination, id: index + 1, illustration };
  }));
}
