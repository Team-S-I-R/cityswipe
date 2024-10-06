'use client';

import { useCitySwipe } from "../citySwipeContext";
import { Calendar as CalendarIcon } from "lucide-react";
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

type BlockIdentifier = string | Block;

const Itinerary = (itinerary: any, clerkdata: any) => {
  const { selectedMatch } = useCitySwipe();
  const { userquestions } = useCitySwipe();
  const [blockToMessWith, setBlockToMessWith] = useState("");
  const { newItineraryItem, setNewItineraryItem } = useCitySwipe();
  const { usermatches, setUserMatches } = useCitySwipe();
  const { addingItemToItinerary, setAddingItemToItinerary } = useCitySwipe();
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
      <div className="flex flex-col gap-2 h-full border-b border-r border-primary/20 ">
        <div className="select-none text-[14px] px-2 text-center font-bold flex-nowrap flex p-[1em] border-b  border-primary/20 w-full place-content-center place-items-center gap-2">
          <p>My</p>
          <p className="">Itinerary</p>
          <span className="bg-gradient-to-t from-cyan-400 to-green-400 text-[9px] px-2 py-1 text-white rounded-full  top-[-40%] right-[-70%]">NEW</span>
        </div>

        <div className="py-2 h-full z-[100] relative w-full">
          <BlockNoteView className="text-[12px]" theme={"light"} editor={editor} />

          <div className="flex place-items-end w-full justify-between h-max absolute bottom-0 p-4 gap-5 ">
            {itinerary.itinerary.length > 0 && (
              <div className="text-[10px] text-muted-foreground" key={itinerary.itinerary[itinerary.itinerary.length - 1].blockNum}>
                <p>
                  Latest save at: {new Date(itinerary.itinerary[itinerary.itinerary.length - 1].updatedAt).toLocaleString()}
                </p>
              </div>
            )}
            <div className="w-max h-max flex flex-col gap-2">
       
              <Button
                className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded w-full"
                onClick={() => router.push(`/share/${userdata?.id}`)}
              >
                Share
              </Button>

              <Button
                className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded w-full"
                onClick={() => saveItineraryContent()}
              >
                Save
              </Button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Itinerary;
