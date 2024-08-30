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
  import { savedDestination } from "../../api/savedDestination.api";
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

    console.log(savedDestination.destinations[0]?.illustration)


    
    return (
        <div className="w-full h-full bg-gray-100 p-5 flex flex-col gap-6" > 
        
            <div className="w-full h-[10%]">

                <div className="w-full flex h-[60px]">
                {/* <div className="w-full flex h-[60px] bg-gradient-to-t from-cyan-500 to-green-400 p-3"> */}
                    <div className="w-1/2 flex place-content-start place-items-center justify-start h-full gap-5">
                        <Link onClick={reload} href="/">
                            <div className="rounded-full flex place-items-center place-content-center p-2 cursor-pointer bg-white w-10 h-10">
                            {/* avatar/profile will go here */}
                                <House  className="text-primary/50" size={15} />
                            </div>
                        </Link>
                    </div>

                    {/* <div className="w-1/2 flex place-content-start place-items-center justify-end h-full gap-5">
                            
        
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
                    </div> */}

                </div>

                <p className="py-4 text-muted-foreground font-bold">Matches</p>

            </div>


            {/* mapped destinations */}

            <div className="w-full h-full  no-scrollbar overflow-y-scroll">

                {savedDestination.destinations.map((dest: DestinationItem) => {
                    const { cityAndCountry } = extractMatchInfo(dest.location);
                    return (
                        <>
                        <div onClick={() => handleCityMatch(cityAndCountry, dest.illustration ?? '')} className="w-full relative h-max select-none hover:bg-gray-200 px-4 py-1 rounded-xl hover:scale-[102%] flex flex-col gap-[15px] overflow-hidden place-items-start">
                            <div className="w-full  h-max cursor-pointer relative flex flex-col place-items-start place-content-center" 
                            // style={{ backgroundImage: `url(${dest.illustration})`, backgroundRepeat: 'no-repeat', backgroundSize: 'fill', backgroundPosition: 'center' }}
                            key={dest.id}>
                                <div className="w-full mr-3 flex gap-1 place-items-center place-content-center justify-between">
                                    
                                    <div className="w-max flex gap-2 place-items-center place-content-center">
                                        <div className="w-[30px] h-[30px] rounded-full flex place-items-end place-content-end">
                                            {/* <div className="absolute z-[-1] bg-gradient-to-r from-white via-white to-transparent w-full h-full"></div> */}
                                            <img className="rounded-full h-full  w-full object-cover" src={dest.illustration} alt="" />
                                        </div>
                                        <h3 className="text-[14px] p-2 rounded-full w-max">{cityAndCountry.split(',')[0]}</h3>
                                    </div>

                                    <p className="text-[10px] p-2 flex flex-col rounded-full font-bold w-max h-max">
                                        <span className="text-green-500 text-[15px]">{dest.rating}% </span>
                                        Match!
                                    </p>
            
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