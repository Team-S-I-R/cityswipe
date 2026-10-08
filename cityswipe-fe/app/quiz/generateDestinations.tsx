"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "pexels";
import { requireUser } from "@/lib/user";
import { describeGeminiError, isGeminiConfigured, isQuotaError, withGeminiFallback } from "@/lib/gemini";
import logger from "@/lib/logger";
import type { DestinationGenerationResult } from "@/lib/destination.type";
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

// Next.js hides thrown server-action messages in production, so failures are
// returned as `{ error }` with text the quiz can show, and the real cause is logged.
function explainFailure(error: unknown) {
  if (isQuotaError(error)) {
    return "Our destination finder has reached its daily request limit. Please try again later.";
  }
  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
    return "Finding destinations took too long. Please try again.";
  }
  return "We couldn't generate destinations right now. Please try again.";
}

export async function generateDestinations(
  responses: string[],
  excludedCities: string[] = [],
): Promise<DestinationGenerationResult> {
  await requireUser();
  const answers = z.array(z.string().trim().min(1).max(2000)).length(quizQuestions.length).parse(responses);
  if (!isGeminiConfigured()) {
    logger.error("Destination suggestions require GOOGLE_GENERATIVE_AI_API_KEY.");
    return { error: "Destination suggestions are not set up yet. Please contact support." };
  }

  const prompt = `Suggest exactly eight varied travel destinations based on these preferences:
${quizQuestions.map((question, index) => `${question.question}: ${answers[index]}`).join("\n")}
Use compatibility scores from 0 to 100 and estimated daily budgets in US dollars per person.
Describe each destination with relevant pros and cons. Include less familiar destinations.
Exclude the user's current city and these previously suggested cities: ${excludedCities.join(", ")}.`;

  let generated: z.infer<typeof destinationSchema>[];
  try {
    // One deadline for every model attempt keeps the whole action inside the hosting function's limit.
    const deadline = AbortSignal.timeout(50000);
    const { object } = await withGeminiFallback((modelId) => generateObject({
      model: google(modelId),
      schema: z.object({ destinations: z.array(destinationSchema).length(8) }),
      prompt,
      maxRetries: 1,
      abortSignal: deadline,
    }));
    generated = object.destinations;
  } catch (error) {
    logger.error(`Destination generation failed: ${describeGeminiError(error)}`);
    return { error: explainFailure(error) };
  }

  const photoKey = process.env.PEXELS_API_KEY;
  const photoClient = photoKey && photoKey !== "..." ? createClient(photoKey) : null;
  const destinations = await Promise.all(generated.map(async (destination, index) => {
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
  return { destinations };
}
