'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import Chat from "../cs-componets/chat"
import Sidebar from "../cs-componets/sidebar"
import { useCitySwipe } from "../citySwipeContext"
import { useEffect, useState } from "react"
import Itinerary from "../cs-componets/itinerary"
import { motion, AnimatePresence } from "framer-motion"

export default function Explore({clerkdata, matches, questions, itinerary}: any) {
    
    const { isChatting } = useCitySwipe();
    const { isMatching } = useCitySwipe();
    const { userdata, setUserData } = useCitySwipe();
    const { usermatches, setUserMatches }  = useCitySwipe()
    const { userquestions, setUserQuestions }  = useCitySwipe()
    const { isItineraryModalOpen, setIsItineraryModalOpen } = useCitySwipe();
    const { userItinerary, setUserItinerary } = useCitySwipe();
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { chatImg, setChatImg } = useCitySwipe();
    console.log("itinerary: ", itinerary);

    const itinerarVariants = {
        open: { width: "25%", opacity: 1,  },
        closed: { width: "0%", opacity: 0, },
    }

    const chatVariants = {
        open: { width: "70%" },
        closed: { width: "95%" },
    }

    useEffect(() => {
        setUserData?.(clerkdata);
        setUserMatches?.(matches);
    }, [clerkdata, matches]);

    useEffect(() => {
        setUserQuestions?.(questions);
        setIsItineraryModalOpen?.(true);
        setUserItinerary?.(itinerary);
    }, [questions, setIsItineraryModalOpen, setUserItinerary, itinerary]);


    // have to upload the header here for now
    return (
        <>
            {/* this ensures that the explore page actually renders with matches.  */}
            {usermatches.length > 0 && (
                <>
                    {/* lg / md desktop */}
                    <main className="hidden md:flex w-[100dvw] h-[100dvh] overflow-hidden">
                        
                        <div className="flex w-[75px] h-full items-center justify-center">
                            <Sidebar clerkdata={userdata} matches={usermatches}/>
                        </div>

                        <AnimatePresence >

                        <motion.div
                        key='1'
                            initial="open"
                            animate={isItineraryModalOpen ? "open" : "closed"}
                            variants={itinerarVariants} 
                            transition={{ duration: 1.25 }}                                     
                            className={`h-full`} 
                        >
                            <Itinerary itinerary={itinerary} clerkdata={userdata} key='3'/>
                        </motion.div>

                        <motion.div 
                        key='2'
                        initial="open"
                        animate={isItineraryModalOpen ? "open" : "closed"}
                        variants={chatVariants} 
                        transition={{ duration: 0.5 }}   
                        className={`flex w-[80%] h-full items-center justify-center relative`}>
                            <Chat key='4' matches={usermatches}/>
                        </motion.div>

                        </AnimatePresence>


                    </main>

                    {/* md desktop */}
                    {/* <main className="hidden md:flex lg:hidden w-[100dvw] h-[100dvh] overflow-hidden">
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="rounded-lg border"
                        >
                            <ResizablePanel defaultSize={20} className="max-w-[20%]">
                                <div className="flex h-full items-center justify-center">
                                    <Sidebar clerkdata={userdata}/>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />

                            <ResizablePanel defaultSize={80} className="max-w-[100%]">
                                <div className="flex w-full h-full items-center justify-center relative">
                                    <Chat/>
                                </div>
                            </ResizablePanel>

                        </ResizablePanelGroup>
                    </main> */}

                    {/* mobile */}
                    <main className="flex md:hidden w-[100dvw] h-[100dvh] overflow-hidden">
                        <Sidebar clerkdata={userdata}/>
                        <div className="flex w-full h-[100dvh] items-center justify-center relative">
                            <Chat/>
                        </div>
                    </main>
                </>
            )}
   
            {/* if there are no matches, render this */}
            {usermatches.length < 1 && (
                <>
                    {/* lg desktop */}
                    <main className="hidden lg:flex w-[100dvw] h-[100dvh] overflow-hidden">
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="rounded-lg border"
                        >
                            <ResizablePanel defaultSize={10} className="max-w-[40%]">
                                <div className="flex h-full items-center justify-center">
                                    <Sidebar clerkdata={userdata} matches={usermatches}/>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />

                            <ResizablePanel defaultSize={90} className="max-w-[100%]">
                                <div className="flex w-full h-full items-center justify-center relative">
                                    <Chat matches={usermatches}/>
                                </div>
                            </ResizablePanel>

                        </ResizablePanelGroup>
                    </main>

                    {/* md desktop */}
                    <main className="hidden md:flex lg:hidden w-[100dvw] h-[100dvh] overflow-hidden">
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="rounded-lg border"
                        >
                            <ResizablePanel defaultSize={10} className="max-w-[10%]">
                                <div className="flex h-full items-center justify-center">
                                    <Sidebar clerkdata={userdata}/>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />

                            <ResizablePanel defaultSize={90} className="max-w-[100%]">
                                <div className="flex w-full h-full items-center justify-center relative">
                                    <Chat/>
                                </div>
                            </ResizablePanel>

                        </ResizablePanelGroup>
                    </main>

                    {/* mobile */}
                    <main className="flex md:hidden w-[100dvw] h-[100dvh] overflow-hidden">
                        <Sidebar clerkdata={userdata}/>
                        <div className="flex w-full h-full items-center justify-center relative">
                            <Chat/>
                        </div>
                    </main>
                </>
            )}

        </>
    )
}