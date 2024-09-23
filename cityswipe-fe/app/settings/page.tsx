'use client';

import Sidebar from "../cs-componets/sidebar";
import { useCitySwipe } from "../citySwipeContext"
import { useEffect } from "react"
import quizQuestions from "../quiz-questions/questions";
import SparklesText from "@/components/magicui/sparkles-text";
import { Input } from "@/components/ui/input";
import { updateQuestions } from "../actions";


export default function SettingsClient({clerkdata, matches, questions}: any) {

    const { userdata, setUserData } = useCitySwipe();
    const { usermatches, setUserMatches }  = useCitySwipe()
    const { userquestions, setUserQuestions }  = useCitySwipe()

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

            <div className="w-full h-full overflow-y-scroll  p-10 flex flex-col gap-5">
                <SparklesText
                    className="text-3xl"
                    colors={{ first: "#22d3ee", second: "#4ade80" }}
                    text={`Settings`}
                />

                <div className="flex w-full gap-8 h-full">

                {/* ANCHOR User Answers */}
                <div className="w-[50%] flex flex-col gap-5 h-full">

                    <div className="flex justify-between w-full h-max">
                    <p className="font-bold">My Initial Quiz Answers</p>
                    <button onClick={() => updateQuestions(userquestions)}>Update</button>
                    </div>
                    <div className="w-full h-full no-scrollbar overflow-y-scroll">
                        <div className="w-full h-max">
                        {userquestions?.map((question: any, index: number) => (
                            <div className="flex flex-col gap-3" key={index}>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[0].question}</p>
                                    <Input
                                        value={question.a1}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[1].question}</p>
                                    <Input
                                        value={question.a2}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[2].question}</p>
                                    <Input
                                        value={question.a3}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[3].question}</p>
                                    <Input
                                        value={question.a4}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[4].question}</p>
                                    <Input
                                        value={question.a5}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[5].question}</p>
                                    <Input
                                        value={question.a6}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold select-none">{quizQuestions[6].question}</p>
                                    <Input
                                        value={question.a7}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold">{quizQuestions[7].question}</p>
                                    <Input
                                        value={question.a8}
                                    />                            
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold">{quizQuestions[8].question}</p>
                                    <Input
                                        value={question.a9}
                                    />                            
                                </div>
                            </div>
                        ))}
                        </div>
                    </div> 


                </div>

                <div className="w-[50%] flex flex-col gap-5 h-full">

                    <p className="font-bold">Your Matches</p>
                    {/* ANCHOR User Matches */}
                    <div className="flex flex-col gap-3">
                        {usermatches?.map((match: any, index: number) => (
                            <div key={index} className="flex gap-1">
                                <p>{match.city}</p>, <p>{match.country}</p>
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