'use client'

import { useCitySwipe } from "../citySwipeContext";
import { MessageCircleMore } from "lucide-react";
import { MessageCircleHeart } from "lucide-react";

export default function Sidebar() {

    const { isStarted, setIsStarted } = useCitySwipe();
    const { isChatting, setIsChatting } = useCitySwipe();
    const { isMatching, setIsMatching } = useCitySwipe();

    const handleChatting = () => {
        setIsChatting?.(true);
        setIsMatching?.(false);
    }

    const handleMatching = () => {
        setIsChatting?.(false);
        setIsMatching?.(true);
    }

    return (
        <div className="w-full h-full" >
            <div className="w-full flex place-content-end h-[15%] bg-gradient-to-t from-cyan-500 to-green-400 p-5">
                
                <div className="w-1/2 flex place-content-start place-items-center justify-evenly h-full gap-5">
                    <div className="w-max h-max rounded-full border-2 border-white cursor-pointer hover:scale-105">
                        <MessageCircleMore size={50} onClick={() => handleChatting()} className="text-white"/>
                    </div>
                    <div className="w-max h-max rounded-full border-2 border-white cursor-pointer hover:scale-105">
                        <MessageCircleHeart size={50} onClick={() => handleMatching()} className="text-white"/>
                    </div>
                </div>

            </div>
            <p>Sidebar</p>
        </div>
    )
}