'use client'

import { useCitySwipe } from "../citySwipeContext";
import { ChevronDown, CreditCard, EllipsisVertical, Home, MessageCircle, MessageCircleMore, PanelLeft, PanelRight, Settings } from "lucide-react";
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
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"
import placeholderimg from '../assets/imgs/white.png'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { deleteMatch } from "../actions";
import { useFormStatus } from "react-dom";


export default function Sidebar( {clerkdata, matches} : any,) {

    const { isStarted, setIsStarted } = useCitySwipe();
    const { isChatting, setIsChatting } = useCitySwipe();
    const { isMatching, setIsMatching } = useCitySwipe();
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { selectedPros, setSelectedPros } = useCitySwipe();
    const { selectedCons, setSelectedCons } = useCitySwipe();
    const { selectedCompatibility, setSelectedCompatibility } = useCitySwipe();
    const { selectedBio, setSelectedBio } = useCitySwipe();
    const { isSidebarOpen, setIsSidebarOpen } = useCitySwipe();
    const { isItineraryModalOpen, setIsItineraryModalOpen } = useCitySwipe();
    const { clearConversation, setClearConversation } = useCitySwipe();
    const { photoUrl, setPhotoUrl } = useCitySwipe();
    const { chatImg, setChatImg } = useCitySwipe();
    const { usermatches, setUserMatches } = useCitySwipe();
    const [avatar, setAvatar] = useState<string>('');
    const {currentPath, setCurrentPath} = useCitySwipe();


    useEffect(() => {
        setChatImg?.(usermatches?.[0]?.illustration);
        setSelectedMatch?.(usermatches?.[0]?.city as string);
        setSelectedCompatibility?.(usermatches?.[0]?.compatibility as number);
        setSelectedBio?.(usermatches?.[0]?.description as string);
        setSelectedPros?.(usermatches?.[0]?.pros as any);
        setSelectedCons?.(usermatches?.[0]?.cons as any);
        setCurrentPath?.(window.location.pathname);
    }, [usermatches, setChatImg, setSelectedMatch, setSelectedCompatibility, setSelectedBio, setSelectedPros, setSelectedCons, setCurrentPath]);


    // console.log("matches: ", usermatches?.[0]?.illustration)
    
    const router = useRouter();


    // make globe state for selected city match
    const handleCityMatch = (city: string, img: string, compatibility: number, bio: string, pros: any, cons: any) => {
        setSelectedMatch?.(city);
        setChatImg?.(img);
        setSelectedCompatibility?.(compatibility);
        setSelectedBio?.(bio);
        setSelectedPros?.(pros);
        setSelectedCons?.(cons);
        // setClearConversation?.(1)
    }

    const handleChatting = () => {
        setIsChatting?.(true);
        setIsMatching?.(false);
    }

    const handleMatching = () => {
        setIsChatting?.(false);
        setIsMatching?.(true);
    }
 
    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "-100%" },
    }


    const DeleteButton = () => {
        const status = useFormStatus();
        
        if (status.pending != true) {
          return (
            <button className="bg-gradient-to-t from-red-400/30 to-orange-400/30 text-red-400 hover:text-white hover:from-red-400 hover:to-orange-400 px-3 py-2 rounded-lg">Yes, delete this match.</button> 
        )
        }
    
        if (status.pending === true) {
          return (
            <button className="bg-gradient-to-t from-red-400/30 to-orange-400/30 text-red-400 hover:text-white hover:from-red-400 hover:to-orange-400 px-3 py-2 rounded-lg">Deleting...</button> 
            )
        }
    }



    return (

        <>

            {/* desktop */}
            <div className="w-full h-full bg-gray-100  place-items-center place-content-center hidden md:flex flex-col justify-between" >
                
                {currentPath === '/match' && (
                    <>
                    {/* when we get a logo i want to put it here */}
                    <div></div>
                    </>
                )}

                {currentPath !== '/match' && (
               
               <>
               
               <div className="w-full z-10 flex place-content-center place-items-center p-[0.73em]">
                    <span onClick={() => setIsItineraryModalOpen?.(!isItineraryModalOpen)} className="hover:cursor-pointer">
                        { isItineraryModalOpen && <PanelRight /> }
                        { !isItineraryModalOpen && <PanelLeft /> }
                    </span>
                </div>

                <div className="flex place-items-center flex-col w-max h-[50%] gap-3">


                    {/* selected */}
                    <div className="w-max px-2 h-max flex flex-col">

                        {/* <p className="px-2 text-muted-foreground font-bold">Selected Match</p> */}

                        <div className="bg-green-400 place-items-center p-2 mt-3 w-max flex flex-col gap-8 relative h-max select-none  rounded-full overflow-hidden" >

                            <div className="w-[30px] h-[30px] rounded-full flex place-items-end place-content-end">
                                <Image className="rounded-full h-full  w-full object-cover" src={chatImg ? chatImg : placeholderimg} sizes="100%" width={30} height={30} alt="" />
                            </div>


                        </div>

                     
                        {/* {selectedMatch == '' ? (
                            <p className="select-none"><strong>{usermatches?.[0]?.city}</strong></p>
                            ) : (
                                <p className="select-none"><strong>{selectedMatch}</strong></p>
                                )} */}



                    </div>

                    <div className="w-full h-[1px] bg-gray-300"></div>


                    {/* mapped destinations */}
                    <div className="w-max h-[60%] flex flex-col gap-4 no-scrollbar overflow-y-scroll">

                        {usermatches?.map((dest: DestinationItem, index: number) => {
                            return (
                                <>
                                    <div className="w-full  flex place-content-center place-items-center">

                                        <div key={index} onClick={() => handleCityMatch(dest.city, dest.illustration, dest.compatibility || 0, dest.description, dest.pros, dest.cons)} className="w-full relative h-max select-none flex hover:bg-gray-200  py-1 rounded-xl hover:scale-[102%]  overflow-hidden place-items-center place-content-center">
                                            <div className="w-full h-max cursor-pointer place-items-center place-content-center relative flex flex-col"
                                                // style={{ backgroundImage: `url(${dest.illustration})`, backgroundRepeat: 'no-repeat', backgroundSize: 'fill', backgroundPosition: 'center' }}
                                                key={dest.id}>
                                                <div className="w-full flex-col  flex gap-1 place-items-center place-content-center justify-between">

                                                    <div className="w-max flex place-items-center place-content-center">
                                                        <div className="w-[30px] h-[30px] rounded-full flex">
                                                            {/* <div className="absolute z-[-1] bg-gradient-to-r from-white via-white to-transparent w-full h-full"></div> */}
                                                            <Image className="rounded-full h-full  w-full object-cover" src={dest.illustration} sizes="100%" width={30} height={30} alt="" />
                                                        </div>
                                                        {/* <h3 className="text-[14px] p-2 rounded-full w-max">{dest.city}</h3> */}
                                                    </div>

                                                    <p className="px-2 text-[9px]">{dest.city}</p>

                                                    {/* <p className="text-[10px] p-2 flex flex-col rounded-full font-bold w-max h-max">
                                                        <span className="text-green-500 text-[15px]">{dest.compatibility}% </span>
                                                        Match!
                                                    </p> */}

                                                </div>
                                            </div>
                                        </div>

                                        {/* <Popover>
                                            <PopoverTrigger>
                                                <div className="hover:cursor-pointer hover:bg-gray-200 py-2  rounded-lg">
                                                    <EllipsisVertical size={15} />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-max flex place-items-center place-content-center flex-col gap-4">
                                                <div className="flex w-full place-items-center place-content-center flex-col">
                                                    <p className="text-[12px] text-muted-foreground">Deleting a match can NOT be undone.</p>
                                                    <p className="text-[12px] text-muted-foreground">Are you sure?</p>
                                                </div>
                                                <form action={() => deleteMatch(String(dest.id))} className="w-max flex place-items-center place-content-center">
                                                    <Input type="hidden" name="id" value={dest.id} />
                                                    <DeleteButton />
                                                </form>
                                            </PopoverContent>
                                        </Popover> */}

                                    </div>
                                </>
                            );
                        })}

                    </div>

                </div>

               </>

                )}

                {/* settings stuff / upgrade stuff maybe */}
                <div className="w-max h-[30%] my-8 place-items-center  flex flex-col gap-6">

                    <Link href="/">

                        <div className="cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                            <Home />
                            {/* <p className="font-bold">Home</p> */}
                        </div>

                    </Link>

                    <Link href="/explore">

                        <div className="cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                            <MessageCircle />
                        </div>

                    </Link>
                  
                    <Link href="/pricing">
                    
                        <CreditCard />

                    </Link>  

                    <Link href="/settings">

                        <div className="cursor-pointer text-[14px] w-max h-max flex place-items-center gap-3">
                            <Settings />
                        </div> 

                    </Link>  



                    {/* user stuff */}
                    <div className="w-max  h-[100px]">

                        <div className="w-full flex h-[60px]">
                            {/* <div className="w-full flex h-[60px] bg-gradient-to-t from-cyan-500 to-green-400 p-3"> */}
                            <div className="w-full flex place-content-start place-items-center justify-start h-full gap-5">
                                <UserButton />
                                {/* <div className="flex gap-3">
                                    <p className="text-[14px] font-bold">{clerkdata?.name}</p>
                                    <p className="text-[12px] text-muted-foreground">@{clerkdata?.username}</p>
                                </div> */}
                            </div>

                        </div>

                    </div>

                    <p className="px-4 flex w-full place-content-start text-[10px] text-muted-foreground font-bold">Cityswipe</p>

                </div>      

            </div> 

        {/* mobile */}
        <div className="w-[50px] z-[100] relative h-full bg-gray-100 py-3 flex md:hidden flex-col place-items-center place-content justify-between" > 

            {currentPath === '/match' && (
                <>
                {/* when we get a logo i want to put it here */}
                <div></div>
                </>
                )}
            
            {currentPath !== '/match' && (
                        <div className="cursor-pointer p-2 w-max h-max" onClick={() => setIsSidebarOpen?.(!isSidebarOpen)}>
                            {isSidebarOpen ? <ChevronDown className="rotate-90"/> : <ChevronDown className="-rotate-90"/> }
                        </div>
            )}

            {/* settings stuff / upgrade stuff maybe */}
            <div className="w-max  h-max my-6  flex flex-col gap-6">

                <Link href="/">
                
                <div className="px-1 cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                    <Home size={18}/>
                </div>

                </Link>

                <Link href="/explore">

                    <div className="cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                        <MessageCircle />
                    </div>

                </Link>

                <Link href="/pricing">
                    
                    <div className="px-1 cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                        <CreditCard size={18} />
                    </div>

                </Link>  

                
                <Link href="/settings">

                    <div className="px-1 cursor-pointer text-[14px] w-full h-max flex place-items-center gap-3">
                        <Settings size={18}/>
                    </div>

                </Link>

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
                                <Image className="rounded-full h-full  w-full object-cover" src={chatImg || placeholderimg} sizes="100%"  width={30} height={30} alt="" />
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
                                <div onClick={() => handleCityMatch(dest.city, dest.illustration ?? '', dest.compatibility || 0, dest.description, dest.pros, dest.cons )} className="w-full relative h-max select-none hover:bg-gray-200 px-4 py-1 rounded-xl hover:scale-[102%] flex flex-col gap-[15px] overflow-hidden place-items-start">
                                    <div className="w-full  h-max cursor-pointer relative flex flex-col place-items-start place-content-center" 
                                    // style={{ backgroundImage: `url(${dest.illustration})`, backgroundRepeat: 'no-repeat', backgroundSize: 'fill', backgroundPosition: 'center' }}
                                    key={dest.id}>
                                        <div className="w-full mr-3 flex gap-1 place-items-center place-content-center justify-between">
                                            
                                            <div className="w-max flex gap-2 place-items-center place-content-center">
                                                <div className="w-[30px] h-[30px] rounded-full flex place-items-end place-content-end">
                                                    <Image className="rounded-full h-full  w-full object-cover" src={dest.illustration} sizes="100%" width={30} height={30} alt="" />
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
