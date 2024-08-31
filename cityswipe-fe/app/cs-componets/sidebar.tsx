'use client'

import { useCitySwipe } from "../citySwipeContext";
import { Home, MessageCircleMore, Settings } from "lucide-react";
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
import { UserButton } from "@clerk/nextjs";

export default function Sidebar( {clerkdata} : any) {

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

    
    return (
        <div className="w-full h-full bg-gray-100 px-3 py-1 flex flex-col justify-between" > 
        
            <div className="flex flex-col w-full h-[70%]  gap-3">
            
                {/* user stuff */}
                <div className="w-full h-max">

                    <div className="w-full flex h-[60px]">
                    {/* <div className="w-full flex h-[60px] bg-gradient-to-t from-cyan-500 to-green-400 p-3"> */}
                        <div className="w-full flex place-content-start place-items-center justify-start h-full gap-5">
                            <UserButton/>
                            <div>
                                <p className="text-[14px] font-bold">{clerkdata?.name}</p>
                                <p className="text-[12px] text-muted-foreground">@{clerkdata?.username}</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* selected */}
                <div className="w-full h-max flex flex-col">
                    <p className="px-2 text-muted-foreground font-bold">Selected Match</p>
                    <div className="bg-gray-200 place-items-center px-4 mt-3 w-full flex gap-8 relative h-max select-none py-4 rounded-xl overflow-hidden place-items-start" >
                        <div className="w-[30px] h-[30px] rounded-full flex place-items-end place-content-end">
                            <img className="rounded-full h-full  w-full object-cover" src={chatImg} alt="" />
                        </div> 
                        <p className="text-[14px] font-bold">{selectedMatch}</p>

                    </div>
                </div>

                <p className="px-4 text-muted-foreground font-bold">All Matches</p>

                {/* mapped destinations */}
                <div className="w-full h-[50%]  no-scrollbar overflow-y-scroll">

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

            {/* settings stuff / upgrade stuff maybe */}
            <div className="w-full  h-max my-6  flex flex-col gap-6">

                <Link href="/">
                
                <div className="px-4 cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                    <Home size={18}/>
                    <p className="font-bold">Home</p>
                </div>

                </Link>

                <div className="px-4 cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                    <Settings size={18}/>
                    <p className="font-bold">Settings</p>
                </div>

            </div>

        </div> 
    )
}