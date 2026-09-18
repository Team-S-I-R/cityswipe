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
import { stripe, isStripeConfigured, isBillingConfigured, appUrl } from "../lib/stripe"
import { getStripeSession } from "@/lib/stripe";
import { redirect } from "next/navigation";
import logger from "@/lib/logger";
import { requireUser } from "@/lib/user";

// ANCHOR Gemini Logic --------------------------------------------------------------------

// Google retires dated Gemini releases, so point at the rolling "latest" alias
// instead of a pinned version that will 404 once it is sunset.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "models/gemini-flash-latest";

export interface Message {
  role: "user" | "assistant";
  content: string;
  type: string;
}


export async function generateCityBio(city: string) {
  await requireUser();
  const stream = createStreamableValue();
  const model = google(GEMINI_MODEL);

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
  })().catch(() => stream.error(new Error("Unable to contact the travel assistant. Please try again.")));

  return {
    description: stream.value,
  };
}

export async function streamConversation(history: Message[]) {
  await requireUser();
  const stream = createStreamableValue();
  // const model = google("models/gemini-1.5-pro-latest");
  const model = google(GEMINI_MODEL);

  (async () => {
    const { textStream } = await streamText({
      model: model,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })().catch(() => stream.error(new Error("Unable to contact the travel assistant. Please try again.")));

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
  await requireUser();
  const systemPrompt = `You are an expert on ${city} in ${country}, a charming city in a travel recommendation app.
You have a personality that reflects the unique characteristics of your city.
Be informative, creative, friendly, and welcoming. Keep your replies family-friendly, match the user's style,
and always answer in complete sentences.`;

  try {
    // Return a complete reply, preserving main's fix for chat messages that cut off mid-stream.
    const { text } = await generateText({
      model: google(GEMINI_MODEL),
      system: systemPrompt,
      messages: history.slice(-12).map(({ role, content }) => ({ role, content })),
      temperature: 0.7,
      topP: 0.95,
      maxTokens: 2048,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(60000),
    });
    if (!text.trim()) throw new Error("Empty assistant response");
    return { messages: history, newMessage: text, type: "message" };
  } catch {
    throw new Error("Unable to contact the travel assistant. Please try again.");
  }
}

export async function makeItinerary(
  city: string,
  country: string,
  history: Message[]
) {
  await requireUser();
  // Use the appropriate Gemini model
  const model = google(GEMINI_MODEL);

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

  // Return the new message and updated conversation history
  return {
    messages: history,
    newMessage: text, // Assuming `response.data.text` contains the generated message
    type: "itinerary",
  };
}

export async function summerizeItineraryText(itinerarytext: string) {
  await requireUser();
  const model = google(GEMINI_MODEL);

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

export async function currentUserId() {
  const user = await currentUser();
  return user?.id;
}

export async function currentUserName(userId: string) {

  if (!userId) return null;

  const user = await prisma?.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user?.name;

}

export async function currentUserMatches(userId: string) {

  if (!userId) return [];

  const matches = await prisma?.match.findMany({
    where: {
      userId: userId,
    },
  });

  return matches
}



export async function addQuestions(questions: unknown) {
  const user = await requireUser();
  const answers = z.array(z.string().min(1).max(2000)).length(5).parse(questions);
  const data = { a1: answers[0], a2: answers[1], a3: answers[2], a4: answers[3], a5: answers[4] };
  await prisma.$transaction(async (tx) => {
    await tx.quizAnswer.deleteMany({ where: { userId: user.id } });
    await tx.quizAnswer.create({ data: { ...data, userId: user.id } });
  });
}

export async function updateQuestions(questions: any) {

  const user = await requireUser();

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

export async function addMatch(savedDestination: unknown) {
  const user = await requireUser();
  const { destinations } = z.object({ destinations: z.array(z.object({
    city: z.string().trim().min(1), country: z.string().trim().min(1),
    description: z.string(), illustration: z.string(),
    pros: z.array(z.string()), cons: z.array(z.string()),
    compatibility: z.number().min(0).max(100),
    budget: z.number().int().nonnegative().optional(),
  })).min(1) }).parse(savedDestination);
  const destination = destinations[destinations.length - 1];
  await prisma.match.create({ data: { ...destination, username: user.username, userId: user.id } });
  revalidatePath("/explore");
}

export async function deleteMatch(id: string) {
  const user = await requireUser();
  await prisma?.match.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });

  revalidatePath('/explore');
  revalidatePath('/');

}

export async function createItinerary(blocks: unknown) {
  return updateItinerary(blocks);
}

export async function updateItinerary(blocks: unknown) {
  const user = await requireUser();
  const document = z.array(z.object({
    id: z.string().optional(),
    type: z.string(),
    props: z.record(z.unknown()),
    content: z.unknown().optional(),
    children: z.array(z.unknown()).optional(),
  })).max(1000).parse(blocks);

  const plainText = (content: unknown): string => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.map(plainText).join("");
    if (content && typeof content === "object") {
      const value = content as { text?: string; content?: unknown };
      return value.text ?? plainText(value.content);
    }
    return "";
  };

  // Commit the complete document atomically, retaining rich text and nested blocks in JSON.
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.deleteMany({ where: { userId: user.id } });
    if (document.length) await tx.itinerary.createMany({
      data: document.map((block, index) => ({
        username: user.username,
        blockNum: index + 1,
        text: plainText(block.content),
        type: block.type,
        props: JSON.parse(JSON.stringify({ ...block.props, _cityswipeBlock: block })),
        userId: user.id,
      })),
    });
  });
  revalidatePath("/explore");
  revalidatePath(`/share/${user.id}`);
}

