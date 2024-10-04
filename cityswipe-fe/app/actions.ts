"use server";

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { generateText } from "ai";
import { createStreamableValue, readStreamableValue } from "ai/rsc";
import prisma from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import quizQuestions from "./quiz-questions/questions";
import { createClient } from "pexels";

// ANCHOR Gemini Logic --------------------------------------------------------------------
export interface Message {
  role: "user" | "assistant";
  content: string;
  type: string;
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

    let fullBio = "";

    for await (const text of textStream) {
      stream.update(text);
      fullBio += text;
    }

    console.log(`generated bio for ${city}:`, fullBio);
    try {
      const bioLines = fullBio.split("\n");
      const bioObject = {
        age: bioLines[0].split(":")[1].trim(),
        languages: bioLines[1].split(":")[1].trim(),
        food: bioLines[2].split(":")[1].trim(),
        interests: bioLines[3].split(":")[1].trim(),
      };
      console.log(
        `Structured bio for ${city}:`,
        JSON.stringify(bioObject, null, 2)
      );
    } catch (error) {
      console.error(`Error parsing bio for ${city}:`, error);
    }

    stream.done();
  })().then(() => { });

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
  })().then(() => { });

  return {
    messages: history,
    newMessage: stream.value,
  };
}

export async function streamFlirtatiousConversation(
  city: string,
  country: string,
  history: Message[]
) {
  const stream = createStreamableValue();
  // const model = google("models/gemini-1.5-pro-latest");
  const model = google("models/gemini-1.5-flash");

  const sanitizeText = (text: string) => text.replace(/[*_~`]/g, "");

  const prompt = `You are ${city} in ${country}, a charming city in a "dating app" for vacation spots. You have a personality that reflects the unique characteristics of your city. When the user asks about who you are, you must respond as ${city} in ${country}. Your responses should be:
  
  - Informative: Provide interesting facts and highlights about your city.
  - Creative and Funny: Include humor and wit to make the conversation engaging.
  - Romantic/Flirtatious: Add romantic and flirtatious jokes and emojis (safe for work) where appropriate.
  
  Make sure to match the style of the user's input. Here's the conversation so far:
  
  ${history
    .map(
      (msg) =>
        `${msg.role === "user" ? "User" : "Assistant"}: ${sanitizeText(
          msg.content
        )}`
    )
    .join("\n")}
  
  Your response should combine all these elements in a balanced way.
  
  If the user asks anything else, just try to be nice, friendly and make sure you answer everything in complete sentences.
  `;

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
  })().then(() => { });

  if (!conversationHistory[city]) {
    conversationHistory[city] = [];
  }

  conversationHistory[city].push(...history);

  console.log("cc", stream.value);

  return {
    messages: history,
    newMessage: stream.value,
    type: "message",
  };
}

export async function getConversationHistory(city: string) {
  return conversationHistory[city] || [];
}

export async function makeItinerary(
  city: string,
  country: string,
  history: Message[]
) {
  // Use the appropriate Gemini model
  const model = google("models/gemini-1.5-flash");

  // Helper function to sanitize text input
  const sanitizeText = (text: string) => text.replace(/[*_~`]/g, "");

  // Construct the prompt for the API, including the history
  const prompt = `
    You are a travel assistant. Generate a comprehensive travel plan for a trip to ${city}.
    Include the following:

    1. **Detailed Itinerary**: Provide a detailed daily itinerary with suggested activities and destinations.
    2. **Packing List**: Suggest a packing list for the trip, taking into account the weather and local activities.
    3. **Cultural Information**: Include key cultural practices, local cuisine, and must-see attractions in ${city}.

    Format the response as JSON with fields for 'itinerary', 'packing_list', and 'cultural_info', such as in the following:
  
    [

    "title": "Itinerary for Trip to ${city}",

    "itinerary": {
         { "Day 1": "Arrive in New York City. Check into your hotel. Explore Times Square and have dinner at a local restaurant." },
         { "Day 2": "Visit the Statue of Liberty and Ellis Island. Spend the afternoon in Central Park. Evening Broadway show." },
         { "Day 3": "Tour the Metropolitan Museum of Art. Explore the Upper East Side. Dinner at a Michelin-starred restaurant." },
         { "Day 4": "Visit the Empire State Building and take in the city views. Shopping in Soho. Departure." },
      },

      "packing_list": [
          "Comfortable walking shoes",
          "Weather-appropriate clothing (e.g., light jacket, umbrella)",
          "Travel-sized toiletries",
          "Travel documents (ID, tickets)",
          "Chargers for electronics",
          "Reusable water bottle"
      ],
      
      "cultural_info": {
          "Cultural Practices": "New Yorkers value their time and are known for their directness. Tipping is customary in restaurants.",
          "Local Cuisine": "Try iconic foods such as New York-style pizza, bagels, and hot dogs.",
          "Must-See Attractions": [
          "Statue of Liberty",
          "Central Park",
          "Empire State Building",
          "Broadway",
          "Metropolitan Museum of Art"
          ]
      },

      "additional_comments": { "Remember to check for any local events or festivals happening during your visit. Enjoy your trip! " }
    
      ]

    }

    Here are tips you must follow when generating this content. THis is important because we will be using JSON.parse to parse this data so it is important to follow this format and to create NO ERRORS.
    
    Every key in the JSON string is enclosed in double quotes ("key").
    The values are correctly formatted (e.g., strings should be in double quotes, numbers should not).
    There are no trailing commas after the last property of each object or array.
    DO NOT ADD ANY MARKDOWN, CODE BLOCKS OR FORMATTING BESIDES THE EXAMPLE JSON FORMAT.

    Make sure the compatibility percentage is a number between 0 and 100. 
    Do not include formatting or code blocks, follow example. 
  
    Here is the history of the conversation to provide some context.:

  ${history
    .map(
      (msg) =>
        `${msg.role === "user" ? "User" : "Assistant"}: ${sanitizeText(
          msg.content
        )}`
    )
    .join("\n")}
  


  `;

  // Send prompt to the model and wait for the response
  const { text } = await generateText({
    model: model,
    prompt: prompt,
  });

  console.log("cc", text);

  // Update conversation history for the city
  if (!conversationHistory[city]) {
    conversationHistory[city] = [];
  }
  conversationHistory[city].push(...history);

  // Return the new message and updated conversation history
  return {
    messages: history,
    newMessage: text, // Assuming `response.data.text` contains the generated message
    type: "itinerary",
  };
}

