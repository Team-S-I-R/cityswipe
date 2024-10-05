import { readStreamableValue } from "ai/rsc";
import { Message, streamConversation } from "../actions";
import quizQuestions from "../quiz-questions/questions";
import { createClient } from "pexels";
import { destinationSets } from "@/api/destinationSets.api";
import { useDestinationSetContext } from "@/context/destinationSetContext";

export const generateDestinations = async (
  responses: string[],
  excludedCities?: string[]
) => {
  const prompt = `Based on the following travel preferences, generate a list of exactly 8 travel destinations formatted as json with values 
    
    City, Country, Compatibility Percentage(based on the user preferences provided), 
    budget(use the users budget preference (low , moderate, or high) 
    and then also this number needs to be an estimate of the cost to vacation per day for ONE PERSON!), 
    a brief description of the city, 
    the pros (based on the user preferences), 
    the cons (based on the user preferences). 
    Also, DO NOT under any circumstances include the city that the user is currently located in your list of destinations. 
    Another tip, Our users want to know more nice places to travel. So if you are going to pick a common city, we want you to pick a more niche area so our users can gain actual insights on where to travel. 
    
    Example format:
       [
           {
               "id": 0
               "city": "Ebisu",
               "country": "Japan",
               "compatibility": 85,
               "budget": 200,
               "description": "A short description about tokyo",
               "pros": ["Rich history", "Modern architecture", "Vibrant nightlife", "Delicious food", "Famous landmarks", "Fashion industry", "Technology industry", "Historical sites", "Cultural attractions", "Entertainment options"],
               "cons": ["Crowded", "Expensive", "Pollution", "Language barrier", "Lack of green spaces", "High cost of living", "Long working hours", "Traffic congestion", "Limited public transportation", "Limited public transportation"],
           },
           {
               "id": 1
               "city": "Champs-Elysées",
               "country": "France",
               "compatibility": 78,
               "budget": 500,
               "description": "A short description about paris",
               "pros": ["Beautiful architecture", "Delicious food", "Romantic atmosphere", "Art and fashion", "Historical sites", "Cultural attractions", "Entertainment options", "Museums", "Restaurants", "Parks"],
               "cons": ["Expensive", "Crowded", "Language barrier", "Lack of green spaces", "High cost of living", "Long working hours", "Traffic congestion", "Limited public transportation", "Limited public transportation"],
           },
               ... 6 more of the same format
       ]
 
       Here are tips you must follow when generating this content. This is important because we will be using JSON.parse to parse this data so it is important to follow this format and to create NO ERRORS.
       
       Every key in the JSON string is enclosed in double quotes ("key").
       The values are correctly formatted (e.g., strings should be in double quotes, numbers should not).
       There are no trailing commas after the last property of each object or array.
       DO NOT ADD ANY MARKDOWN, CODE BLOCKS OR FORMATTING BESIDES THE EXAMPLE JSON FORMAT.
 
       Make sure the compatibility percentage is a number between 0 and 100. 
       Do not include formatting or code blocks, follow example. 
       Assume the user can travel internationally to any destination in the world.
       Correlate all the data when making decisions. 
       the questions answered by the user (in order) are as follows: \n${console.log(
         quizQuestions.map((q) => q.question).join("\n")
       )}\n 
       
       Here are the user preference answers in order:\n${responses.join("\n")}
       
       Do not provide these cities as options: ${
         excludedCities ? excludedCities : ""
       }
       `;

  const conversationHistory: Message[] = [
    { role: "user" as const, content: prompt, type: "message" },
  ];

  const { newMessage } = await streamConversation(conversationHistory);
  let textContent = "";

  for await (const delta of readStreamableValue(newMessage)) {
    textContent += delta;
  }

  let count = 1;

  const generatedDestinations = [];

  const destinations = JSON.parse(textContent);

  for (const destination of destinations) {
    const { city, country, compatibility, budget, description, pros, cons } =
      destination;

    // ANCHOR Fetch image for the current city-country pair
    const client = createClient(
      "8U6Se7vVT3H9tx1KPZAQTkDUSW0IKi3ldgBTVyh3W9NFF7roIpZxktzY"
    );
    let illustration = "";

    const searchQuery = `${city}, landscape`;
    try {
      const response = await client.photos.search({
        query: `${searchQuery}`,
        per_page: 1,
      });
      if ("photos" in response && response.photos.length > 0) {
        illustration = response.photos[0].src.landscape;
      }
    } catch (error) {
      console.error(`Error in fetching photo for ${city}, ${country}:`, error);
    }

    generatedDestinations.push({
      id: count++,
      city: city.trim(),
      country: country.trim(),
      compatibility: parseFloat(compatibility),
      budget: parseInt(budget),
      illustration: illustration,
      description: description.trim(),
      pros: pros,
      cons: cons,
    });
  }

  const validDestinations = generatedDestinations.filter(
    (destination) => destination !== null
  );
  //  console.log(validDestinations)

  return validDestinations;
};
