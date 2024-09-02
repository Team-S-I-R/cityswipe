'use client'

import { useCitySwipe } from "../citySwipeContext";
import { ChevronDown, Home, MessageCircleMore, Settings } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"
import placeholderimg from '../assets/imgs/white.png'



export default function Sidebar( {clerkdata} : any) {

    const { isStarted, setIsStarted } = useCitySwipe();
    const { isChatting, setIsChatting } = useCitySwipe();
    const { isMatching, setIsMatching } = useCitySwipe();
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { isSidebarOpen, setIsSidebarOpen } = useCitySwipe();
    const { clearConversation, setClearConversation } = useCitySwipe();
    const { photoUrl, setPhotoUrl } = useCitySwipe();
    const { chatImg, setChatImg } = useCitySwipe();
    const { firstMatch, setFirstMatch } = useCitySwipe();
    useEffect(() => {
        setSelectedMatch?.(selectedMatch?.split(',')[0] as string)
        setChatImg?.(savedDestination?.destinations[0]?.illustration as string)
        console.log(selectedMatch)
        console.log(savedDestination)
    }, [selectedMatch, savedDestination])
    
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

    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "-100%" },
    }

    
    return (

        <>
        
        {/* desktop */}
        <div className="w-full h-full bg-gray-100 px-3 py-1 hidden md:flex flex-col justify-between" > 
        
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
                            <Image className="rounded-full h-full  w-full object-cover" src={chatImg || placeholderimg} alt="" />
                        </div> 

                        {selectedMatch == '' ? (
                            <p className="select-none"><strong>{savedDestination.destinations[0]?.city}</strong></p>
                        ) : (
                            <p className="select-none"><strong>{selectedMatch}</strong></p>
                        )}

                    </div>



                </div>

                <p className="px-4 text-muted-foreground font-bold">All Matches</p>

                {/* mapped destinations */}
                <div className="w-full h-[50%]  no-scrollbar overflow-y-scroll">

                    {savedDestination.destinations.map((dest: DestinationItem) => {
                        return (
                            <>
                            <div onClick={() => handleCityMatch(dest.city, dest.illustration ?? '')} className="w-full relative h-max select-none hover:bg-gray-200 px-4 py-1 rounded-xl hover:scale-[102%] flex flex-col gap-[15px] overflow-hidden place-items-start">
                                <div className="w-full  h-max cursor-pointer relative flex flex-col place-items-start place-content-center" 
                                // style={{ backgroundImage: `url(${dest.illustration})`, backgroundRepeat: 'no-repeat', backgroundSize: 'fill', backgroundPosition: 'center' }}
                                key={dest.id}>
                                    <div className="w-full mr-3 flex gap-1 place-items-center place-content-center justify-between">
                                        
                                        <div className="w-max flex gap-2 place-items-center place-content-center">
                                            <div className="w-[30px] h-[30px] rounded-full flex place-items-end place-content-end">
                                                {/* <div className="absolute z-[-1] bg-gradient-to-r from-white via-white to-transparent w-full h-full"></div> */}
                                                <Image className="rounded-full h-full  w-full object-cover" src={dest.illustration} alt="" />
                                            </div>
                                            <h3 className="text-[14px] p-2 rounded-full w-max">{dest.city}</h3>
                                        </div>

                                        <p className="text-[10px] p-2 flex flex-col rounded-full font-bold w-max h-max">
                                            <span className="text-green-500 text-[15px]">{dest.compatibility}% </span>
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

                <p className="px-4 flex w-full place-content-start text-[10px] text-muted-foreground font-bold">Cityswipe</p>

            </div>

        </div> 

        {/* mobile */}
        <div className="w-[50px] z-[100] relative h-full bg-gray-100 py-3 flex md:hidden flex-col place-items-center place-content justify-between" > 

            <div className="cursor-pointer" onMouseEnter={() => setIsSidebarOpen?.(!isSidebarOpen)}>
                {isSidebarOpen ? <ChevronDown className="rotate-90"/> : <ChevronDown className="-rotate-90"/> }
            </div>

            {/* settings stuff / upgrade stuff maybe */}
            <div className="w-max  h-max my-6  flex flex-col gap-6">

                <Link href="/">
                
                <div className="px-1 cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                    <Home size={18}/>
                </div>

                </Link>

                <div className="px-1 cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                    <Settings size={18}/>
                </div>

                       {/* user stuff */}
                <div className="w-full h-max">

                    <div className="w-full flex h-max">
                        <div className="w-full flex place-content-start place-items-center justify-start h-full gap-5">
                            <UserButton/>
                        </div>
                    </div>

                </div>                              

            </div>

            {/* more mobile  */}
            <AnimatePresence mode="wait">
                
            <motion.div 
            initial="closed"
            animate={isSidebarOpen ? "open" : "closed"}
            variants={variants}
            className="w-[calc(100vw-150px)] flex flex-col justify-between py-8 bg-gray-100 px-3 h-screen absolute z-[-1] top-0 left-[45px]">

                <div className="flex z-10 flex-col  gap-3">
                    

                    <div className="w-full h-max flex flex-col">
                        
                        <p className="px-2 text-muted-foreground font-bold">Selected Match</p>
                        
                        <div className="bg-gray-200 place-items-center px-4 mt-3 w-full flex gap-8 relative h-max select-none py-4 rounded-xl overflow-hidden place-items-start" >
                            
                            <div className="w-[30px] h-[30px] rounded-full flex place-items-end place-content-end">
                                <Image className="rounded-full h-full  w-full object-cover" src={chatImg || placeholderimg} alt="" />
                            </div> 

                            {selectedMatch == '' ? (
                                <p className="select-none"><strong>{savedDestination.destinations[0]?.city}</strong></p>
                            ) : (
                                <p className="select-none"><strong>{selectedMatch}</strong></p>
                            )}

                        </div>

                    </div>

                    <p className="px-4 text-muted-foreground font-bold">All Matches</p>

                    <div className="w-full h-[50%]  no-scrollbar overflow-y-scroll">

                        {savedDestination.destinations.map((dest: DestinationItem) => {
                            return (
                                <>
                                <div onClick={() => handleCityMatch(dest.city, dest.illustration ?? '')} className="w-full relative h-max select-none hover:bg-gray-200 px-4 py-1 rounded-xl hover:scale-[102%] flex flex-col gap-[15px] overflow-hidden place-items-start">
                                    <div className="w-full  h-max cursor-pointer relative flex flex-col place-items-start place-content-center" 
                                    // style={{ backgroundImage: `url(${dest.illustration})`, backgroundRepeat: 'no-repeat', backgroundSize: 'fill', backgroundPosition: 'center' }}
                                    key={dest.id}>
                                        <div className="w-full mr-3 flex gap-1 place-items-center place-content-center justify-between">
                                            
                                            <div className="w-max flex gap-2 place-items-center place-content-center">
                                                <div className="w-[30px] h-[30px] rounded-full flex place-items-end place-content-end">
                                                    <Image className="rounded-full h-full  w-full object-cover" src={dest.illustration} alt="" />
                                                </div>
                                                <h3 className="text-[14px] p-2 rounded-full w-max">{dest.city}</h3>
                                            </div>

                                            <p className="text-[10px] p-2 flex flex-col rounded-full font-bold w-max h-max">
                                                <span className="text-green-500 text-[15px]">{dest.compatibility}% </span>
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

                <p className="px-4 flex w-full place-content-center text-[10px] text-muted-foreground font-bold">Cityswipe</p>

            </motion.div>

            </AnimatePresence>

        </div> 



        </>

        
    )
}
