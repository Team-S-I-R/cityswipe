'use client'

import { Button } from "@/components/ui/button";
import { useCitySwipe } from '../citySwipeContext';
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import quizQuestions from "../quiz-questions/questions";
import { generateCityBio, streamConversation, Message, submitFormResponse } from "../actions";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from "react-dom";
import { useDestinationSetContext } from "../../context/destinationSetContext";
import { redirect } from "next/navigation";
import { Description } from "@radix-ui/react-dialog";
import { createClient } from 'pexels';
import { AnimatePresence, motion } from 'framer-motion'
import Header from "../cs-componets/header";


export default function QuizClient() {

    const { isStarted, setIsStarted } = useCitySwipe();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // const [responses, setResponses] = useState<string[]>([]);
    // Responses for debuggin!
    const [responses, setResponses] = useState<string[]>(["United States", "Luxury", "English", "Yes", "Summer", "Warm", "Beach", "Sprinting, Hiking, Camping, Swimming, Drawing", "Vegan", "Street food", "No", "No"]);
    const questionKeys = Object.keys(quizQuestions);
    const [updateHeart, setUpdateHeart] = useState(false);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [conversation, setConversation] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [destinationSet, setDestinationSet] = useDestinationSetContext();
    const router = useRouter();
    const [loadingMatches, setLoadingMatches] = useState(false);
    // for pexals
    const [ pexalsPhoto, setPexalsPhoto ] = useState<string>(''); 
    const [cityCountryQuery, setCityCountryQuery] = useState<string>("");
    const {photoUrl, setPhotoUrl} = useCitySwipe();


    const sanitizeText =(text: string) => {
        const sanText = text.replace(/[*_~`]/g, '');
        return sanText; 
    }

    
    // ANCHOR key listeners ⌨️
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            setCurrentQuestionIndex((prevIndex) => 
                Math.min(prevIndex + 1, questionKeys.length - 1)
        );
    } else if (event.key === 'ArrowUp') {
        setCurrentQuestionIndex((prevIndex) => 
            Math.max(prevIndex - 1, 0)
    );
    }
    };

    const handleNext = () => {
        setCurrentQuestionIndex((prevIndex) => 
            Math.min(prevIndex + 1, questionKeys.length - 1)
        );
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) => 
            Math.max(prevIndex - 1, 0)
        );
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    // end key listeners

    // ANCHOR setting the quiz 
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newResponses = [...responses];
        newResponses[currentQuestionIndex] = event.target.value;
        setResponses(newResponses);
    };

    // ANCHOR Handles quiz submission and setting data like images, bio, matches, etc.
    const handleGemini = async () => {
        setLoadingMatches(true);
        // console.log(`responses`);
        const prompt = 
        `Based on the following travel preferences, generate a list of exactly 50 travel destinations formatted as 'City, Country, Compatibility Percentage. Exact Example format:
        Tokyo, Japan 85%
        Paris, France 78%
        ... 48 more of the same format
        Make sure the compatibility percentage is a number between 0 and 100. Each entry should be on a new line, there should be no additional text before or after the output(including bullet points or numbering), follow exact example. Corelate all the data when making decisions. Questions are answered by the user in order of listing as follows: home country, luxury mid range or budget places, languages spoken, comfortable in country with unknown language or no, proffered season, proffered temperature, beach mountain or city, 5 favorite activities, dietary restrictions and preferences, local food fine dining or street, proffered activities and facilities, comfortable in country with recreational drug use or not. 
        Here are the user preference answers in order:\n\n${responses.join('\n')}`;
        
        const conversationHistory: Message[] = [
            { role: "user" as const, content: prompt },
        ];
    
        const { newMessage } = await streamConversation(conversationHistory);
        let textContent = "";
    
        for await (const delta of readStreamableValue(newMessage)) {
            textContent += delta;
        }
        let count = 1;
    
        const generatedDestinations = await Promise.all(
            textContent.trim().split('\n').map(async destination => {
                const match = destination.match(/^(.*), ([A-Za-z\s]+) (\d+)%$/);
    
                if (match) {
                    const [, city, country, score] = match;
    
                    // Fetch image for the current city-country pair
                    const client = createClient('8U6Se7vVT3H9tx1KPZAQTkDUSW0IKi3ldgBTVyh3W9NFF7roIpZxktzY');
                    let illustration = '';
    
                    try {
                        const response = await client.photos.search({ query: `${city}, ${country}`, per_page: 1 });
                        if ('photos' in response && response.photos.length > 0) {
                            illustration = response.photos[0].src.landscape;
                        }
                    } catch (error) {
                        console.error(`Error in fetching photo for ${city}, ${country}:`, error);
                    }
    
                    return {
                        id: count++,
                        location: `${city}, ${country}`.trim(),
                        rating: parseFloat(score),
                        illustration: illustration,
                        description: "",
                    };
                } else {
                    return null;
                }
            })
        );
    
        const validDestinations = generatedDestinations.filter(destination => destination !== null);
        setDestinations(validDestinations);
        await setDestinationSet({
            id: 1,
            cards: validDestinations.reverse(),
        });
    
        setLoadingMatches(false);
        router.push('/match');
    };

    // ANCHOR Resetting the quiz {
        const handleHomeFunction = () => {
            setCurrentQuestionIndex(0);
            router.push('/');
            setResponses([]);
        }
    // 

    return (
        <>

            <Header />

                <motion.div 
                     initial = {{opacity: 0}}
                     animate = {{opacity: 1}}
                     transition = {{duration: 1.75}}
                    id="question-container" className="w-full bg-red-500 rounded-t-xl shadow-2xl absolute bottom-0 h-full  bg-white text-[12px] h-64 gap-6 flex flex-col place-items-start place-content-center">
                        
                        <div className="flex flex-col w-full place-items-start px-8  gap-6">

                            <h1 className="w-max w-md text-muted-foreground place-content-center text-[10px]">Take the Cityswipe quiz to find your perfect destination!</h1>

                            <p className="text-3xl text-center sm:text-left sm:text-[44px] w-full font-bold">{quizQuestions[questionKeys[currentQuestionIndex] as keyof typeof quizQuestions]}</p>
                            
                            <div className="hidden sm:flex w-full gap-6">
                                {responses[currentQuestionIndex]?.length > 1 && 
                                <Button className="hover:scale-[95%] text-[12px] p-0 m-0 select-none bg-transparent hover:bg-transparent text-primary hover:opacity-80 flex place-self-start" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Back</Button>
                                }
                                <Input 
                                    id="response-input" 
                                    type="text" 
                                    className="w-full" 
                                    autoComplete="off"
                                    value={sanitizeText(responses[currentQuestionIndex] || '')}
                                    onChange={handleInputChange}
                                />
                                {responses[currentQuestionIndex]?.length > 1 && 
                                    <Button className="hover:scale-[95%] text-[12px] bg-gradient-to-t from-cyan-500 to-green-400  select-none" onClick={handleNext}>Next</Button>
                                }
                            </div>

                            {/* mobile */}
                            <div className="flex sm:hidden w-full flex-col gap-6 place-content-center place-items-center">
                                <Input 
                                    id="response-input" 
                                    type="text" 
                                    className="w-[80%]" 
                                    autoComplete="off"
                                    value={sanitizeText(responses[currentQuestionIndex] || '')}
                                    onChange={handleInputChange}
                                />
                                <div className="flex w-full gap-6 justify-center">

                                    {responses[currentQuestionIndex]?.length > 1 && 
                                    <Button className="hover:scale-[95%] text-[12px] px-0 m-0 select-none bg-transparent hover:bg-transparent text-primary hover:opacity-80 flex place-self-start" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Back</Button>
                                    }
                                    {responses[currentQuestionIndex]?.length > 1 && 
                                        <Button className="hover:scale-[95%] text-[12px] bg-gradient-to-t from-cyan-500 to-green-400  select-none" onClick={handleNext}>Next</Button>
                                    }

                                </div>
                            </div>

                            <button className=" w-max underline h-5 absolute bottom-10 right-10 bg-transparent hover:bg-transparent text-primary hover:opacity-80 z-10" onClick={() => handleHomeFunction()}>
                                Go back
                            </button>

                        </div>

                    {currentQuestionIndex === questionKeys.length - 1 && loadingMatches &&
                    <>
                        <div className="absolute w-full h-max flex place-items-center place-content-center">
                            <span className="text-[12px] animate-pulse">Your matches are loading...</span>
                        </div>
                    </>
                    }


                    {currentQuestionIndex === questionKeys.length - 1 &&
                    <>
                        <div className="flex place-self-center">
                            <Button onClick={() => {handleGemini()}} className="hover:scale-[95%] text-[12px] bg-gradient-to-t from-cyan-500 to-green-400 select-none w-max">Find Your Match!</Button>
                        </div>
                    </>
                    }


                </motion.div>
        </>
    )
}