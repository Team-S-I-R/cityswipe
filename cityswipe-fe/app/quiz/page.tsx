"use client";

import { Button } from "@/components/ui/button";
import { useCitySwipe } from "../citySwipeContext";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import quizQuestions from "../quiz-questions/questions";
import {
  generateCityBio,
  streamConversation,
  Message,
  submitFormResponse,
  addQuestions,
} from "../actions";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { useDestinationSetContext } from "../../context/destinationSetContext";
import { redirect } from "next/navigation";
import { Description } from "@radix-ui/react-dialog";
import { createClient } from "pexels";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../cs-componets/header";
import { number } from "zod";

export default function QuizClient({ clerkdata }: any) {
  const { isStarted, setIsStarted } = useCitySwipe();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [otherString, setOtherString] = useState<string[]>(Array(13).fill(''));
  const [responses, setResponses] = useState<string[]>([]);
  // Responses for debuggin!
  // const [otherString, setOtherString] = useState<string[]>([
  //   "United States",
  //   "Luxury",
  //   "English",
  //   "Yes",
  //   "Summer",
  //   "Warm",
  //   "Beach",
  //   "Sprinting, Hiking, Camping, Swimming, Drawing",
  //   "Vegan",
  //   "Street food",
  //   "No",
  //   "No",
  // ]);
  const questionKeys = Object.keys(quizQuestions);
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const [destinations, setDestinations] = useState<any[]>([]);
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const router = useRouter();
  const [loadingMatches, setLoadingMatches] = useState(false);

  // sets user data
  const { userdata, setUserData } = useCitySwipe();
  useEffect(() => {
    if (clerkdata) {
      setUserData?.(clerkdata);
    }
  }, [clerkdata]);

  const sanitizeText = (text: string) => {
    const sanText = text.replace(/[*_~`]/g, "");
    return sanText;
  };

  // ANCHOR key listeners ⌨️
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, quizQuestions.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const handleNext = () => {
    const newResponses = [...responses];
    let newStr = ""
    let toggle = document.getElementById("toggle-group")
    // console.log("Here");
    if (toggle) {
      for (let i = 0; i < toggle.children.length; i++) {
        let child = toggle.children[i]
        // console.log(child?.ariaPressed);
        // console.log(child.innerHTML);
        child?.ariaPressed == "true" && (newStr = newStr.concat(child.innerHTML) + ". ")
      }
    }
    newResponses[currentQuestionIndex] = newStr + otherString[currentQuestionIndex]
    newResponses[currentQuestionIndex] == "" && (newResponses[currentQuestionIndex] = "any")
    console.log(newResponses[currentQuestionIndex])
    setResponses(newResponses);
    
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, quizQuestions.length - 1)
    );
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // end key listeners

  // ANCHOR setting the quiz
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newResponses = [...otherString];
    newResponses[currentQuestionIndex] = event.target.value;
    setOtherString(newResponses);
  };

  // ANCHOR Handles quiz submission and setting data like images, bio, matches, etc.
  const handleGemini = async () => {
    setLoadingMatches(true);
    // console.log(`responses`);
    const prompt = `Based on the following travel preferences, generate a list of exactly 8 travel destinations formatted as json with values City, Country, Compatibility Percentage(based on the user preferences provided), a brief description of the city, the pros (based on the user preferences), the cons (based on the user preferences). Example format:
        [
            {
                "id": 0
                "city": "Tokyo",
                "country": "Japan",
                "compatibility": 85,
                "description": "A short description about tokyo",
                "pros": ["Rich history", "Modern architecture", "Vibrant nightlife", "Delicious food", "Famous landmarks", "Fashion industry", "Technology industry", "Historical sites", "Cultural attractions", "Entertainment options"],
                "cons": ["Crowded", "Expensive", "Pollution", "Language barrier", "Lack of green spaces", "High cost of living", "Long working hours", "Traffic congestion", "Limited public transportation", "Limited public transportation"],
            },
            {
                "id": 1
                "city": "Paris",
                "country": "France",
                "compatibility": 78,
                "description": "A short description about paris",
                "pros": ["Beautiful architecture", "Delicious food", "Romantic atmosphere", "Art and fashion", "Historical sites", "Cultural attractions", "Entertainment options", "Museums", "Restaurants", "Parks"],
                "cons": ["Expensive", "Crowded", "Language barrier", "Lack of green spaces", "High cost of living", "Long working hours", "Traffic congestion", "Limited public transportation", "Limited public transportation"],
            },
                ... 6 more of the same format
        ]

        Make sure the compatibility percentage is a number between 0 and 100. 
        Do not include formatting or code blocks, follow example. 
        Corelate all the data when making decisions. 
        Questions are answered by the user in order of listing as follows: home country, luxury mid range or budget places, languages spoken, comfortable in country with unknown language or no, proffered season, proffered temperature, beach mountain or city, 5 favorite activities, dietary restrictions and preferences, local food fine dining or street, proffered activities and facilities, comfortable in country with recreational drug use or not. 
        
        Here are the user preference answers in order:\n\n${responses.join(
          "\n"
        )}`;

    const conversationHistory: Message[] = [
      { role: "user" as const, content: prompt },
    ];

    const { newMessage } = await streamConversation(conversationHistory);
    let textContent = "";

    for await (const delta of readStreamableValue(newMessage)) {
      textContent += delta;
    }

    let count = 1;
    // added a delay because I noticed we get rate limited by the API easily.
    // because of this delay this gives us freedom to add either an add or just a better loading state.
    // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const startTime = performance.now(); // Start tracking time

    // console.log(textContent)
    let data = JSON.parse(textContent);
    // Add illustration
    for (var i in data) {
      // ANCHOR Fetch image for the current city-country pair
      const client = createClient(
        "8U6Se7vVT3H9tx1KPZAQTkDUSW0IKi3ldgBTVyh3W9NFF7roIpZxktzY"
      );
      let illustration = "";

      try {
        const response = await client.photos.search({
          query: `${data[i].city}, ${data[i].country}`,
          per_page: 1,
        });
        if ("photos" in response && response.photos.length > 0) {
          illustration = response.photos[0].src.landscape;
        }
      } catch (error) {
        console.error(
          `Error in fetching photo for ${data[i].city}, ${data[i].country}:`,
          error
        );
      }
      data[i].illustration = illustration;
    }

    // console.log(data) // formatted data

    // const generatedDestinations = [];
    // const destinations = JSON.parse(textContent);

    // for (const destination of destinations) {
    //     const { city, country, compatibility, description, pros, cons, } = destination;

    //         // ANCHOR Fetch image for the current city-country pair
    //         const client = createClient('8U6Se7vVT3H9tx1KPZAQTkDUSW0IKi3ldgBTVyh3W9NFF7roIpZxktzY');
    //         let illustration = '';

    //         const searchQuery = `${city}, landscape`;
    //         try {
    //             const response = await client.photos.search({ query: `${searchQuery}`, per_page: 1 });
    //             if ('photos' in response && response.photos.length > 0) {
    //                 illustration = response.photos[0].src.landscape;
    //             }
    //         } catch (error) {
    //             console.error(`Error in fetching photo for ${city}, ${country}:`, error);
    //         }

    //         generatedDestinations.push({
    //             id: count++,
    //             city: city.trim(),
    //             country: country.trim(),
    //             compatibility: parseFloat(compatibility),
    //             illustration: illustration,
    //             description: description.trim(),
    //             pros: pros,
    //             cons: cons,
    //         });
    // }

    // const validDestinations = generatedDestinations.filter(destination => destination !== null);

    // setDestinations(validDestinations);

    // await setDestinationSet({
    //     id: 1,
    //     cards: validDestinations.reverse(),
    // });

    setDestinations(data);
    await setDestinationSet({
      id: 1,
      cards: data.reverse(),
    });

    await addQuestions(otherString);

    setLoadingMatches(false);

    const endTime = performance.now(); // End tracking time
    console.log(`handleGemini took ${endTime - startTime} milliseconds`);

    router.push("/match");
  };

  // ANCHOR Resetting the quiz {
  const handleHomeFunction = () => {
    setCurrentQuestionIndex(0);
    router.push("/");
    setResponses([]);
    setOtherString([])
  };

  return (
    <>
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.75 }}
        id="question-container"
        className="w-full px-14 bg-red-500 rounded-t-xl shadow-2xl absolute bottom-0 h-full bg-white text-[12px] gap-6 flex flex-col place-items-start place-content-center"
      >
        <div className="flex flex-col w-full place-items-start px-8 gap-5">
          <h1 className="w-full w-md text-muted-foreground sm:text-left text-center place-content-center text-[15px]">
            Hi {userdata?.name?.split(" ")[0]}, Take the Cityswipe quiz to find
            your perfect destination!
          </h1>

          <p className="text-3xl text-center sm:text-left sm:text-[44px] w-full font-bold pb-8">
            {currentQuestion.question}
          </p>

          {/* Answer Options */}
          <div className="flex flex-col w-full place-items-start gap-3">
            <ToggleGroup
              id="toggle-group"
              type="multiple"
              className="flex flex-col"
            >
              {currentQuestion.answerOptions.map((answer, i) => {
                return (
                  <ToggleGroupItem
                    key={`response-option-${i}`}
                    id={`response-option-${i}`}
                    className="w-full text-lg"
                    variant="outline"
                    value={answer}
                    size="lg"
                  >
                    {answer}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>

            <div className="hidden sm:flex w-full pt-0">
              <Input
                id="response-input"
                type="text"
                className="w-full text-base"
                autoComplete="off"
                value={sanitizeText(otherString[currentQuestionIndex] || "")}
                placeholder={currentQuestion.additionalStringPlaceholder}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-row gap-2">
            {currentQuestionIndex > 0 && (
              <Button
                className="hover:scale-[95%] text-[14px] text-white hover:opacity-80 flex place-self-start h-11"
                // variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Back
              </Button>
            )}
            {
              currentQuestionIndex < quizQuestions.length-1 && <Button
                className="hover:scale-[95%] text-[14px] bg-gradient-to-t from-cyan-500 to-green-400  select-none"
                onClick={handleNext}
                size="lg"
              >
                Next
              </Button>
            }
          </div>

          {/* mobile */}
          <div className="flex sm:hidden w-full flex-col gap-6 place-content-center place-items-center">
            <Input
              id="response-input"
              type="text"
              className="w-[80%]"
              autoComplete="off"
              value={sanitizeText(otherString[currentQuestionIndex] || "")}
              onChange={handleInputChange}
            />
            <div className="flex w-full gap-6 justify-center">
              {otherString[currentQuestionIndex]?.length > 1 && (
                <Button
                  className="hover:scale-[95%] text-[12px] px-0 m-0 select-none bg-transparent hover:bg-transparent text-primary hover:opacity-80 flex place-self-start"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Back
                </Button>
              )}
              {otherString[currentQuestionIndex]?.length > 1 && (
                <Button
                  className="hover:scale-[95%] text-[12px] bg-gradient-to-t from-cyan-500 to-green-400  select-none"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* <button
            className=" w-max underline h-5 absolute bottom-10 right-10 bg-transparent hover:bg-transparent text-primary hover:opacity-80 z-10"
            onClick={() => handleHomeFunction()}
          >
            Go back
          </button> */}
        </div>

        {currentQuestionIndex === quizQuestions.length - 1 &&
          loadingMatches && (
            <>
              <div className="absolute w-full h-max flex place-items-center place-content-center">
                <span className="text-[12px] animate-pulse">
                  Your matches are loading...
                </span>
              </div>
            </>
          )}

        {currentQuestionIndex === quizQuestions.length - 1 && (
          <>
            <div className="flex place-self-center">
              <Button
                onClick={() => {
                  handleGemini();
                }}
                className="hover:scale-[95%] text-[12px] bg-gradient-to-t from-cyan-500 to-green-400 select-none w-max"
              >
                Find Your Match!
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
