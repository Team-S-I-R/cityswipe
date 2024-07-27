'use client'

import { Button } from "@/components/ui/button";
import { useCitySwipe } from './citySwipeContext';
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import quizQuestions from "./quiz-questions/questions";
import { House } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import destination1 from './assets/imgs/destination-img-1.jpg'
import destination2 from './assets/imgs/destination-img-2.jpg'
import destination3 from './assets/imgs/destination-img-3.jpg'
import destination4 from './assets/imgs/destination-img-4.jpg'
import { Heart } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const { isStarted, setIsStarted } = useCitySwipe();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<string[]>([]);
    const questionKeys = Object.keys(quizQuestions);
    const [updateHeart, setUpdateHeart] = useState(false);

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
        console.log(responses);
    };

    const handleHomeFunction = () => {
        setCurrentQuestionIndex(0);
        setIsStarted(false);
        setResponses([]);
    }


    // animations    


    const hoverAnimationEnter = (imgid : string) => {
        let id = '#' + imgid + '-img'

        if (imgid != '') {
            gsap.to(id, {
                opacity: 1,
                duration: 0.5,
            });
        } 

        setUpdateHeart(true)

    }

    const hoverAnimationLeave = (imgid : string) => {
        let id = '#' + imgid + '-img'
        if (imgid != '') {
            gsap.to(id, {
                opacity: 0,
                duration: 0.5,
            });
        } 

        setUpdateHeart(false)
    }
  

    return (
        <>
        
        
        <div className="flex flex-col w-full place-items-center gap-6">
            {!isStarted ? (
                <>
  
                    <div className="z-[-1] top-0 left-0 w-screen h-screen absolute">
                    <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="match-img" className="opacity-0  w-full h-full object-cover" src={destination1.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="with-img" className="opacity-0  w-full h-full object-cover" src={destination2.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="your-img" className="opacity-0  w-full h-full object-cover" src={destination3.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="destination-img" className="opacity-0  w-full h-full object-cover" src={destination4.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                    </div>   

                    <h2>Like Tinder, but for your vacations!</h2>                 
                   
                    <h1 className="text-5xl select-none relative">
                        <span id="match" onMouseOver={() => hoverAnimationEnter('match')} onMouseLeave={() => hoverAnimationLeave('match')} className="cursor-pointer">Match </span>
                        <span id="with" onMouseOver={() => hoverAnimationEnter('with')} onMouseLeave={() => hoverAnimationLeave('with')} className="cursor-pointer">with </span>
                        <span id="your" onMouseOver={() => hoverAnimationEnter('your')} onMouseLeave={() => hoverAnimationLeave('your')} className="cursor-pointer">your </span>
                        <span id="destination" onMouseOver={() => hoverAnimationEnter('destination')} onMouseLeave={() => hoverAnimationLeave('destination')} className="cursor-pointer">destination</span> 
                    </h1>
                    <Button className="select-none bg-gradient-to-t from-cyan-500 to-green-400 flex place-items-center gap-2" onClick={() => setIsStarted(true)}>
                        Get Started 
                        {updateHeart == false && <span><Heart className="w-2 h-2  "/></span>}
                        {updateHeart == true && <span><Heart className="w-2 h-2 text-red-300 animate-pulse"/></span>}
                    </Button>
                </>
            ) : (
                <>
                    <div id="question-container" className="w-full h-64 gap-6 flex flex-col place-items-center place-content-center">
                        
                        <p className="text-xl">{quizQuestions[questionKeys[currentQuestionIndex] as keyof typeof quizQuestions]}</p>
                        
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
                            <Button className="bg-gradient-to-t from-cyan-500 to-green-400  select-none" onClick={handleNext}>Next</Button>
                        }
                        </div>
                    </div>

                    <button className=" w-5 h-5 absolute bottom-10 right-10 bg-transparent hover:bg-transparent text-primary hover:opacity-80 z-10" onClick={() => handleHomeFunction()}>
                        <House className="absolute bottom-10 right-10 w-5 h-5" />
                    </button>

                    {isStarted && currentQuestionIndex === questionKeys.length - 1 &&
                    <>
                        <Link className="flex place-self-center" href="/explore">
                            <Button className="bg-gradient-to-t from-cyan-500 to-green-400 select-none w-max">Find Your Match!</Button>
                        </Link>
                    </>
                    }
                    
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
 

        </>
    );
}
