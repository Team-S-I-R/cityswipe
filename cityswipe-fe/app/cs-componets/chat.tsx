'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useCitySwipe } from "../citySwipeContext";
import Image from "next/image"
import { useState } from "react";
import { streamConversation, getConversationHistory, Message, streamFlirtatiousConversation } from "../actions";
import { useEffect } from "react";
import { readStreamableValue } from "ai/rsc";
import { ArrowUp } from "lucide-react";
import { savedDestination } from "../../api/savedDestination.api";
import { DestinationItem } from "@/lib/destination.type";
import placeholderimg from '../assets/imgs/white.png'
export default function Chat({matches}: any) {

    const [conversation, setConversation] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { clearConversation, setClearConversation } = useCitySwipe();
    const { usermatches, setUserMatches } = useCitySwipe();
    const {chatImg, setChatImg} = useCitySwipe();

    useEffect(() => {
        if (clearConversation && clearConversation > 0) {
            setConversation([]);
            setClearConversation?.(0);
        }
    });


    // useEffect(() => {
    //     setUserMatches?.(matches)
    // }, [matches])
    

    const startChat = async () => {
        const split = selectedMatch?.split(' ')
        const { messages, newMessage } = await streamFlirtatiousConversation(split==undefined ? "": split[0], split==undefined ? "": split[1], [
            ...conversation,
            { role: "user", content: input },
        ]);

        let textContent = "";

        for await (const delta of readStreamableValue(newMessage)) {
            textContent = `${textContent}${delta}`;

            setConversation([
                ...messages,
                { role: "assistant", content: textContent },
            ]);
        }


        setInput(""); // Clear the input field after submitting
    }
    
    
    // import saved global state city

    return (

        <>
        
        <div className="relative hidden sm:flex text-[14px] flex-col place-content-center place-items-center w-full h-full">
            <div className="absolute border-b border-primary/20 top-0 w-full h-[6%] flex justify-between place-items-center px-5">
                
                {selectedMatch == '' ? (
                    <h2 className="select-none">You have matched with <strong>{usermatches?.[0]?.city}</strong>!</h2>
                ) : (
                    <h2 className="select-none">You matched with <strong>{selectedMatch}</strong>!</h2>
                )}
            </div>



            {conversation.length < 1 && (
                <>

                    <div className="flex flex-col select-none gap-2 place-items-center">

                        <div className="w-[80px] h-[80px] rounded-full">
                            <Image className="object-cover w-full h-full rounded-full" src={chatImg || placeholderimg} sizes="100%" width={30} height={30} alt="" />
                        </div>

                        {selectedMatch == '' ? (
                            <>
                            <p className="text-center">You matched with <strong>{usermatches?.[0]?.city}</strong>!</p>
                            <p className="text-center">Ask {usermatches?.[0]?.city} anything you would like to know</p>
                            </>
                        ) : (    
                            <>
                            <p className="text-center">You matched with <strong>{selectedMatch}</strong>!</p>
                            <p className="text-center">Ask {selectedMatch} anything you would like to know</p>
                            </>
                        )}

                    </div>
                    
                </>
            )}
  


            {conversation.length > 0 && (
                <>
                    <div id="chat-container" className=" flex flex-col place-items-center h-[80vh] overflow-y-scroll ">
                        {conversation.map((message, index) => (
                            <div className={`w-[90%] m-2 rounded-md p-2  ${message.role === 'user' ? 'bg-cyan-300' : 'bg-green-300'}`} key={index}>
                                <span className="font-bold">
                                    {message.role}:
                                </span>
                                <span> </span>
                                <span>
                                     {message.content}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="absolute  flex justify-center px-5 gap-3 place-items-center bottom-0 w-full h-[9vh]">
            <div className=" py-1 flex gap-4 outline outline-primary/10 rounded-lg  px-4 w-[70%]">
                <Input
                value={input}
                onChange={(event) => {
                    setInput(event.target.value);
                }}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                    startChat();
                    }
                }}
                className="outline-none border-0 focus:ring-0 focus-visible:ring-0 h-[35px]"
                autoFocus
                />
            <button
                className="scale-[80%] hover:scale-[95%] bg-gradient-to-t from-cyan-500 to-green-400 p-2 rounded-full"
                onClick={() => startChat()}
            >
                <ArrowUp className="text-white" size={20} />
            </button>

            </div>

            </div>
        </div>

        {/*  mobile */}
        <div className="relative text-[12px] flex sm:hidden  flex-col place-content-center place-items-center w-full h-full">
           
            <div className="absolute border-b border-primary/20 top-0 w-full h-[6%] flex place-content-center place-items-center px-5">
                
                {selectedMatch == '' ? (
                    <h2 className="select-none">You have matched with <strong>{usermatches?.[0]?.city}</strong>!</h2>
                ) : (
                    <h2 className="select-none">You matched with <strong>{selectedMatch}</strong>!</h2>
                )}
            </div>



            {conversation.length < 1 && (
                <>

                    <div className="flex flex-col select-none gap-2 place-items-center">

                        <div className="w-[80px] h-[80px] rounded-full">
                            <Image className="object-cover w-full h-full rounded-full" src={chatImg || placeholderimg} sizes="100%" width={30} height={30} alt="" />
                        </div>

                        {selectedMatch == '' ? (
                            <>
                            <p className="text-center">You matched with <strong>{savedDestination.destinations[0]?.city}</strong>!</p>
                            <p className="text-center">Ask {usermatches?.[0]?.city} anything you would like to know</p>
                            </>
                        ) : (    
                            <>
                            <p className="text-center">You matched with <strong>{selectedMatch}</strong>!</p>
                            <p className="text-center">Ask {selectedMatch} anything you would like to know</p>
                            </>
                        )}

                    </div>
                    
                </>
            )}
  


            {conversation.length > 0 && (
                <>
                    <div id="chat-container" className=" flex flex-col place-items-center h-[80vh] overflow-y-scroll ">
                        {conversation.map((message, index) => (
                            <div className={`w-[90%] m-2 rounded-md p-2  ${message.role === 'user' ? 'bg-cyan-300' : 'bg-green-300'}`} key={index}>
                                <span className="font-bold">
                                    {message.role}:
                                </span>
                                <span> </span>
                                <span>
                                     {message.content}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="absolute  flex justify-center px-5 gap-3 place-items-center bottom-0 w-full h-[9vh]">
            <div className=" py-1 flex gap-4 outline outline-primary/10 rounded-lg  px-4 w-full">
                <Input
                value={input}
                onChange={(event) => {
                    setInput(event.target.value);
                }}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                    startChat();
                    }
                }}
                className="outline-none border-0 focus:ring-0 focus-visible:ring-0 h-[35px]"
                autoFocus
                />
            <button
                className="scale-[80%] hover:scale-[95%] bg-gradient-to-t from-cyan-500 to-green-400 p-2 rounded-full"
                onClick={() => startChat()}
            >
                <ArrowUp className="text-white" size={20} />
            </button>

            </div>

            </div>
        </div>
        </>

        
    )
}