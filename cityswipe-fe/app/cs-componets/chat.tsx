'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useCitySwipe } from "../citySwipeContext";
import { useState } from "react";
import { streamConversation, getConversationHistory, Message, streamFlirtatiousConversation } from "../actions";
import { useEffect } from "react";
import { readStreamableValue } from "ai/rsc";
import { ArrowUp } from "lucide-react";
import { destination } from "../match/_components/destination.api";
import { DestinationItem } from "@/lib/destination.type";
export default function Chat() {

    const [conversation, setConversation] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { clearConversation, setClearConversation } = useCitySwipe();
    const { firstMatch, setFirstMatch } = useCitySwipe();
    const {chatImg, setChatImg} = useCitySwipe();

    useEffect(() => {
        if (clearConversation && clearConversation > 0) {
            setConversation([]);
            setClearConversation?.(0);
        }
    });

    useEffect(() => {
        setSelectedMatch?.(selectedMatch?.split(',')[0] as string)
        console.log(selectedMatch)
    }, [selectedMatch])

    

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
        <div className="relative flex text-[15px] flex-col place-content-center place-items-center w-full h-full">
            <div className="absolute border-b border-primary/20 top-0 w-full h-[6%] flex justify-between place-items-center px-5">
                
                {selectedMatch == '' ? (
                    <h2 className="select-none">You matched with <strong>{destination.destinations[0]?.location}</strong>!</h2>
                ) : (
                    <h2 className="select-none">You matched with <strong>{selectedMatch}</strong>!</h2>
                )}
            </div>



            {conversation.length < 1 && (
                <>

                    <div className="flex flex-col gap-2 place-items-center">

                        <div className="w-[80px] h-[80px] rounded-full">
                            <img className="object-cover w-full h-full rounded-full" src={chatImg} alt="" />
                        </div>
                        <p className="text-center">You matched with <strong>{selectedMatch}</strong>!</p>
                        <p className="text-center">Ask {selectedMatch} anything you would like to know</p>

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

            <div className="absolute border-t border-primary/20 flex justify-center px-5 gap-3 place-items-center bottom-0 w-full h-[7vh]">
            <div className="p-2 px-4 w-[70%]">
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
                className="outline h-[25px] outline-primary/20"
                autoFocus
                />
            </div>

            <button
                className="bg-gradient-to-t from-cyan-500 to-green-400 p-2 rounded-full"
                onClick={() => startChat()}
            >
                <ArrowUp className="text-white" size={20} />
            </button>
            </div>
        </div>
    )
}