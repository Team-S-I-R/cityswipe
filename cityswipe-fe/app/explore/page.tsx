'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import Chat from "../cs-componets/chat"
import Sidebar from "../cs-componets/sidebar"
import { useCitySwipe } from "../citySwipeContext"
import { useEffect } from "react"

export default function Explore({clerkdata}: any) {
    
    const { isChatting } = useCitySwipe();
    const { isMatching } = useCitySwipe();
    const { userdata, setUserData } = useCitySwipe();
    
    useEffect(() => {
        setUserData?.(clerkdata);
    }, []);
    // have to upload the header here for now
    return (
        <>
            {/* desktop */}
            <main className="hidden md:flex w-full h-full overflow-hidden">
            <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border"
            >
                <ResizablePanel defaultSize={20}>
                    <div className="flex h-full items-center justify-center">
                        <Sidebar clerkdata={userdata}/>
                    </div>
                </ResizablePanel>
                <ResizableHandle />

                <ResizablePanel defaultSize={80}>
                    <div className="flex h-full items-center justify-center relative">
                        <Chat/>
                    </div>
                </ResizablePanel>

            </ResizablePanelGroup>
            </main>

            {/* mobile */}
            <main className="flex md:hidden w-full h-full overflow-hidden">
                    
                    <Sidebar clerkdata={userdata}/>
                 

                    <div className="flex w-full h-full items-center justify-center relative">
                        <Chat/>
                    </div>
            </main>

        </>
    )
}