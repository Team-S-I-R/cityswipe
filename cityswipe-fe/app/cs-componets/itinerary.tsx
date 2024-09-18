
import { useCitySwipe } from "../citySwipeContext";

import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react"
import { addDays, format } from "date-fns"
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
 

const Itinerary = () => {

    const { selectedMatch } = useCitySwipe()
    const { userquestions } = useCitySwipe()
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
      })


    return (
        <>
                  <div className="flex flex-col gap-2 h-full border-b border-r border-primary/20 ">
                    
                    <div className="select-none text-[14px] px-2 text-center font-bold flex-nowrap flex h-[6%] border-b  border-primary/20 w-full place-content-center place-items-center gap-2">
                        <p>My</p>
                        <p>{selectedMatch}</p>
                        <p className="">Itinerary
                        </p>
                        <span className="bg-gradient-to-t from-cyan-400 to-green-400 text-[9px] px-2 py-1 text-white rounded-full  top-[-40%] right-[-70%]">NEW</span>
                    </div>

                    <div className="p-4 px-8 flex flex-col gap-2">
                    
                        <p className="text-[12px]" >
                            Based on your quiz answers, we have you coming from 
                            <span className="text-black font-bold"> {userquestions?.[0]?.a1} </span>
                            and going to <span className="text-black font-bold"> {selectedMatch} </span>.
                        </p>

                        <p className="text-[12px]">For us to be able to make the most useful itinerary for you, we just need to know when you will start and end your trip:</p>

                        {/* ANCHOR start trip and end date */}
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>

                        <p className="text-[12px]">And how many people will be on your trip:</p>

                        <Input placeholder="Number of people on your trip"/>

                        <p className="text-[12px]">Your itinerary will show here.</p>

                    </div>

                    </div>
        </> 
    )
}

export default Itinerary