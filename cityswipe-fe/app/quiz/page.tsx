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
  // generateDestinations,
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
import { generateDestinations } from "./generateDestinations";

export default function QuizClient({ clerkdata }: any) {
  const { isStarted, setIsStarted } = useCitySwipe();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [otherString, setOtherString] = useState<string[]>(Array(quizQuestions.length).fill(""));
  const [responses, setResponses] = useState<string[]>([]);
  // Responses for debuggin!
  // const [responses, setResponses] = useState<string[]>([
  //   "United States",
  //   "Luxury",
  //   "international",
  //   "any",
  //   "english",
  //   "yes",
  //   "warm",
  //   "mountains",
  //   "Sprinting, Hiking, Camping, Swimming, Drawing",
  //   "shopping",
  //   "halal",
  //   "Street food",
  //   "No",
  // ]);
  const questionKeys = Object.keys(quizQuestions);
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const router = useRouter();
  const [loadingMatches, setLoadingMatches] = useState(false);
  const { toast } = useToast();

  console.log("responses", responses);

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
  // const handleKeyDown = (event: KeyboardEvent) => {
  //   if (event.key === "ArrowDown") {
  //     handleNext();
  //     setCurrentQuestionIndex((prevIndex) =>
  //       Math.min(prevIndex + 1, quizQuestions.length - 1)
  //     );
  //   } else if (event.key === "ArrowUp") {
  //     setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  //   }
  // };

  const handleNext = () => {
    const newResponses = [...responses];
    let newStr = "";
    let toggle = document.getElementById("toggle-group");
    // console.log("Here");
    if (toggle) {
      for (let i = 0; i < toggle.children.length; i++) {
        let child = toggle.children[i];
        // console.log(child?.getAttribute("data-state"));
        // console.log(child.innerHTML);
        child?.getAttribute("data-state") == "on" &&
          (newStr = newStr.concat(child.innerHTML) + ". ");
      }
    }
    newResponses[currentQuestionIndex] =
      newStr + otherString[currentQuestionIndex];
    newResponses[currentQuestionIndex] == "" &&
      (newResponses[currentQuestionIndex] = currentQuestion.defaultValue);
    // console.log(newResponses[currentQuestionIndex]);
    setResponses(newResponses);

    if (
      currentQuestion.id == 5 &&
      newResponses[currentQuestionIndex] == "yes. "
    ) {
      // Set the response for the skipped question to its default value (any)
      newResponses[currentQuestionIndex + 1] =
        quizQuestions[currentQuestionIndex + 1].defaultValue;
      setResponses(newResponses);

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
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);
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
    const startTime = performance.now(); // Start tracking time
    // console.log(`responses`);
    try{
      const destinations = await generateDestinations(responses)
      await setDestinationSet({
        id: 1,
        cards: destinations.reverse(),
        allCards: destinations.reverse(),
      });

      await addQuestions(otherString);


      const endTime = performance.now(); // End tracking time
      console.log(`handleGemini took ${endTime - startTime} milliseconds`);

      router.push("/match");
      setLoadingMatches(false);
    } catch (error) {
      setLoadingMatches(false);
      toast({
        title: "Error. Please try submitting again!",
        description: "We encountered an error. Please try submitting again.",
        itemID: "error",
      });
    }
  };

  // ANCHOR Resetting the quiz {
  const handleHomeFunction = () => {
    setCurrentQuestionIndex(0);
    router.push("/");
    setResponses([]);
    setOtherString([]);
  };

  return (
    <>
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.75 }}
        id="question-container"
        className="w-full px-4 lg:px-[150px] rounded-t-xl shadow-2xl absolute bottom-0 h-full bg-white text-[12px] gap-6 flex flex-col place-items-start place-content-center"
      >
        <div
          className={`flex flex-col w-full place-items-start px-8 gap-5 ${
            loadingMatches ? "blur-sm" : "blur-0"
          }`}
        >
          {currentQuestionIndex == 0 && (
            <h1 className="w-full w-md text-muted-foreground sm:text-left text-center place-content-center text-[15px]">
              Hi {userdata?.name?.split(" ")[0]}, Take the Cityswipe quiz to
              find your perfect destination!
            </h1>
          )}

          <p className="text-3xl text-center sm:text-left sm:text-[44px] w-full font-bold">
            {currentQuestion.question}
          </p>

          {currentQuestion.infoText != "" && (
            <h1 className=" w-full w-md text-muted-foreground sm:text-left text-center place-content-center text-[15px]">
              {currentQuestion.infoText}
            </h1>
          )}

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
                      className={
                        "data-[state=on]:bg-gradient-to-t data-[state=on]:from-cyan-500 data-[state=on]:to-green-400  data-[state=on]:text-white text-muted-foreground"
                      }
                      variant="outline"
                      value={answer}
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
                value={sanitizeText(otherString[currentQuestionIndex] || "")}
                placeholder={currentQuestion.additionalStringPlaceholder}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-row gap-2 w-full sm:w-auto">
            {currentQuestionIndex > 0 && (
              <Button
                className="hover:scale-[95%] text-[14px] text-white hover:opacity-80 flex place-self-start h-11 w-full sm:w-auto"
                // variant="outline"
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
    </>
  );
}