export async function getItinerary(userId: string) {

  if (!userId) return [];

  const itineraryBlocks = await prisma.itinerary.findMany({
    where: {
      userId: userId
    },
    orderBy: { blockNum: "asc" },
  })

  return itineraryBlocks

}

// ANCHOR Stripe -------------------------------------------------------------------

export async function getData(userId: string) {

  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        }
      }
    }

  })
  return data;
}

export async function createSubscription(plan: string) {
  if (!isBillingConfigured) throw new Error("Subscriptions are currently unavailable.");
  const user = await requireUser();
  const priceId = plan === "Pro Monthly" ? process.env.STRIPE_M_PLAN
    : plan === "Pro Yearly" ? process.env.STRIPE_Y_PLAN : null;
  if (!priceId) throw new Error("Please choose a valid plan.");
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create(
      { email: user.email, metadata: { userId: user.id } },
      { idempotencyKey: `cityswipe-customer-${user.id}` },
    );
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }
  redirect(await getStripeSession({ priceId, customerId, domainUrl: appUrl }));
}

export async function createCustomerPortal() {
  if (!isStripeConfigured) throw new Error("Subscription management is currently unavailable.");
  const user = await requireUser();
  if (!user.stripeCustomerId) throw new Error("No billing account was found.");
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/pricing`,
  });
  redirect(session.url);
}

// export async function handleSubscriber(subscriberData?: any) {
//   const clerkuser = await currentUser();

//   // find user in database
//   const user = await prisma.user.findUnique({
//     where: {
//       id: clerkuser?.id,
//     },
//   });

//   if (!clerkuser || !clerkuser.id) {
//     console.log("User not found or user ID is missing.");
//   }

//   // ANCHOR Handling free user
//   // If the user has no data in the db for subscriptions,
//   // create a new record and make the status "free" because they are a free member
//   if (subscriberData === undefined && user?.stripeCustomerId == null) {

//     await prisma?.subscription.create({
//       data: {
//         interval: "",
//         username: user?.username || "",
//         currentPeriodEnd: 0,
//         currentPeriodStart: Math.floor(new Date().getTime() / 1000), // Convert to seconds
//         userId: user?.id as string,
//         stripeCustomerId: "", 
//         // we will reference the subscription status throughout the app
//         status: "free",
//       },
//     });

//     console.log("Free user created");
//   }

//   // Here I'm handling edge cases for users already in our db, to just make sure that they get a customer id created
//   if (subscriberData === undefined && user?.stripeCustomerId != null) {

//       const subscription = await prisma?.subscription.findUnique({
//         where: {
//           userId: clerkuser?.id,
//         },
//       });

//       if (subscription) {
//         // Subscription exists, handle accordingly
//         await prisma?.subscription.update({
//           where: {
//             userId: clerkuser?.id,
//           },
//           data: {
//             stripeCustomerId: user?.stripeCustomerId as string,
//             username: user?.username as string,
//           },
//         });

//       }

//       if (!subscription) {
//         // Subscription does not exist, create it
//         await prisma?.subscription.create({
//           data: {
//             interval: "",
//             currentPeriodEnd: 0,
//             currentPeriodStart: Math.floor(new Date().getTime() / 1000), // Convert to seconds
//             userId: user?.id as string,
//             username: user?.username || "",
//             stripeCustomerId: user?.stripeCustomerId || "", 
//             // we will reference the subscription status throughout the app
//             status: "free",
//           },
//         });
//       }


//     console.log("Free user updated");
//   }

//   // ANCHOR Handling paid MONTHLY user
//   if (subscriberData?.interval === "month" && subscriberData?.status === "active") {
//     try {
//       await prisma?.subscription.update({
//         where: {
//           userId: user?.id as string,
//         },
//         data: {
//           interval: subscriberData.interval as string,
//           currentPeriodEnd: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
//           currentPeriodStart: new Date().getTime(),
//           userId: user?.id as string,
//           username: user?.username as string,
//           stripeCustomerId: user?.stripeCustomerId as string,
//           status: "active",
//         },
//       });
//     } catch (error) {
//       console.error("Error updating monthly subscription:", error);
//     }
//   }

//   if (subscriberData?.interval === "year" && subscriberData?.status === "active") {
//     try {
//       await prisma?.subscription.update({
//         where: {
//           stripeSubscriptionId: user?.stripeCustomerId as string,
//           userId: user?.id as string,
//         },
//         data: {
//           interval: subscriberData.interval as string,
//           currentPeriodEnd: new Date().getTime() + 365 * 24 * 60 * 60 * 1000,
//           currentPeriodStart: new Date().getTime(),
//           userId: user?.id as string,
//           username: user?.username as string,
//           stripeCustomerId: user?.stripeCustomerId as string,
//           status: "active",
//         },
//       });
//     } catch (error) {
//       console.error("Error updating yearly subscription:", error);
//     }
//   }


// }

// ----------------------------------------------------------------------------------


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
    logger.error(`No query was provided, provided query was: ${query}`);
    return null;
  }

  logger.info(`Searching Giphy for the following: ${query}`);

  const giphyApiKey = process.env.GIPHY_API_KEY;
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${query}&limit=${limit ? limit : DEFAULT_LIMIT}&rating=${RATING}`;

  try {
    const response = await fetch(url)
      .then((response) => {
        if (!response.ok) {
          logger.error("HTTP error! status:", response.status);
          return null;
        }

        return response.json();
      })
      .catch((error) => {
        logger.error("Error fetching data:", error);
        return null;
      });

    if (!response.ok) {
      logger.error("HTTP error! status:", response.status);
    }

    if (response.data && response.data.length > 0) {
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      logger.info("GIF Found for the given query:", response.data[randomNumber].images.original.url);
      return response.data[randomNumber].images.original.url;

    } else {
      logger.error("No GIFs found for the given query.");
      return null;
    }
  } catch (error: any) {
    logger.error(`Some Error Occurred During Giphy Search: ${error.message}`);
    return null;
  }
}
