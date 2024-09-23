'use client'

import { useCitySwipe } from "../citySwipeContext";

import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react"
import { addDays, format, set } from "date-fns"
import { DateRange } from "react-day-picker" 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion"

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { Block } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { summerizeItineraryText } from "../actions";

type BlockIdentifier = string | Block;

const Itinerary = () => {

    const { selectedMatch } = useCitySwipe()
    const { userquestions } = useCitySwipe()
    const [ blockToMessWith, setBlockToMessWith ] = useState("")
    const { newItineraryItem, setNewItineraryItem } = useCitySwipe();
    const {usermatches, setUserMatches} = useCitySwipe();
    const { addingItemToItinerary, setAddingItemToItinerary } = useCitySwipe();
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
      })

    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        initialContent: [
            {
              type: "paragraph", 
              content: `Welcome to your itinerary!`,
            },
            {
              type: "paragraph", 
              content: `Here you can further plan out your trip, by jotting down important information you want to remember.
              `,
            },
            {
              type: "paragraph", 
              content: `Also, by talking to your match and simply press "Add to itinerary", under the green speech bubble, it will add whatever you are talking about to your itinerary as well!
              `,
            },
        ]
    });
    
    // gets all "blocks in the itinerary"
    const blocks = editor.document;

    useEffect(() => {
        setBlockToMessWith(blocks[blocks.length - 1].id);
        console.log("blockToMessWith: ", blockToMessWith);
    });

    // Function to insert blocks
    const insertBlocks = (blocksToInsert: any, referenceBlock: any, placement: any) => {
        
            try {
                editor?.insertBlocks(blocksToInsert, referenceBlock, placement);
                setAddingItemToItinerary?.(false);
                console.log("Blocks inserted");
            } catch (error) {
                console.log(error);
            }


    };
    
    

    useEffect(() => {
        const insertSummarizedText = async () => {
            if (addingItemToItinerary) {
                console.log("insert blocks is starting....");
                try {
                    const summarizedText = await summerizeItineraryText?.(newItineraryItem as string);
                    console.log("summarizedText: ", summarizedText);
                    insertBlocks([{type: "paragraph", content: summarizedText}], blockToMessWith, "after");
                    console.log("false now");
                } catch (error) {
                    console.error("Error summarizing itinerary text:", error);
                }
            }
        };

        insertSummarizedText();
    }, [addingItemToItinerary, newItineraryItem, blockToMessWith]);


    return (
        <>
                  <div className="flex flex-col gap-2 h-full border-b border-r border-primary/20 ">
                    
                    <div className="select-none text-[14px] px-2 text-center font-bold flex-nowrap flex p-[1em] border-b  border-primary/20 w-full place-content-center place-items-center gap-2">
                        <p>My</p>
                        {/* <p>{selectedMatch}</p> */}
                        <p className="">Itinerary
                        </p>
                        <span className="bg-gradient-to-t from-cyan-400 to-green-400 text-[9px] px-2 py-1 text-white rounded-full  top-[-40%] right-[-70%]">NEW</span>
                    </div>

                    

                    <div className="py-2 w-full">
                        <BlockNoteView 
                        className="text-[12px]" 
                        theme={'light'} 
                        editor={editor} 
                        />
                    </div>

                    </div>
                    {/* <button onClick={() => insertBlocks([{type: "paragraph", content: "Hello World"}], blockToMessWith, "after")}>Submit</button> */}
        </> 
    )
}

export default Itinerary