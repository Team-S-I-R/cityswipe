'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import Chat from "../cs-componets/chat"
import Sidebar from "../cs-componets/sidebar"
import Header from "../cs-componets/header"
import { useCitySwipe } from "../citySwipeContext"
import Match from "../cs-componets/match"

export default function Explore() {
    
    const { isChatting } = useCitySwipe();
    const { isMatching } = useCitySwipe();

    // have to upload the header here for now
    return (
        <>
            <main className="w-full h-full">
            <ResizablePanelGroup
            direction="horizontal"
            className=" rounded-lg border"
    >
            <ResizablePanel defaultSize={30}>
                <div className="flex h-full items-center justify-center">
                    <Sidebar/>
                </div>
            </ResizablePanel>
            <ResizableHandle />

            <ResizablePanel defaultSize={70}>
                <div className="flex h-full items-center justify-center relative">
                    {isChatting && <Chat/>}
                    {!isChatting && <Match/>}
                </div>
            </ResizablePanel>

            </ResizablePanelGroup>
            </main>
        </>
    )
}