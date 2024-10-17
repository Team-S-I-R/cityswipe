'use client';

import { useCitySwipe } from "../citySwipeContext";
import { Calendar as CalendarIcon, ToggleLeftIcon, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { addDays, format, set } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { Block } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { summerizeItineraryText } from "../actions";
import { createItinerary, updateItinerary } from "../actions";
import { useRouter } from "next/navigation";
import { it } from "node:test";

type BlockIdentifier = string | Block;

const Itinerary = (itinerary: any, clerkdata: any) => {
  const { selectedMatch } = useCitySwipe();
  const { userquestions } = useCitySwipe();
  const [blockToMessWith, setBlockToMessWith] = useState("");
  const { newItineraryItem, setNewItineraryItem } = useCitySwipe();
  const { usermatches, setUserMatches } = useCitySwipe();
  const { addingItemToItinerary, setAddingItemToItinerary } = useCitySwipe();
  const [showTools, setShowTools] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const { userItinerary, setUserItinerary } = useCitySwipe();
  const {userdata, setUserData} = useCitySwipe();
  const router = useRouter();


  useEffect(() => {
    setUserData?.(clerkdata);
  }, [clerkdata])
  // Initialize editor outside of conditional
  const editor = useCreateBlockNote({
    initialContent:
      itinerary.itinerary.length > 0
        ? itinerary.itinerary.map((item: any) => ({
            type: item.type,
            content: item.text,
            props: item.props,
            blockNum: item.blockNum,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            userId: item.userId,
            username: item.username,
          }))
        : [
            {
              type: "paragraph",
              content: `Welcome to your itinerary!`,
            },
            {
              type: "paragraph",
              content: `Here you can further plan out your trip by jotting down important information.`,
            },
            {
              type: "paragraph",
              content: `Also, by talking to your match and pressing "Add to itinerary", you can add your conversations here.`,
            },
          ],
  });

  let blocks = editor.document;

  const saveItineraryContent = () => {
    let latestBlocks = editor.document;
    console.log("latestBlocks: ", latestBlocks);
    itinerary.itinerary.length > 0 ? updateItinerary(latestBlocks) : createItinerary(latestBlocks);
  };

  const handleShareItinerary = (uId: string) => {

    saveItineraryContent();

    if (uId != undefined) {
      router.push(`/share/${uId}`);
    }

  };

  // Only one useEffect for blockToMessWith logic
  useEffect(() => {
    if (blocks.length > 0) {
      setBlockToMessWith(blocks[blocks.length - 1].id);
    }
  }, [blocks]);

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
        try {
          const summarizedText = await summerizeItineraryText?.(newItineraryItem as string);
          insertBlocks([{ type: "paragraph", content: summarizedText }], blockToMessWith, "after");
        } catch (error) {
          console.error("Error summarizing itinerary text:", error);
        }
      }
    };

    insertSummarizedText();
  }, [addingItemToItinerary, newItineraryItem, blockToMessWith]);

  return (
    <>
      <div className="flex h-full relative overflow-hidden flex-col gap-2 h-full border-b border-r border-primary/20 ">
        
        <div className="flex flex-col gap-2 w-full">


          {itinerary.itinerary.length < 1 && (
                <div className="h-max text-muted-foreground px-2 py-4">
                  <p>
                    <span className="italic text-[9px]">Make sure to save your itinerary. (click the green wrench)</span>
                  </p>
                </div>
            )}

          {itinerary.itinerary.length > 0 && (
                <div className="text-[10px] h-max text-muted-foreground px-2 py-4" key={itinerary.itinerary[itinerary.itinerary.length - 1].blockNum}>
                  <p>
                    <span className="italic text-[9px]">Latest save at: </span><strong>{new Date(itinerary.itinerary[itinerary.itinerary.length - 1].updatedAt).toLocaleString()}</strong>
                  </p>
                </div>
          )}

        <div className="select-none h-max text-[14px] px-2 text-center font-bold flex-nowrap flex pb-[1em] border-b  border-primary/20 w-full place-content-center place-items-center gap-2">
          <p>My</p>
          <p className="">Itinerary</p>
          <span className="bg-gradient-to-t from-cyan-400 to-green-400 text-[9px] px-2 py-1 text-white rounded-full  top-[-40%] right-[-70%]">NEW</span>
        </div>

        </div>

        <div className="py-2 h-full overflow-y-scroll z-[100] relative w-full">
          <BlockNoteView className="text-[12px]" theme={"light"} editor={editor} /> 
        </div>

        {showTools === true && (
          <div className="flex z-[100] bg-white py-4 place-items-end w-full px-4 right-0 justify-between h-max absolute bottom-0 gap-5 ">
            <div className="w-full h-max flex flex-col gap-2">
       
              <div onClick={() => setShowTools(false)} className="w-full flex place-content-end">
                <p className="underline cursor-pointer">Close</p>
              </div>

              {itinerary.itinerary.length > 0 && (
                
                <Button
                  className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded w-full"
                  onClick={() => handleShareItinerary(userdata?.id)}
                >
                  Share
                </Button>

              )}

              <Button
                className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded w-full"
                onClick={() => saveItineraryContent()}
              >
                Save
              </Button>

            </div>
          </div>
        )}

        {showTools === false && (
          <div onClick={() => setShowTools(true)} className="cursor-pointer w-10 h-10 absolute flex place-items-center place-content-center text-white p-2 bottom-10 right-10 rounded-full bg-gradient-to-t from-cyan-500 to-green-400 z-[100]">
            <Wrench/>
          </div>
        )}

      </div>
    </>
  );
};

export default Itinerary;
