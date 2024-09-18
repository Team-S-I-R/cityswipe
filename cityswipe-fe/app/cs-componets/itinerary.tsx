
import { useCitySwipe } from "../citySwipeContext";

const Itinerary = () => {

    const { selectedMatch } = useCitySwipe()

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

                    <div className="p-4 px-8">
                    
                        <p className="text-[12px]">Your itinerary will show here.</p>

                    </div>

                    </div>
        </> 
    )
}

export default Itinerary