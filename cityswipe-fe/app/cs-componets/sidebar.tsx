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
    const { chatImg, setChatImg } = useCitySwipe();
    const { firstMatch, setFirstMatch } = useCitySwipe();
    const router = useRouter();

    const extractMatchInfo = (matchString: string) => {
        const cityAndCountry = matchString;
        // const ratingPercentage = parseInt(rating.replace('%', ''));
        return { cityAndCountry };
    };

    const handleSetChatAvatar = (img: string) => {
        setChatImg?.(img);
    }

    // make globe state for selected city match
    const handleCityMatch = (city: string, img: string) => {
        setSelectedMatch?.(city);
        handleSetChatAvatar(img);
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

    console.log(destination.destinations[0]?.illustration)


    
    return (
        <div className="w-full h-full flex flex-col gap-6" > 
        
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
                        <div onClick={() => handleCityMatch(cityAndCountry, dest.illustration ?? '')} className="w-full h-max flex flex-col gap-[15px] overflow-hidden place-items-start">
                            <div className="w-full h-[110px] cursor-pointer relative flex flex-col place-items-start place-content-center" 
                            // style={{ backgroundImage: `url(${dest.illustration})`, backgroundRepeat: 'no-repeat', backgroundSize: 'fill', backgroundPosition: 'center' }}
                            key={dest.id}>
                                <div className="absolute w-full h-full flex place-items-end place-content-end">
                                    {/* <div className="absolute z-[-1] bg-gradient-to-r from-white via-white to-transparent w-full h-full"></div> */}
                                    <img className="relative z-[-2] w-1/2 inset-0 h-full w-full object-cover z-[-1]" src={dest.illustration} alt="" />
                                </div>
                                <div className="p-5 text-white">
                                    <h3 className="text-md font-bold">{cityAndCountry}</h3>
                                    <p className="text-sm">Rating: {dest.rating}%</p>
                                </div>
                            </div>
                        </div>
                        </>
                    );
                })}

            </div>

        </div> 
    )
}