export async function summerizeItineraryText(itinerarytext: string) {
  const model = google("models/gemini-1.5-flash");

  // Construct the prompt for the API, including the history
  const prompt = `
    You are a travel assistant. 

    Here are tips you must follow when generating this content. THis is important because we will be 
    adding this text to our users itinerary.

    Ths user is going to give you some text and they want you ot turn it into a small summary that they can use on their itinerary. 

    this is the text they gave you: ${itinerarytext}
       
    DO NOT ADD ANY MARKDOWN, CODE BLOCKS OR FORMATTING.


  `;

  // Send prompt to the model and wait for the response
  const { text } = await generateText({
    model: model,
    prompt: prompt,
  });

  // Update conversation history for the city
  console.log("summerizeItineraryText", text);
  // Return the new message and updated conversation history
  return text;
}

// ANCHOR WaitList Forms & Other ----------------------------------------------------
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

export async function submitFormResponse(
  formData: FormData,
  formState: FormState
) {
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

    revalidatePath("/");

    return {
      message: "Message created",
    };
  } catch (error) {
    // Handle the error
    return {
      message: "Something went wrong",
    };
  }
}

// ANCHOR Database Logic & Functions (Supabase) ------------------------------------
export async function addQuestions(questions: any) {
  let count = 0;

  const user = await currentUser();

  const quizResponseCount = await prisma?.quizAnswer.findMany({
    where: {
      userId: user?.id,
    },
  });

  // ensure this is only run once
  if (count < 1 && quizResponseCount.length < 1) {
    {
      await prisma?.quizAnswer.create({
        data: {
          a1: questions?.[0],
          a2: questions?.[1],
          a3: questions?.[2],
          a4: questions?.[3],
          a5: questions?.[4],
          userId: user?.id,
        },
      })

      count += 1
    }
  }
}

export async function updateQuestions(questions: any) {

  const user = await currentUser();

  console.log("questions", questions)

  // Ensure this is only run once
  if (questions.length > 0) {
    const updatePromises = questions.map((question: any, index: number) => {
      const dataToUpdate: any = {};
      dataToUpdate[`a${index + 1}`] = question.value;

      return prisma?.quizAnswer.updateMany({
        where: {
          id: question.id,
          userId: user?.id
        },
        data: dataToUpdate
      });
    });

    await Promise.all(updatePromises);
  }
}

