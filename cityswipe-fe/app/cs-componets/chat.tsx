'use client'

import { Input } from "@/components/ui/input"
export default function Chat() {
    return (
        <div className="relative flex flex-col place-content-center place-items-center w-full h-full">
            <
            p>Chat</p>
            <p>You've matched with "Insert City Here!"</p>
            <p>Ask "Insert City Here" anything you'd like to know</p>

            <div className="absolute bottom-0 w-full h-[10vh]">
                <div className="p-2 px-4">
                    <Input autoFocus />
                </div>
            </div>
        </div>
    )
}