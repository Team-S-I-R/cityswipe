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

    useEffect(() => {
        if (clearConversation && clearConversation > 0) {
            setConversation([]);
            setClearConversation?.(0);
        }
    });

    useEffect(() => {
        setSelectedMatch?.(destination.destinations[0]?.location as string)
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
    
    console.log(selectedMatch)
    
    // import saved global state city

    return (
        <div className="relative flex flex-col place-content-center place-items-center w-full h-full">
            <div className="absolute border-b border-primary/20 top-0 w-full h-[10%] flex justify-between place-items-center px-5">
                {selectedMatch == '' ? (
                    <h2 className="select-none">You have matched with <strong>{destination.destinations[0]?.location}</strong>!</h2>
                ) : (
                    <h2 className="select-none">You have matched with <strong>{selectedMatch}</strong>!</h2>
                )}
                <Button  className="bg-transparent hover:bg-transparent text-primary/70"><X size={20} /></Button>
            </div>



            {conversation.length < 1 && (
                <>
                    <p className="text-center">You have matched with <strong>{selectedMatch}</strong>!</p>
                    <p className="text-center">Ask {selectedMatch} anything you would like to know</p>
                    
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

            <div className="absolute border-t border-primary/20 flex justify-between px-5 gap-3 place-items-center bottom-0 w-full h-[10vh]">
            <div className="p-2 px-4 w-full">
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
                className="outline outline-primary/20"
                autoFocus
                />
            </div>

            <button
                className="bg-gradient-to-t from-cyan-500 to-green-400 p-2 rounded-full"
                onClick={() => startChat()}
            >
                <ArrowUp size={20} />
            </button>
            </div>
        </div>
    )
}