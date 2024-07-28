'use client'

import { useCitySwipe } from "../citySwipeContext";
import { MessageCircleMore } from "lucide-react";
import { MessageCircleHeart } from "lucide-react";
import { House } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import { useRouter } from "next/navigation";
  import { destination } from "../match/_components/destination.api";
  import { DestinationItem } from "@/lib/destination.type";

export default function Sidebar() {

    const { isStarted, setIsStarted } = useCitySwipe();
    const { isChatting, setIsChatting } = useCitySwipe();
    const { isMatching, setIsMatching } = useCitySwipe();
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { clearConversation, setClearConversation } = useCitySwipe();
    const router = useRouter();

    // make globe state for selected city match
    const handleCityMatch = (city: string) => {
        setSelectedMatch?.(city);
        setClearConversation?.(1)
        console.log(clearConversation)
    }

    const handleChatting = () => {
        setIsChatting?.(true);
        setIsMatching?.(false);
    }

    const handleMatching = () => {
        setIsChatting?.(false);
        setIsMatching?.(true);
    }

    
    const reload = () => {
        setTimeout(() => {
            window.location.reload();
        }, 300);
    }

    console.log(destination)

    setInterval(handleChatting, 1000);

    return (
        <div className="w-full h-full" > 
            <div className="w-full flex place-content-end h-[10%] bg-gradient-to-t from-cyan-500 to-green-400 p-5">
                <div className="w-1/2 flex place-content-start place-items-center justify-start h-full gap-5">
                    <Link onClick={reload} href="/">
                        <div className="rounded-full flex place-items-center place-content-center p-2 cursor-pointer bg-white w-10 h-10">
                        {/* avatar/profile will go here */}
                            <House  className="text-primary/50" size={15} />
                        </div>
                    </Link>
                </div>
                <div className="w-1/2 flex place-content-start place-items-center justify-end h-full gap-5">
                        
                        {/* chat icon */}
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="w-max h-max rounded-full p-2 cursor-pointer hover:scale-125">
                                        <MessageCircleMore size={15} onClick={() => handleChatting()} className="text-white"/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                       
                       {/* match icon */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="w-max h-max rounded-full p-2 cursor-pointer hover:scale-125">
                                    <MessageCircleHeart size={15} onClick={() => handleMatching()} className="text-white"/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Match</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                </div>

            </div>


            <p className="p-5">Matches</p>

      {/* mapped destinations */}

      {destination.destinations.map((dest: DestinationItem) => {

        return (
            <>
            <div onClick={() => handleCityMatch(dest.location)} className="w-full hover:bg-slate-300/20 py-9 flex flex-col gap-5 place-items-start p-5">
                <div key={dest.id}>
                    <h3 className="text-2xl font-bold">{dest.location}</h3>
                    <p>Rating: {dest.rating}</p>
                </div>
            </div>
            </>
        );
        })}

            <div>
                {/* matches will go here */}
            </div>

        </div>
    )
}