"use client";

import { Button } from "@/components/ui/button";
import { useCitySwipe } from "../citySwipeContext";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import quizQuestions from "../quiz-questions/questions";
import { addQuestions } from "../actions";
import { useRouter } from "next/navigation";
import { useDestinationSetContext } from "../../context/destinationSetContext";
import { generateDestinations } from "./generateDestinations";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../cs-componets/header";
import { useToast } from "../../hooks/use-toast";
import Image from "next/image";
import gif1 from "../assets/gifs/gif1.gif";
import gif2 from "../assets/gifs/gif2.gif";
import gif3 from "../assets/gifs/gif3.gif";
import gif4 from "../assets/gifs/gif4.gif";
import gif5 from "../assets/gifs/gif5.gif";
import LoadingModal from "@/components/ui/loadingModal";

export default function QuizClient({ clerkdata }: any) {
  const { isStarted, setIsStarted } = useCitySwipe();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>(
    Array(quizQuestions.length).fill("")
  );

  const [isOptionHighlighted, setIsOptionHighlighted] = useState(false);
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState<
    number | null
  >(null);
  const [theHighlightedAnswer, setTheHighlightedAnswer] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const questionKeys = Object.keys(quizQuestions);
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const router = useRouter();
  const [loadingMatches, setLoadingMatches] = useState(false);
  const { toast } = useToast();

  const [gifUrls, setGifUrls] = useState<string[]>([
    gif1.src,
    gif2.src,
    gif3.src,
    gif4.src,
    gif5.src,
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
    setGifAnimationKey((prevKey) => prevKey + 1);
  };

  // ANCHOR these will toggles the next question forward and backwards ------------------------------------------------------------------------------------------------
  // ----- NOTE (handling form data from a button like this is extremely unreliable and there are better ways just using things like Refs, Props, Etc to handle this..)
  // ----- I handle clearing what I need to clear here but I do not set the data from the form here.
  const handleNext = () => {
    // Go to the next question
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, quizQuestions.length - 1)
    );
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

    setResponses((prevState) => {
      const newResponses = [...prevState];
      newResponses[currentQuestionIndex] = value;
      return newResponses;
    });

    console.log("responses: ", responses);
  };

  const handleOptionSelection = (option: string, index: number) => {
    // If the same option is clicked again, reset the states
    if (responses[currentQuestionIndex] === option) {
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
  };

  // ANCHOR handling gemini call - quiz submission ------------------------------------------------------------------------------------------------

  const handleGemini = async () => {
    setLoadingMatches(true);
    const startTime = performance.now(); // Start tracking time
    // console.log(`responses`);
    try {
      const destinations = await generateDestinations(responses);
      await setDestinationSet({
        id: 1,
        cards: destinations.reverse(),
        allCards: destinations.reverse(),
        responses: responses,
      });
      console.log("desti", destinationSet);

      await addQuestions(responses);

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

  // ------------------------------------------------------------------------------------------------

  const handleGifs = (index: number) => {
    setGifToShow(gifUrls[index]);
  };

  useEffect(() => {
    handleGifs(currentQuestionIndex);
  }, [currentQuestionIndex]);

  return (
    <>
      <Header />
      <AnimatePresence>
        <motion.div
          id="question-container"
          className="w-[100%] opacity-[100%]  rounded-t-xl shadow-2xl absolute bottom-0 h-full overflow-hidden bg-white text-[12px] gap-6 flex flex-col place-items-end place-content-center"
        >
          <div
            className={`flex flex-col w-full md:w-[60%] px-[3%] h-[80dvh] overflow-y-scroll place-items-start  place-content-start justify-between gap-5 blur-0`}
          >
            {/* Progress Bar */}

            <div className="w-full px-[3%] h-max flex place-items-end place-content-between flex-col gap-4">
              <div className=""></div>
              <p className="w-full">Your Cityswipe Quiz Progress</p>

              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-green-400 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (currentQuestionIndex / (quizQuestions.length - 1)) * 100
                    }%`,
                  }}
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
                  Only{" "}
                  <span className="font-bold text-black">
                    {quizQuestions.length - currentQuestionIndex}
                  </span>{" "}
                  questions left!
                </span>
              )}
            </div>

            {/* The rest of The quiz */}
            {/* <Image src= {currentQuestion.gif as string} alt="gif"/> */}
            <div className="w-full h-max flex flex-col gap-4 place-content-center place-items-center">
              {currentQuestionIndex == 0 && (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2.5 }}
                  className="w-full px-[3%] w-md text-muted-foreground sm:text-left text-center place-content-center text-[15px]"
                >
                  Hi {userdata?.name?.split(" ")[0]}, Take the Cityswipe quiz to
                  find your perfect destination!
                </motion.h1>
              )}

              <motion.p
                initial={{ opacity: 0.2, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: "circOut" }}
                key={currentQuestionIndex}
                className="text-xl text-center md:text-left px-[3%] sm:text-2xl lg:text-4xl w-full font-bold"
              >
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
              <div className="flex flex-col  w-full place-items-center gap-6 pt-8">
                {currentQuestion.selectionType != "text" && (
                  <ToggleGroup
                    id="toggle-group"
                    type={
                      currentQuestion.selectionType as "multiple" | "single"
                    }
                    className="md:flex-row flex-col flex w-full gap-4 md:gap-1"
                  >
                    {currentQuestion.answerOptions.map((answer, i) => {
                      return (
                        <ToggleGroupItem
                          key={`response-option-${i}`}
                          id={`response-option-${i}`}
                          className={`relative text-[18px] flex py-4 w-full h-[60px] md:w-[33%] md:h-[200px] font-bold !text-white ${
                            responses[currentQuestionIndex] === answer
                              ? "!bg-transparent outline outline-[3px] outline-black/40"
                              : "!bg-transparent"
                          }`}
                          variant="outline"
                          value={answer}
                          onClick={() => handleOptionSelection(answer, i)}
                          size="lg"
                        >
                          {responses[currentQuestionIndex] === answer && (
                            <motion.span
                              initial={{ opacity: 0.6, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0.6, y: -20 }}
                              transition={{ duration: 0.5 }}
                              className="bg-gradient-to-t from-cyan-500 to-green-400 p-1 px-3 rounded-full"
                            >
                              {answer}
                            </motion.span>
                          )}

                          {responses[currentQuestionIndex] != answer && (
                            <motion.span className="bg-black opacity-80 p-1 px-3 rounded-full">
                              {answer}
                            </motion.span>
                          )}

                          <span className="absolute z-[-2] top-0 left-0 w-full h-full">
                            <Image
                              src={
                                currentQuestion.answerOptionImages
                                  ? currentQuestion.answerOptionImages[i]
                                  : ""
                              }
                              alt={answer}
                              width={1000}
                              height={1000}
                              className="object-cover p-[2px] rounded-lg object-center w-full h-full"
                            />
                          </span>

                          {responses[currentQuestionIndex] === answer && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1 }}
                              className="absolute hidden md:block bg-gradient-to-t from-cyan-400 via-green-200 to-[90%] to-transparent z-[-1] bottom-0 left-0 w-full h-[100%]"
                            ></motion.span>
                          )}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                )}

                <div className="flex sm:flex px-[3%] w-full pt-0">
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

              <div className="flex flex-row gap-2 w-full px-[8%] sm:w-auto">
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

            <div></div>
          </div>

          <motion.div
            key={gifAnimationKey}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0.5 }}
            className="w-[0%] md:w-[40%] left-0 absolute h-[100%]"
          >
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
            <LoadingModal show={loadingMatches} text="Scouring the globe for your destinations..."/>}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
