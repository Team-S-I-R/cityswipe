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
import { useEffect } from "react";

export default function Sidebar() {

    const { isStarted, setIsStarted } = useCitySwipe();
    const { isChatting, setIsChatting } = useCitySwipe();
    const { isMatching, setIsMatching } = useCitySwipe();
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { clearConversation, setClearConversation } = useCitySwipe();
    const { photoUrl, setPhotoUrl } = useCitySwipe();
    const { firstMatch, setFirstMatch } = useCitySwipe();
    const router = useRouter();

    const extractMatchInfo = (matchString: string) => {
        const cityAndCountry = matchString;
        // const ratingPercentage = parseInt(rating.replace('%', ''));
        return { cityAndCountry };
    };

    // make globe state for selected city match
    const handleCityMatch = (city: string) => {
        setSelectedMatch?.(city);
        setClearConversation?.(1)
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

    useEffect(() => {
        console.log('photoUrl',photoUrl)
    }, [photoUrl])
    
    return (
        <div className="w-full h-full" > 
        
            <div className="w-full h-[15%]">

            <div className="w-full flex place-content-end h-max bg-gradient-to-t from-cyan-500 to-green-400 p-5">
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

            </div>


            {/* mapped destinations */}

            <div className="w-full h-[80%] no-scrollbar overflow-y-scroll">

            {destination.destinations.map((dest: DestinationItem) => {
                const { cityAndCountry } = extractMatchInfo(dest.location);
                return (
                    <>
                    <div onClick={() => handleCityMatch(cityAndCountry)} className="w-full hover:bg-slate-300/20 py-9 flex flex-col gap-5 place-items-start p-5">
                        <div className="w-full flex flex-col" style={{ backgroundImage: dest.img }} key={dest.id}>
                            <h3 className="text-2xl font-bold">{cityAndCountry}</h3>
                            <p>Rating: {dest.rating}%</p>
                        </div>
                    </div>
                    </>
                );
            })}

            </div>

        </div> 
    )
}