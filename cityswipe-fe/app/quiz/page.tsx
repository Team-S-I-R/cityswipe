"use client";

import { Button } from "@/components/ui/button";
import { useCitySwipe } from "../citySwipeContext";
import React, { useEffect, useState, useRef } from "react";
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
import { useToast } from "../../hooks/use-toast";
import { number } from "zod";
import Image from "next/image";
import { searchGiphyGif } from "../actions";
import gif1 from "../assets/gifs/gif1.gif"
import gif2 from "../assets/gifs/gif2.gif"
import gif3 from "../assets/gifs/gif3.gif"
import gif4 from "../assets/gifs/gif4.gif"
import gif5 from "../assets/gifs/gif5.gif"


export default function QuizClient({ clerkdata }: any) {
  const { isStarted, setIsStarted } = useCitySwipe();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>(Array(quizQuestions.length).fill(""));

  const [isOptionHighlighted, setIsOptionHighlighted] = useState(false);
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState<number | null>(null);
  const [theHighlightedAnswer, setTheHighlightedAnswer] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const questionKeys = Object.keys(quizQuestions);
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const [destinations, setDestinations] = useState<any[]>([]);
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const router = useRouter();
  const [loadingMatches, setLoadingMatches] = useState(false);
  const { toast } = useToast();

  const [gifUrls, setGifUrls] = useState<string[]>([
    gif1.src,
    gif2.src,
    gif3.src,
    gif4.src,
    gif5.src
  ]);

  const [gifToShow, setGifToShow] = useState<string>(gif1.src);
  const [gifAnimationKey, setGifAnimationKey] = useState<number>(0);

  console.log("responses", responses);

  // ANCHOR sets user data
  const { userdata, setUserData } = useCitySwipe();
  useEffect(() => {
    if (clerkdata) {
      setUserData?.(clerkdata);
    }
  }, [clerkdata]);

  // ANCHOR text sanitization (this cleans up the text input for gemini (Shaurya's reccomendation)) ------------------------------------------------------------------------------------------------

  const sanitizeText = (text: string) => {
    const sanText = text.replace(/[*_~`]/g, "");
    return sanText;
  };

  // Function to trigger GIF animation
  const triggerGifAnimation = () => {
    setGifAnimationKey(prevKey => prevKey + 1);
  };

  // ANCHOR these will toggles the next question forward and backwards ------------------------------------------------------------------------------------------------
  // ----- NOTE (handling form data from a button like this is extremely unreliable and there are better ways just using things like Refs, Props, Etc to handle this..)
  // ----- I handle clearing what I need to clear here but I do not set the data from the form here.
  const handleNext = () => {
    if (currentQuestion.id == 5 && responses[currentQuestionIndex] == "yes. ") {
      
      // Skip the next question
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 2, quizQuestions.length - 1)
      );

    } else {

      // Go to the next question
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, quizQuestions.length - 1)
      );

    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    // Deselect the highlighted option and index
    setIsOptionHighlighted(false);
    setHighlightedOptionIndex(null);
    setTheHighlightedAnswer("");
    triggerGifAnimation(); // Trigger animation

    console.log("currentQuestionIndex: ", currentQuestionIndex);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    // Deselect the highlighted option and index
    setIsOptionHighlighted(false);
    setHighlightedOptionIndex(null);
    setTheHighlightedAnswer("");
    triggerGifAnimation(); // Trigger animation

    console.log("currentQuestionIndex: ", currentQuestionIndex);
  };

  // ANCHOR these two functions ensure that responses are updated on change -
  // ----- DO NOT CHANGE THIS WITHOUT COMMUNICATING WITH ITWELA AND CONSOLE LOGGING WHAT YOU ARE DOING.
  // ----- IF FOR SOME REASON YOU DON'T THINK THIS WORKS, CONSOLE LOG BEFORE CHANGING ANYTHING.
  // -------------------------------------------------------------------------------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const { name, value } = e.target;
    
    console.log("name and value ", name, value);
  
    setResponses(prevState => {
        const newResponses = [...prevState];
        newResponses[currentQuestionIndex] = value;
        return newResponses;
    });

    console.log("responses: ", responses);

  };

  const handleOptionSelection = (option: string, index: number) => {
    
    // If the same option is clicked again, reset the states
    if (highlightedOptionIndex === index && responses[currentQuestionIndex] === option) {
      
      setHighlightedOptionIndex(null);
      setIsOptionHighlighted(false);
      setResponses((prevState) => {
        const newResponses = [...prevState];
        newResponses[currentQuestionIndex] = "";
        return newResponses;
      });
      setTheHighlightedAnswer("");

    } else {
      // Set the highlighted option index to the selected index
      setHighlightedOptionIndex(index);
      
      // Set the isOptionHighlighted state to true
      setIsOptionHighlighted(true);

      // Update the responses based on the new state
      setResponses((prevState) => {
        // Create a new array of responses by copying the previous state
        const newResponses = [...prevState];
        
        // Update the response for the current question index based on the new state
        newResponses[currentQuestionIndex] = option;
        
        // Return the updated array of responses
        return newResponses;
      });

      // Set the highlighted answer
      setTheHighlightedAnswer(option);
    }
    // setGifAnimationKey(prevKey => prevKey + 1); // Trigger animation
  }

  // ANCHOR handling gemini call - quiz submission ------------------------------------------------------------------------------------------------

  const handleGemini = async () => {
    setLoadingMatches(true);
    const startTime = performance.now(); // Start tracking time
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

        Here are tips you must follow when generating this content. THis is important because we will be using JSON.parse to parse this data so it is important to follow this format and to create NO ERRORS.
        
        Every key in the JSON string is enclosed in double quotes ("key").
        The values are correctly formatted (e.g., strings should be in double quotes, numbers should not).
        There are no trailing commas after the last property of each object or array.
        DO NOT ADD ANY MARKDOWN, CODE BLOCKS OR FORMATTING BESIDES THE EXAMPLE JSON FORMAT.

        Make sure the compatibility percentage is a number between 0 and 100. 
        Do not include formatting or code blocks, follow example. 
        Corelate all the data when making decisions. 
        the questions answered by the user (in order) are as follows: \n${console.log(quizQuestions.map(q => q.question).join('\n'))}\n 
        
        Here are the user preference answers in order:\n${responses.join(
          "\n"
    )}`;

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
    try {
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
          console.error(
            `Error in fetching photo for ${city}, ${country}:`,
            error
          );
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

      setDestinations(validDestinations);

      await setDestinationSet({
        id: 1,
        cards: validDestinations.reverse(),
      });

      await addQuestions(responses);

      setLoadingMatches(false);

      const endTime = performance.now(); // End tracking time

      console.log(`handleGemini took ${endTime - startTime} milliseconds`);

      router.push("/match");
    } catch (error) {
      setLoadingMatches(false);
      toast({
        title: "Error. Please try submitting again!",
        description: "We encountered an error. Please try submitting again.",
        itemID: "error",
      });
    }
  };

  // ------------------------------------------------------------------------------------------------

  const handleGifs = (index: number) => {
    setGifToShow(gifUrls[index]);
  }

  useEffect(() => {
    handleGifs(currentQuestionIndex);
  }, [currentQuestionIndex]);


  return (
    <>
      <Header />
    <AnimatePresence>

      <motion.div
        id="question-container"
        className="w-[100%] opacity-[100%]  rounded-t-xl shadow-2xl absolute bottom-0 h-full bg-white text-[12px] gap-6 flex flex-col place-items-end place-content-center"
      >
        <div
          className={`flex flex-col w-full md:w-[60%] px-[3%] h-full place-items-start  place-content-center gap-5 ${
            loadingMatches ? "blur-sm" : "blur-0"
          }`}
        >

          {/* Progress Bar */}
          
          <div className="w-full h-max flex place-items-end place-content-between flex-col gap-4">

            <p className="w-full">Your Cityswipe Quiz Progress</p>

            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              
              <div
                className="bg-gradient-to-r from-cyan-500 to-green-400 h-2.5 rounded-full"
                style={{ width: `${((currentQuestionIndex) / (quizQuestions.length - 1)) * 100}%` }}
              />

              
            </div>

            {/* Questions Left */}
            {currentQuestionIndex === 4 && (
            
              <span className="text-sm text-muted-foreground flex flex-col place-items-end">
                <span className="font-bold !text-black">You made it! </span> 
                <span>Press ( Find Your Match ) to see your matches!</span>
              </span>
            
            )}

            {currentQuestionIndex < 4 && (

              <span className="text-sm text-muted-foreground">
                Only <span className="font-bold text-black">{quizQuestions.length - currentQuestionIndex}</span> questions left!
              </span>
            
            )}

          </div>


          {/* The rest of The quiz */}
              {/* <Image src= {currentQuestion.gif as string} alt="gif"/> */}
            <div className="w-full h-[60%] flex flex-col gap-4 place-content-center">

                {currentQuestionIndex == 0 && (
                  <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2.5 }}
                  className="w-full w-md text-muted-foreground sm:text-left text-center place-content-center text-[15px]">
                    Hi {userdata?.name?.split(" ")[0]}, Take the Cityswipe quiz to
                    find your perfect destination!
                  </motion.h1>
                )}

                <motion.p 
                  initial={{ opacity: 0.2, y: -100 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ duration: 0.75, ease: "circOut" }}
                  key={currentQuestionIndex}
                className="text-3xl text-center sm:text-left sm:text-[44px] w-full font-bold">
                  {currentQuestion.question}
                </motion.p>

                {/* {currentQuestion.infoText != "" && (
                  <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2.5 }}
                  className=" w-full w-md text-muted-foreground sm:text-left text-center place-content-center text-[15px]">
                    {currentQuestion.infoText}
                  </motion.h1>
                )} */}

                {/* Answer Options */}
                <div className="flex flex-col w-full place-items-start gap-3 pt-8">
                  {currentQuestion.selectionType != "text" && (
                    <ToggleGroup
                      id="toggle-group"
                      type={currentQuestion.selectionType as "multiple" | "single"}
                      className="flex w-full sm:w-auto"
                    >
                      {currentQuestion.answerOptions.map((answer, i) => {
                        return (
                          <ToggleGroupItem
                            key={`response-option-${i}`}
                            id={`response-option-${i}`}
                            className={`${highlightedOptionIndex === i && responses[currentQuestionIndex] === answer ? "bg-gradient-to-t from-cyan-500 to-green-400 !text-white text-muted-foreground" : "!bg-white" }`}
                            variant="outline"
                            value={answer}
                            onClick={() => handleOptionSelection(answer, i)}
                            size="lg"
                          >
                            {answer}
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  )}

                  <div className="flex sm:flex w-full pt-0">
                    <Input
                      id="response-input"
                      type="text"
                      className="w-full text-sm text-center sm:text-left"
                      autoComplete="off"
                      placeholder={currentQuestion.additionalStringPlaceholder}
                      value={responses[currentQuestionIndex]}
                      onChange={handleInputChange}
                      ref={inputRef}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-2 w-full sm:w-auto">
                  {currentQuestionIndex > 0 && (
                    <Button
                      className="hover:scale-[95%] text-[14px] text-white hover:opacity-80 flex place-self-start h-11 w-full sm:w-auto"
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                    >
                      Back
                    </Button>
                  )}
                  {currentQuestionIndex < quizQuestions.length - 1 && (
                    <Button
                      className="hover:scale-[95%] text-[14px] bg-gradient-to-t from-cyan-500 to-green-400  select-none w-full sm:w-auto"
                      onClick={handleNext}
                      size="lg"
                    >
                      Next
                    </Button>
                  )}
                </div>

                {currentQuestionIndex === quizQuestions.length - 1 && (
                  <>
                    <div className="flex place-self-center w-full px-8 place-items-center place-content-center">
                      <Button
                        size="lg"
                        onClick={() => {
                          handleGemini();
                        }}
                        className="hover:scale-[95%] text-[14px] w-full sm:w-auto bg-gradient-to-t from-cyan-500 to-green-400 select-none "
                      >
                        Find Your Match!
                      </Button>
                    </div>
                  </>
                )}

            </div>
        

        </div>
      
        <motion.div 
        key={gifAnimationKey}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0.5 }}
        className="w-[0%] md:w-[40%] left-0 absolute h-[100%]">
          <Image
          src={gifToShow as string}
            alt="gif"
            width={1000}
            height={1000}
            className="w-full object-cover h-full"
          />
        </motion.div>
          {/* BLur loading screen */}
        {currentQuestionIndex === quizQuestions.length - 1 &&
          loadingMatches && (
            <>
              <div className="absolute w-full h-max self-center flex place-items-center place-content-center">
                <span className="text-[22px] sm:text-[26px] animate-pulse font-bold text-center">
                  Scouring the globe for your destinations...
                </span>
              </div>
            </>
          )}
      </motion.div>

    </AnimatePresence>
    </>
  );
  
}
