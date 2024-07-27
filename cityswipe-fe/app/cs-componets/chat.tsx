'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useCitySwipe } from "../citySwipeContext";

export default function Chat() {

    const { isStarted, setIsStarted } = useCitySwipe();
    const { isChatting, setIsChatting } = useCitySwipe();
    const { isMatching, setIsMatching } = useCitySwipe();

    const handleMatching = () => {
        setIsChatting?.(false);
        setIsMatching?.(true);
    }

    return (
        <div className="relative flex flex-col place-content-center place-items-center w-full h-full">
            <div className="absolute border-b border-primary/20 top-0 w-full h-[10%] flex justify-between place-items-center px-5">
                <h2 className="select-none">You've matched with "Insert City Here!"</h2>
                <Button onClick={handleMatching} className="bg-transparent hover:bg-transparent text-primary/70"><X size={20} /></Button>
            </div>

            <p>Chat</p>
            <p>You've matched with "Insert City Here!"</p>
            <p>Ask "Insert City Here" anything you'd like to know</p>

            <div className="absolute border-t border-primary/20 flex place-items-center bottom-0 w-full h-[10vh]">
                <div className="p-2 px-4 w-full">
                    <Input className="outline outline-primary/20" autoFocus />
                </div>
            </div>
        </div>
    )
}