'use client';

import { useCitySwipe } from "../citySwipeContext";
import { Calendar as CalendarIcon, ToggleLeftIcon, Wrench } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { updateItinerary } from "../actions";
import { useRouter } from "next/navigation";


type BlockIdentifier = string | Block;

const Itinerary = ({ itinerary: savedBlocks = [], clerkdata }: any) => {
  const { toast } = useToast();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const saving = useRef<Promise<void> | null>(null);
  const lastSavedDocument = useRef<string>("");
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
      savedBlocks.length > 0
        ? savedBlocks.map((item: any) => item.props?._cityswipeBlock ?? ({
            type: item.type || "paragraph",
            content: item.text || "",
            props: item.props,
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

  const saveItineraryContent = useCallback(async () => {
    if (saving.current) await saving.current;
    const document = JSON.stringify(editor.document);
    if (document === lastSavedDocument.current) return;
    const save = updateItinerary(editor.document).then(() => {
      lastSavedDocument.current = document;
      setSavedAt(new Date().toLocaleTimeString());
    });
    saving.current = save;
    try { await save; } finally { if (saving.current === save) saving.current = null; }
  }, [editor]);

  const saveWithFeedback = useCallback(async () => {
    try { await saveItineraryContent(); return true; } catch {
      toast({ title: "Itinerary could not be saved", description: "Please try saving again.", variant: "destructive" });
      return false;
    }
  }, [saveItineraryContent, toast]);

  useEffect(() => {
    const intervalId = setInterval(() => { void saveWithFeedback(); }, 15000);
    return () => clearInterval(intervalId);
  }, [saveWithFeedback]);

  const handleShareItinerary = async (userId: string) => {
    if (userId && await saveWithFeedback()) router.push(`/share/${userId}`);
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


          {savedBlocks.length === 0 && !savedAt && (
            <p className="text-xs text-muted-foreground px-2 py-4">
              Use the green wrench to save or share your itinerary.
            </p>
          )}

          {savedBlocks.length > 0 && (
                <div className="text-[10px] h-max text-muted-foreground px-2 py-4" key={savedBlocks[savedBlocks.length - 1].blockNum}>
                  <p>
                    <span className="italic text-[9px]">Latest save at: </span><strong>{new Date(savedBlocks[savedBlocks.length - 1].updatedAt).toLocaleString()}</strong>
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
          {savedAt && <p className="px-4 text-xs text-muted-foreground" role="status">Saved at {savedAt}</p>}
          <BlockNoteView className="text-[12px]" theme={"light"} editor={editor} /> 
        </div>

        {showTools === true && (
          <div className="flex z-[100] bg-white py-4 place-items-end w-full px-4 right-0 justify-between h-max absolute bottom-0 gap-5 ">
            <div className="w-full h-max flex flex-col gap-2">
       
              <div onClick={() => setShowTools(false)} className="w-full flex place-content-end">
                <p className="underline cursor-pointer">Close</p>
              </div>

              {clerkdata?.id && (
                
                <Button
                  className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded w-full"
                  onClick={() => void handleShareItinerary(clerkdata.id)}
                >
                  Share
                </Button>

              )}

              <Button
                className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded w-full"
                onClick={() => void saveWithFeedback()}
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
