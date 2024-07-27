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
            <div className="w-full flex place-content-end h-[10%] bg-gradient-to-t from-cyan-500 to-green-400 p-5">
                <div className="w-1/2 flex place-content-start place-items-center justify-start h-full gap-5">
                    <div className="rounded-full p-2 cursor-pointer bg-white w-10 h-10"></div>
                </div>
                <div className="w-1/2 flex place-content-start place-items-center justify-end h-full gap-5">
                    <div className="w-max h-max rounded-full p-2 cursor-pointer hover:scale-125">
                        <MessageCircleMore size={15} onClick={() => handleChatting()} className="text-white"/>
                    </div>
                    <div className="w-max h-max rounded-full p-2 cursor-pointer hover:scale-125">
                        <MessageCircleHeart size={15} onClick={() => handleMatching()} className="text-white"/>
                    </div>
                </div>

            </div>


            <p className="p-5">Matches</p>

            <div>
                {/* matches will go here */}
            </div>

        </div>
    )
}