export async function addMatch(savedDestination: any) {
  const user = await currentUser();

  interface Destination {
    city: string;
    username: string;
    country: string;
    description: string;
    illustration: string;
    pros: string[];
    cons: string[];
    compatibility: number;
  }

  // this is the last destination we then just add this to the database
  const destination: Destination =
    savedDestination?.destinations[savedDestination?.destinations?.length - 1];

  console.log("destination: ", destination);

  await prisma?.match.create({
    data: {
      city: destination?.city,
      username: user?.username || "",
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

export async function createItinerary(blocks: any) {
  const user = await currentUser();

  console.log("blocks: ", blocks);

  // ANCHOR THIS ADDS EVERY BLOCK IN THE ITINERARY TO THE DATABASE
  // THE TEXT IS IN AN ARRAY ALLOWING ME TO MAP IT IN THE FRONT END
  //  SAME WITH THE TYPES
  if (blocks && blocks.length > 0) {
    let blockNum = 1; // Initialize blockNum outside the loop
    for (const block of blocks) {

      const blockText = block?.content?.[0]?.text || null;

      await prisma?.itinerary.create({
        data: {
          username: user?.username,
          blockNum: blockNum,
          text: blockText,
          type: block.type,
          props: block.props,
          userId: user?.id,
        },

      });
      blockNum += 1; // Increment blockNum after each addition

    }
    revalidatePath('/explore');
    revalidatePath('/');
  }
}

export async function updateItinerary(blocks: any) {

  const user = await currentUser();

  console.log("blocks: ", blocks);


  // I did it this way to stop erros. There will not be any records of previous
  // saved itineraries for now but it will save whatever the user has done.


  // ANCHOR THIS DELETES ALL EXISTING BLOCKS AND CREATES NEW ONES IN THE DATABASE
  if (blocks && blocks.length > 0) {
    // Delete all existing blocks for the user
    await prisma?.itinerary.deleteMany({
      where: {
        userId: user?.id,
      },
    });

    let blockNum = 1; // Initialize blockNum outside the loop
    for (const block of blocks) {

      const blockText = block?.content?.[0]?.text || null;

      await prisma?.itinerary.create({
        data: {
          username: user?.username,
          blockNum: blockNum,
          text: blockText,
          type: block.type,
          props: block.props,
          userId: user?.id,
        },

      });
      blockNum += 1; // Increment blockNum after each addition

    }
    revalidatePath('/explore');
    revalidatePath('/');
  }
}

export async function handleSubscriber(subscriberData?: any) {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User not found or user ID is missing.");
  }

  // ANCHOR Handling free user
  // If the user has no data in the db for subscriptions,
  // create a new record and make the status "free" because they are a free member
  if (!subscriberData) {
    await prisma?.subscription.create({
      data: {
        interval: "",
        planId: "",
        currentPeriodEnd: 0,
        currentPeriodStart: new Date().getTime(),
        userId: user.id,
        stripeSubscriptionId: "",
        // we will reference the subscription status throughout the app
        status: "free",
      },
    });
  }

  // ANCHOR Handling paid MONTHLY user
  // If the user has no data in the db for subscriptions,
  // create a new record and make the status "free" because they are a free member
  if (subscriberData.interval === "month" && subscriberData.status === "active") {
    await prisma?.subscription.update({
      where: {
        stripeSubscriptionId: subscriberData.stripeSubscriptionId,
      },
      data: {
        interval: subscriberData.interval,
        planId: subscriberData.planId,
        currentPeriodEnd: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
        currentPeriodStart: new Date().getTime(),
        userId: user.id,
        status: "active",
      },
    });
  }

  if (subscriberData.interval === "year" && subscriberData.status === "active") {
    await prisma?.subscription.update({
      where: {
        stripeSubscriptionId: subscriberData.stripeSubscriptionId,
      },
      data: {
        interval: subscriberData.interval,
        planId: subscriberData.planId,
        currentPeriodEnd: new Date().getTime() + 365 * 24 * 60 * 60 * 1000,
        currentPeriodStart: new Date().getTime(),
        userId: user.id,
        status: "active",
      },
    });
  }


}


// ANCHOR Giphy API --------------------------------------------------------------------
// export async function QsearchGiphyGif(query: string, limit: number) {
//   const RATING = "PG";
//   const DEFAULT_LIMIT = 1;

//   if (!query) {
//     console.log(`No query was provided, provided query was: ${query}`);
//   }

//   console.log(`Searching Giphy for: ${query}`);

//   const giphyApiKey = process.env.GIPHY_API_KEY;
//   const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${query}&limit=${limit ? limit : DEFAULT_LIMIT}&rating=${RATING}`;

//   try {
//     const response = await fetch(url)
//       .then((res) => res.json())
//       .then((data) => data);

//     if (response.data && response.data.length > 0) {
//       console.log("GIF Found for the given query:", response.data[0].url);
//       return response.data[0].url;

//     } else {
//       console.log("No GIFs found for the given query.");
//       return null;

//     }
//   } catch (error: any) {
//     console.log(`Some Error Occured During Giphy Search: ${error.message}`);
//   }
// }

export async function searchGiphyGif(query: string, limit: number) {
  const RATING = "PG";
  const DEFAULT_LIMIT = 1;

  if (!query) {
    console.error(`No query was provided, provided query was: ${query}`);
    return null;
  }

  console.log(`Searching Giphy for: ${query}`);

  const giphyApiKey = process.env.GIPHY_API_KEY;
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${query}&limit=${limit ? limit : DEFAULT_LIMIT}&rating=${RATING}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      console.log("data: ", data.data[0]);
      console.log("GIF Found for the given query:", data.data[0].images.original.url);
      return data.data[0].images.original.url;
    } else {
      console.log("No GIFs found for the given query.");
      return null;
    }
  } catch (error: any) {
    console.error(`Some Error Occurred During Giphy Search: ${error.message}`);
    return null;
  }
}