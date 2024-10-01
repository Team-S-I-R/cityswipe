'use client';

import Sidebar from "../cs-componets/sidebar";
import { useCitySwipe } from "../citySwipeContext"
import { useEffect } from "react"
import quizQuestions from "../quiz-questions/questions";
import SparklesText from "@/components/magicui/sparkles-text";
import { Input } from "@/components/ui/input";
import { updateQuestions } from "../actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteMatch } from "../actions";


export default function SettingsClient({clerkdata, matches, questions}: any) {

    const { userdata, setUserData } = useCitySwipe();
    const { usermatches, setUserMatches }  = useCitySwipe()
    const { userquestions, setUserQuestions }  = useCitySwipe()
    const [responses, setResponses] = useState<{ id: string, value: string }[]>([]);

    const handleInputChange = (index: number, value: string, id: string) => {
        const newResponses = [...responses];
        newResponses[index] = { id, value };

        console.log("index: ", index)
        setResponses(newResponses);
    };

    console.log("userdata: ", userdata);
    console.log("usermatches: ", usermatches);
    console.log("userquestions: ", userquestions);
    
    useEffect(() => {
        setUserQuestions?.(questions);
        setUserData?.(clerkdata);
        setUserMatches?.(matches);
    }, [matches, questions, clerkdata]);
    
        return (
            <>
            <div className="w-full h-[100dvh] flex">

            <div className="flex w-[75px] h-full items-center justify-center">
                <Sidebar clerkdata={userdata} matches={usermatches}/>
            </div>

            <div className="w-full h-full  p-10 flex flex-col gap-5">
                <SparklesText
                    className="text-3xl"
                    colors={{ first: "#22d3ee", second: "#4ade80" }}
                    text={`Settings`}
                />

                <div className="flex w-full gap-8 h-full">

                {/* ANCHOR User Answers */}
                <div className="w-[50%] flex flex-col gap-5 h-full">

                    <div className="flex justify-between place-items-center pb-4 w-full h-max">
                        <div className="w-full flex flex-col gap-1">
                            <p className="font-bold text-xl">My Initial Quiz Answers</p>
                            <p className="text-sm w-[70%] text-muted-foreground">Type in any updated answers you would like and click "Update" to see your changes!</p>
                        </div>
                        <Button className="hover:scale-[95%] text-white px-3 py-1 text-[14px] w-full sm:w-auto bg-gradient-to-t from-cyan-500 to-green-400 select-none" onClick={() => updateQuestions(responses)}>Update</Button>
                    </div>
                    <div className="h-[1px] w-full bg-slate-300"/>
                    <div className="w-full h-[80%] no-scrollbar overflow-y-scroll">
                        <div className="w-full h-max">
                        {userquestions?.map((question: any, index: number) => (
                            <div className="flex flex-col gap-3" key={index}>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[0].question}</p>
                                    <Input
                                        onChange={(e) => handleInputChange(0, e.target.value, question.id)}
                                        placeholder={question.a1}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[1].question}</p>
                                    <Input
                                        onChange={(e) => handleInputChange(1, e.target.value, question.id)}
                                        placeholder={question.a2}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[2].question}</p>
                                    <Input
                                        onChange={(e) => handleInputChange(2, e.target.value, question.id)}
                                        placeholder={question.a3}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[3].question}</p>
                                    <Input
                                        onChange={(e) => handleInputChange(3, e.target.value, question.id)}
                                        placeholder={question.a4}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[4].question}</p>
                                    <Input
                                        onChange={(e) => handleInputChange(4, e.target.value, question.id)}
                                        placeholder={question.a5}
                                    />                            
                                </div>
                            </div>
                        ))}
                        </div>
                    </div> 



                </div>

                <div className="w-[1px] h-full bg-slate-300"/>

                <div className="w-[50%] flex flex-col gap-5 h-full">

                    <p className="font-bold text-xl">Your Matches</p>
                    <div className="h-[1px] w-full bg-slate-300"/>
                    {/* ANCHOR User Matches */}
                    <div className="flex flex-col gap-3">
                            {usermatches?.map((match: any, index: number) => (
                                <div key={index} className="">
                                    <div className="flex w-full justify-between">
                                        <div className="flex">
                                            <p className="font-bold">{match.city}</p>, <span className="w-1"></span> <p>{match.country}</p>
                                        </div>
                                        <Button onClick={() => {deleteMatch(match.id)}} className="text-red-400 bg-transparent hover:bg-red-400 hover:text-white">Delete</Button>  
                                    </div>
                                </div>
                            ))}  
                    </div> 

                </div>

                </div>


            </div>
            

            </div>
            </>
        );

}