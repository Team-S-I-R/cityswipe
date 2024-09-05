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

export default function Explore({clerkdata, matches}: any) {
    
    const { isChatting } = useCitySwipe();
    const { isMatching } = useCitySwipe();
    const { userdata, setUserData } = useCitySwipe();
    const { usermatches, setUserMatches }  = useCitySwipe()
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { chatImg, setChatImg } = useCitySwipe();
    
    useEffect(() => {
        setUserData?.(clerkdata);
        setUserMatches?.(matches);
    }, [matches]);

    // have to upload the header here for now
    return (
        <>
            {/* this ensures that the explore page actually renders with matches.  */}
            {usermatches.length > 0 && (
                <>
                    {/* lg desktop */}
                    <main className="hidden lg:flex w-[100dvw] h-[100dvh] overflow-hidden">
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="rounded-lg border"
                        >
                            <ResizablePanel defaultSize={20} className="max-w-[40%]">
                                <div className="flex h-full items-center justify-center">
                                    <Sidebar clerkdata={userdata} matches={usermatches}/>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />

                            <ResizablePanel defaultSize={80} className="max-w-[100%]">
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
                            <ResizablePanel defaultSize={40} className="max-w-[40%]">
                                <div className="flex h-full items-center justify-center">
                                    <Sidebar clerkdata={userdata}/>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />

                            <ResizablePanel defaultSize={60} className="max-w-[100%]">
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
   
            {/* if there are no matches, render this */}
            {usermatches.length < 1 && (
                <>
                    {/* lg desktop */}
                    <main className="hidden lg:flex w-[100dvw] h-[100dvh] overflow-hidden">
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="rounded-lg border"
                        >
                            <ResizablePanel defaultSize={20} className="max-w-[40%]">
                                <div className="flex h-full items-center justify-center">
                                    <Sidebar clerkdata={userdata} matches={usermatches}/>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />

                            <ResizablePanel defaultSize={80} className="max-w-[100%]">
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
                            <ResizablePanel defaultSize={40} className="max-w-[40%]">
                                <div className="flex h-full items-center justify-center">
                                    <Sidebar clerkdata={userdata}/>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />

                            <ResizablePanel defaultSize={60} className="max-w-[100%]">
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