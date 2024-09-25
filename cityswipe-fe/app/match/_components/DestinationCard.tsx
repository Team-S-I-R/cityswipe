"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useDestinationSetContext } from "../../../context/destinationSetContext";
import { type Destination } from "@/lib/destinationSet.type";
import { useSavedDestinationContext } from "../../../context/savedDestinationContext";
import { Dot, Frown, Laugh, MapPin } from "lucide-react";

type Props = {
  id?: number;
  data: Destination;
  setCardDrivenProps: Dispatch<SetStateAction<any>>;
  setIsDragging: Dispatch<SetStateAction<any>>;
  isDragging: boolean;
  isLast: boolean;
  setIsDragOffBoundary: Dispatch<SetStateAction<any>>;
  setDirection: Dispatch<SetStateAction<any>>;
};

type cardSwipeDirection = "left" | "right";

const DestinationCard = ({
  id,
  data,
  setCardDrivenProps,
  setIsDragging,
  isDragging,
  isLast,
  setIsDragOffBoundary,
  setDirection,
}: Props) => {
  // const [user, setUser] = useUserContext();
  // const { score, previousScore } = user;

  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const [savedDestination, setSavedDestination] = useSavedDestinationContext();
  const [showPros, setShowPros] = useState(false);
  const [showCons, setShowCons] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(true);
  
  const [showMobilePro, setShowMobilePro] = useState(false);
  const [showMobileCon, setShowMobileCon] = useState(false);
  const [showMobileDescription, setShowMobileDescription] = useState(false);
  
  const { cards } = destinationSet;
  
  let cardsAmount = cards.length; //fix
  const [lenofDestinationSet, setLenofDestinationSet] = useState(cardsAmount);
  const [imgLoadingComplete, setImgLoadingComplete] = useState(false);
  const { city, country, illustration, description, pros, cons } = data;
  const x = useMotionValue(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const offsetBoundary = 150;
  const inputX = [offsetBoundary * -1, 0, offsetBoundary];
  const outputX = [-200, 0, 200];
  const outputY = [50, 0, 50];
  const outputRotate = [-40, 0, 40];
  const outputActionScaleBadAnswer = [3, 1, 0.3];
  const outputActionScaleRightAnswer = [0.3, 1, 3];
  const outputMainBgColor = ["rgba(252, 186, 182, 0.5)", "", "rgba(212, 224, 178, 0.5)"];

  let drivenX = useTransform(x, inputX, outputX);
  let drivenY = useTransform(x, inputX, outputY);
  let drivenRotation = useTransform(x, inputX, outputRotate);
  let drivenActionLeftScale = useTransform(
    x,
    inputX,
    outputActionScaleBadAnswer
  );
  let drivenActionRightScale = useTransform(
    x,
    inputX,
    outputActionScaleRightAnswer
  );
  // let drivenBg = useTransform(x, inputX, outputMainBgColor);
  let drivenBg = useTransform(x, [-20, 0, 20], outputMainBgColor);

  useMotionValueEvent(x, "change", (latest) => {
    //@ts-ignore
    setCardDrivenProps((state) => ({
      ...state,
      cardWrapperX: latest,
      buttonScaleBadAnswer: drivenActionLeftScale,
      buttonScaleGoodAnswer: drivenActionRightScale,
      mainBgColor: drivenBg,
    }));
  });

  // ANCHOR DESKTOP SHOW HANDLERS
  const showBioHandler = () => {
    setShowFullDescription(!showFullDescription);
    setShowPros(false)
    setShowCons(false)
  };

  const showProsHandler = () => {
    setShowPros(!showPros)
    setShowFullDescription(false)
    setShowCons(false)
  };

  const showConsHandler = () => {
    setShowCons(!showCons)
    setShowFullDescription(false)
    setShowPros(false)
  };

  // ANCHOR MOBILE SHOW HANDLERS
  const showMobileConsHandler = () => {
    setShowMobileCon(!showMobileCon)
    setShowMobileDescription(false)
    setShowMobilePro(false)
  };

  const showMobileProsHandler = () => {
    setShowMobilePro(!showMobilePro)
    setShowMobileDescription(false)
    setShowMobileCon(false)
  };

  const showMobileDescriptionHandler = () => {
    setShowMobileDescription(!showMobileDescription)
    setShowMobilePro(false)
    setShowMobileCon(false)
  };

  return (
    <>

    {/* desktop */}
      <motion.div
        initial={{ opacity: 0, y: 1000 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 4 }}
        id={`cardDrivenWrapper-${id}`}
        className=" md:w-[700px]  hidden sm:flex absolute !cursor-default p-4 gap-4 flex-row shadow-lg bg-white z-10 rounded-xl text-center  pointer-events-none text-black top-[8%] select-none transform translate-x-1/2 translate-y-1/2"
        style={{
          y: drivenY,
          rotate: drivenRotation,
          x: drivenX,
        }}
      >
        {/* inside of card  */}
        <div
          id="illustration"
          className="w-full h-full rounded-xl relative overflow-hidden z-10 flex flex-col"
        >

          <div className="flex flex-col place-items-center w-full relative h-[70%]">
        
              {/* ANCHOR NAME 1 out of whatever card youre on */}
              <div
                id="metrics"
                className="relative p-4 z-[2] flex place-items-center place-content-center w-full justify-between items-baseline"
              >

                <p id="location" className="text-[25px] font-bold w-max h-max">
                  {city}
                </p>

                {/* number of cards out of 50 */}
                <div className="rounded-xl bg-gradient-to-t from-cyan-400 to-green-400 px-3 w-max h-max">
                  <span className="text-[15px]">
                    {id}
                  </span>
                  <span className="">
                    /<span className="">{lenofDestinationSet}</span>
                  </span>
                </div>

              </div>

              {/* ANCHOR the image of match */}
              <div className="w-[95%] rounded-lg relative h-[200px] bg-gray-400">
                {illustration.length > 10 && (
                  <Image
                    priority
                    className="rounded w-full absolute h-full object-cover"
                    // src={data.illustration || placeholderImg}
                    src={illustration}
                    fill
                    sizes="100%"
                    alt="car"
                  />
              )}
              </div>
          
          </div>


          {/* ANCHOR bottom left of card */}
          <div className="h-[30%] p-4 w-full  z-[2]  flex flex-col gap-2 leading-tight justify-evenly"
            id="locationWrapper"
          >
              {/* ANCHOR location/full */}
              <div className="w-max h-max flex gap-2 place-items-center place-content-center">
                <MapPin size={15} className="text-muted-foreground"/> 
                <p id="location" className="text-[15px] text-muted-foreground w-max h-max">
                  {city}, {country}
                </p>
              </div>  
 
              {/* ANCHOR bio/description */}
              <div className="h-max text-left  overflow-hidden no-scrollbar pointer-events-auto w-full">
                    <p>{description}</p>
              </div>

              {/* ANCHOR Pros and Cons */}
              <div className="w-max h-max">
            
                  <div className="pointer-events-auto text-[12px] flex gap-4 place-items-center place-content-center">
                    
                    {/* <button onClick={showBioHandler} className="font-bold w-max flex place-items-center gap-2 shadow-lg  px-3 py-2 rounded-lg">
                      Full Bio
                    </button>
                    
                    <button onClick={showProsHandler} className="font-bold w-max flex place-items-center gap-2 bg-gradient-to-t from-cyan-400/30 to-green-400/30 text-green-400 hover:text-white hover:from-cyan-400 hover:to-green-400 px-3 py-2 rounded-lg">
                      <Laugh size={20} className=""/>
                      Pros
                    </button>
                    
                    <button onClick={showConsHandler} className="font-bold w-max flex place-items-center gap-2 bg-gradient-to-t from-red-400/30 to-orange-400/30 text-red-400 hover:text-white hover:from-red-400 hover:to-orange-400 px-3 py-2 rounded-lg">
                      <Frown size={20} className=""/>
                      Cons
                    </button> */}
                  
                  </div>

              </div>
        
          </div>



        </div>
        {/* images end */}

        {/* info */}
        <motion.div
          id="info"
          className=" w-[400px] h-full rounded-xl top-0 overflow-hidden z-10"
        >
          <div
            id="benefitsWrapper"
            className="h-full w-full text-left rounded p-4 z-[2] text-black flex flex-col gap-2 place-items-start leading-tight"
          >
    
            {/* the description will be shown by default */}
            {showFullDescription === false && showPros === false && showCons === false && (
                <>
                <p id="description" className="text-[15px] font-bold">
                  Bio
                </p>

                <p className="w-full h-[1px] bg-gray-200"></p>
                <p className="text-[15px] text-muted-foreground">{description}</p>
              </>
            )}

            {/* {showFullDescription && (
              <>
                <p id="description" className="text-[15px] font-bold">
                  Bio
                </p>

                <p className="w-full h-[1px] bg-gray-200"></p>
                <p className="text-[15px] text-muted-foreground">{description}</p>
              </>
            )} */}

            <div className="flex flex-col w-full h-full place-content-evenly pb-4">
            {(
              <>
                <p id="pros" className="text-[15px] font-bold">
                  Pros
                </p>
                <p className="w-full h-[1px] bg-gray-200"></p>
                {pros.slice(0, 5).map((pro, index) => {
                  return <p key={index} className="text-[15px] flex gap-2"><Dot/> {pro}</p>;
                })}
              </>
            )}

            { (
              <>
                <p id="cons" className="text-[15px] font-bold pt-4">
                  Cons
                </p>
                <p className="w-full h-[1px] bg-gray-200"></p>
                {cons.slice(0, 5).map((con, index) => {
                  return <p key={index} className="text-[15px] flex gap-2"><Dot/> {con}</p>;
                })}
              </>
            )}
            </div>

          </div>

          {/* branding */}
          <p className="absolute bottom-10 text-muted-foreground right-10 text-[8px]">
            Cityswipe
          </p>
        </motion.div>

      </motion.div>

      {/* mobile */}
      <motion.div
        initial={{ opacity: 0, y: 1000 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 5 }}
        id={`cardDrivenWrapper-${id}`}
        className="w-full h-full sm:hidden absolute !cursor-default p-4 gap-4 flex flex-row shadow-lg bg-white z-[10] rounded-xl text-center  pointer-events-none text-black top-[8%] select-none transform translate-x-1/2 translate-y-1/2"
        style={{
          y: drivenY,
          rotate: drivenRotation,
          x: drivenX,
        }}
      >
        {/* inside of card  */}
        <div
          id="illustration"
          className="w-full h-full ! rounded-xl relative overflow-hidden z-10 flex flex-col"
        >

          <div className="flex flex-col place-items-center w-full relative h-[70%]">
        
              {/* ANCHOR NAME 1 out of whatever card youre on */}
              <div
                id="metrics"
                className="relative p-4 z-[2] flex place-items-center place-content-center w-full justify-between items-baseline"
              >

                <p id="location" className="text-[25px] font-bold w-max h-max">
                  {city}
                </p>

                {/* number of cards out of 50 */}
                <div className="rounded-xl bg-gradient-to-t from-cyan-400 to-green-400 px-3 w-max h-max">
                  <span className="text-[15px]">
                    {id}
                  </span>
                  <span className="">
                    /<span className="">{lenofDestinationSet}</span>
                  </span>
                </div>

              </div>

              {/* ANCHOR the image of match */}
                <div className="w-[95%] flex place-items-center rounded-lg relative h-full">
                  {showMobilePro === false && showMobileCon === false && showMobileDescription === false && (
                   <>
                   
                    {illustration.length > 10 && (
                        <Image
                          priority
                          className="rounded w-full absolute h-full object-cover"
                          // src={data.illustration || placeholderImg}
                          src={illustration}
                          fill
                          sizes="100%"
                          alt="car"
                        />
                      )}

                   </>
                   )}

                   {showMobileDescription && (
                     <>
                     <div className="w-full h-[120px] pointer-events-auto no-scrollbar overflow-y-scroll">
                      <div className="w-full h-full">
                        <p>{description}</p>
                      </div>
                     </div>
                     </>
                   )}

                  {showMobilePro && (
                     <>
                     <div className="w-full h-[120px] pointer-events-auto no-scrollbar overflow-y-scroll">
                      <div className="w-full h-full">
                        <p id="pros" className="text-[15px] w-full text-left font-bold">
                          Pros
                        </p>
                         <p className="w-full h-[1px] bg-gray-200"></p>
                          {pros.slice(0, 5).map((pro, index) => {
                            return <p key={index} className="text-[15px] flex gap-2"><Dot/> {pro}</p>;
                          })}
                      </div>
                     </div>
                     </>
                   )}

                    {showMobileCon && (
                     <>
                     <div className="w-full h-[120px] pointer-events-auto no-scrollbar overflow-y-scroll">
                      <div className="w-full h-full">
                        <p id="pros" className="text-[15px] w-full text-left font-bold">
                          Cons
                        </p>
                        <p className="w-full h-[1px] bg-gray-200"></p>
                          {cons.slice(0, 5).map((con, index) => {
                            return <p key={index} className="text-[15px] flex gap-2"><Dot/> {con}</p>;
                          })}
                      </div>
                     </div>
                     </>
                   )}
                </div>
          
          </div>


          {/* ANCHOR bottom of card */}
          <div className="h-[30%] p-4 w-full  z-[2]  flex flex-col gap-4 leading-tight justify-evenly"
            id="locationWrapper"
          >
              {/* ANCHOR location/full */}
              <div className="w-max h-max flex gap-2 place-items-center place-content-center">
                <MapPin size={15} className="text-muted-foreground"/> 
                <p id="location" className="text-[15px] text-muted-foreground w-max h-max">
                  {city}, {country}
                </p>
              </div>  
 
              {/* ANCHOR Pros and Cons */}
              <div className="w-full h-max">
            
                  <div className="pointer-events-auto text-[12px] flex gap-4 place-items-center place-content-center">
                    
                    <button onClick={showMobileDescriptionHandler} className="font-bold w-max flex place-items-center gap-2 shadow-lg  px-3 py-2 rounded-lg">
                      Bio
                    </button>
                    
                    <button onClick={showMobileProsHandler}  className="font-bold w-max flex place-items-center gap-2 bg-gradient-to-t from-cyan-400/30 to-green-400/30 text-green-400 hover:text-white hover:from-cyan-400 hover:to-green-400 px-3 py-2 rounded-lg">
                      <Laugh size={20} className=""/>
                      Pros
                    </button>
                    
                    <button onClick={showMobileConsHandler} className="font-bold w-max flex place-items-center gap-2 bg-gradient-to-t from-red-400/30 to-orange-400/30 text-red-400 hover:text-white hover:from-red-400 hover:to-orange-400 px-3 py-2 rounded-lg">
                      <Frown size={20} className=""/>
                      Cons
                    </button>
                  
                  </div>

              </div>
        
          </div>



        </div>
        {/* images end */}

        {/* info */}
        {/* <motion.div
          id="info"
          className=" w-[300px] h-full rounded-xl top-0 overflow-hidden z-10"
        >
          <div
            id="benefitsWrapper"
            className="h-full w-full text-left rounded p-4 z-[2] text-black flex flex-col gap-2 place-items-start leading-tight"
          >
    
            {showFullDescription === false && showPros === false && showCons === false && (
                <>
                <p id="description" className="text-[15px] font-bold">
                  Bio
                </p>

                <p className="w-full h-[1px] bg-gray-200"></p>
                <p className="text-[15px] text-muted-foreground">{description}</p>
              </>
            )}

            {showFullDescription && (
              <>
                <p id="description" className="text-[15px] font-bold">
                  Bio
                </p>

                <p className="w-full h-[1px] bg-gray-200"></p>
                <p className="text-[15px] text-muted-foreground">{description}</p>
              </>
            )}

            {showPros && (
              <>
                <p id="pros" className="text-[15px] font-bold">
                  Pros
                </p>
                <p className="w-full h-[1px] bg-gray-200"></p>
                {pros.slice(0, 5).map((pro) => {
                  return <p className="text-[15px] flex gap-2"><Dot/> {pro}</p>;
                })}
              </>
            )}

            {showCons && (
              <>
                <p id="cons" className="text-[15px] font-bold">
                  Cons
                </p>
                <p className="w-full h-[1px] bg-gray-200"></p>
                {cons.slice(0, 5).map((con) => {
                  return <p className="text-[15px] flex gap-2"><Dot/> {con}</p>;
                })}
              </>
            )}

          </div>

          <p className="absolute bottom-10 text-muted-foreground right-10 text-[8px]">
            Cityswipe
          </p>
        </motion.div> */}

      </motion.div>

      <motion.div
        id={`cardDriverWrapper-${id}`}
        className={`absolute w-full aspect-[100/150] ${
          !isDragging ? "hover:cursor-grab" : ""
        }`}
        drag="x"
        dragSnapToOrigin
        dragElastic={isMobile ? 0.2 : 0.06}
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) => {
          const offset = info.offset.x;

          if (offset < 0 && offset < offsetBoundary * -1) {
            setIsDragOffBoundary("left");
          } else if (offset > 0 && offset > offsetBoundary) {
            setIsDragOffBoundary("right");
          } else {
            setIsDragOffBoundary(null);
          }
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          setIsDragOffBoundary(null);
          const isOffBoundary =
            info.offset.x > offsetBoundary || info.offset.x < -offsetBoundary;
          const direction = info.offset.x > 0 ? "right" : "left";

          if (isOffBoundary) {
            setDirection(direction);
          }
        }}
        style={{ x }}
      ></motion.div>

      {/* debug for pexals */}
      {/* <Button className="fixed top-0 right-0 z-50" onClick={() => findPhotos()}>Pexals</Button> */}
    </>
  );
};

export default DestinationCard;
