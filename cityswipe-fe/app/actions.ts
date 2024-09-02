"use server";

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import prisma from "@/lib/db";
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { currentUser } from "@clerk/nextjs/server";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const conversationHistory: Record<string, Message[]> = {};

export async function generateCityBio(city: string) {
  const stream = createStreamableValue();
  const model = google("models/gemini-1.5-flash-latest");

  const prompt = `Generate a bio for the city ${city}. Include the following details:
  - Age: The actual or estimated age of the city.
  - Languages: Languages spoken in the city, with emojis representing the languages.
  - Food: Traditional food from the city.
  - Interests: Common interests or sports played in the city each separated by commas.
  Make sure to add a human touch, be a little flirtatious, and include emojis. Provide the information in a clear and exact manner structurally without any additional text or markdown. Separate each section with a new line.`;

  console.log(`Generating bio for ${city} with prompt:`, prompt);

  (async () => {
    const { textStream } = await streamText({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      topP: 0.9,
      topK: 50,
    });

    let fullBio = '';

    for await (const text of textStream) {
      stream.update(text);
      fullBio += text;
    }

    console.log(`generated bio for ${city}:`, fullBio);
    try {
      const bioLines = fullBio.split('\n');
      const bioObject = {
        age: bioLines[0].split(':')[1].trim(),
        languages: bioLines[1].split(':')[1].trim(),
        food: bioLines[2].split(':')[1].trim(),
        interests: bioLines[3].split(':')[1].trim(),
      };
      console.log(`Structured bio for ${city}:`, JSON.stringify(bioObject, null, 2));
    } catch (error) {
      console.error(`Error parsing bio for ${city}:`, error);
    }

    stream.done();
  })().then(() => {});

  return {
    description: stream.value,
  };
}

export async function streamConversation(history: Message[]) {
  const stream = createStreamableValue();
  // const model = google("models/gemini-1.5-pro-latest");
  const model = google("models/gemini-1.5-flash");

  (async () => {
    const { textStream } = await streamText({
      model: model,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })().then(() => {});

  return {
    messages: history,
    newMessage: stream.value,
  };
}

export async function streamFlirtatiousConversation(city: string, country: string, history: Message[]) {
  const stream = createStreamableValue();
  // const model = google("models/gemini-1.5-pro-latest");
  const model = google("models/gemini-1.5-flash");

  const sanitizeText = (text: string,) => text.replace(/[*_~`]/g, '');

  const prompt = `You are ${city} in ${country}, a charming city in a "dating app" for vacation spots. You have a personality that reflects the unique characteristics of your city. When the user asks about who you are, you must respond as ${city} in ${country}. Your responses should be:
  
  - Informative: Provide interesting facts and highlights about your city.
  - Creative and Funny: Include humor and wit to make the conversation engaging.
  - Romantic/Flirtatious: Add romantic and flirtatious jokes and emojis (safe for work) where appropriate.
  
  Make sure to match the length and style of the user's input. Here's the conversation so far:
  
  ${history.map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${sanitizeText(msg.content)}`).join('\n')}
  
  Your response should combine all these elements in a balanced way.`;
  
  (async () => {
    const { textStream } = await streamText({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9, 
      topP: 0.85,
      topK: 40,
    });

    for await (const text of textStream) {
      stream.update(sanitizeText(text));
    }

    stream.done();
  })().then(() => {});

  if (!conversationHistory[city]) {
    conversationHistory[city] = [];
  }
  conversationHistory[city].push(...history);

  return {
    messages: history,
    newMessage: stream.value,
  };
}

export async function getConversationHistory(city: string) {
  return conversationHistory[city] || [];
}





// waiting list form stuff

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const createFormSchema = z.object({
  name: z.string().min(1).max(191),
  email: z.string().email(),
});

type FormState = {
  message: string;
};

export async function submitFormResponse(formData: FormData, formState: FormState) {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const city_id = generateRandomId();
  const city_name = formData.get("Name") as string;
  const city_email = formData.get("Email") as string;

  // Validate and parse the form data
  const { name, email } = createFormSchema.parse({
    name: city_name,
    email: city_email,
  });

  try {
    await prisma.user.create({
      data: {
        id: city_id,
        name: city_name,
        email: city_email,
      },
    });

    revalidatePath('/');

    return {
      message: 'Message created',
    };

  } catch (error) {
    // Handle the error
    return {
      message: 'Something went wrong',
    };
  }
}

// adding questions to database
export async function addQuestions(questions: any) {

  const user = await currentUser();

  await prisma?.quizAnswer.create({
    data: {
      a1: questions?.[0],
      a2: questions?.[1],
      a3: questions?.[2],
      a4: questions?.[3],
      a5: questions?.[4],
      a6: questions?.[5],
      a7: questions?.[6],
      a8: questions?.[7],
      a9: questions?.[8],
      a10: questions?.[9],
      a11: questions?.[10],
      a12: questions?.[11],
      userId: user?.id,
    },
  })
}

// adding matches to database
export async function addMatch(savedDestination: any) {

  const user = await currentUser();
  
  interface Destination {
    city: string;
    country: string;
    description: string;
    illustration: string;
    pros: string[];
    cons: string[];
    compatibility: number;
  }

  // this is the last destination we then just add this to the database
  const destination: Destination = savedDestination?.destinations[savedDestination?.destinations.length - 1];

  console.log("destination: ", destination);

    await prisma?.match.create({
      data: {
        city: destination?.city,
        country: destination?.country,
        description: destination?.description,
        illustration: destination?.illustration,
        pros: Array.isArray(destination?.pros) ? destination?.pros.map(String) : [],
        cons: Array.isArray(destination?.cons) ? destination?.cons.map(String) : [],
        compatibility: destination?.compatibility,
        userId: user?.id,
      },
    });
}
export async function deleteMatch(id: string) {

  await prisma?.match.delete({
    where: {
      id: id,
    },
  });

  revalidatePath('/explore');
  revalidatePath('/');

}

