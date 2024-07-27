'use client'

import { Button } from "@/components/ui/button";
import { useQuiz } from './quizContext';
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import quizQuestions from "./quiz-questions/questions";
import { House } from "lucide-react";

export default function Hero() {
    const { isStarted, setIsStarted } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<string[]>([]);
    const questionKeys = Object.keys(quizQuestions);

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

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newResponses = [...responses];
        newResponses[currentQuestionIndex] = event.target.value;
        setResponses(newResponses);
    };

    return (
        <>        
        <div className="flex flex-col w-full place-items-center gap-6">
            {!isStarted ? (
                <>
                    <h1 className="text-5xl cursor-pointer select-none">Match with your destination</h1>
                    <Button className="select-none" onClick={() => setIsStarted(true)}>Get Started</Button>
                </>
            ) : (
                <>
                    <div id="question-container" className="w-full h-64 gap-6 flex flex-col place-items-center place-content-center">
                        
                        <p className="text-lg">{quizQuestions[questionKeys[currentQuestionIndex] as keyof typeof quizQuestions]}</p>
                        
                        <div className="flex w-full gap-6 place-content-center">
                        {responses[currentQuestionIndex]?.length > 2 && 
                        <Button className="p-0 m-0 select-none bg-transparent hover:bg-transparent text-primary hover:opacity-80 flex place-self-start" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Back</Button>
                        }
                        <Input 
                            id="response-input" 
                            type="text" 
                            className="w-1/4" 
                            autoComplete="off"
                            value={responses[currentQuestionIndex] || ''}
                            onChange={handleInputChange}
                        />
                        {responses[currentQuestionIndex]?.length > 2 && 
                            <Button className="select-none" onClick={handleNext}>Next</Button>
                        }
                        </div>
                    </div>

                    <button className=" w-5 h-5 absolute bottom-10 right-10 bg-transparent hover:bg-transparent text-primary hover:opacity-80 z-10" onClick={() => setIsStarted(false)}>
                        <House className="absolute bottom-10 right-10 w-5 h-5" />
                    </button>

                    {/* debugging stuff */}
                    {/* <div className="w-full mt-4">
                        <h2 className="text-xl">Saved Responses:</h2>
                        <ul>
                            {responses.map((response, index) => (
                                <li key={index}>{`Question ${index + 1}: ${response}`}</li>
                            ))}
                        </ul>
                    </div> */}
                    {/* debugging stuff end */}
                </>
            )}
        </div>

        {isStarted && currentQuestionIndex === questionKeys.length - 1 &&
        <>
            <Button className="select-none w-max flex place-self-center" onClick={() => setIsStarted(false)}>Find Your Match!</Button>
        </>
        }
        </>
    );
}
