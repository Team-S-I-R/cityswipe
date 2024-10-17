"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, Map, Plus, X } from "lucide-react";
import { useCitySwipe } from "../citySwipeContext";
import Image from "next/image";
import { useState } from "react";
import {
  streamConversation,
  getConversationHistory,
  Message,
  streamFlirtatiousConversation,
  makeItinerary,
} from "../actions";
import { useEffect } from "react";
import { readStreamableValue } from "ai/rsc";
import { ArrowUp } from "lucide-react";
import { savedDestination } from "../../api/savedDestination.api";
import { DestinationItem } from "@/lib/destination.type";
import placeholderimg from "../assets/imgs/white.png";
import { motion, AnimatePresence } from "framer-motion";
import { preprompts } from "./preprompts";
import SparklesText from "@/components/magicui/sparkles-text";


export default function Chat({matches}: any) {

    const [conversation, setConversation] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const { selectedMatch, setSelectedMatch } = useCitySwipe();
    const { selectedCompatibility } = useCitySwipe();
    const { clearConversation, setClearConversation } = useCitySwipe();
    const { userdata, setUserData } = useCitySwipe();
    const { usermatches, setUserMatches } = useCitySwipe();
    const {chatImg, setChatImg} = useCitySwipe();
    const { selectedBio, setSelectedBio } = useCitySwipe();
    const { selectedPros, setSelectedPros } = useCitySwipe();
    const { selectedCons, setSelectedCons } = useCitySwipe(); 
    const { addingItemToItinerary, setAddingItemToItinerary } = useCitySwipe();
    const { newItineraryItem, setNewItineraryItem } = useCitySwipe();
    const [itineraryModalOpen, setItineraryModalOpen] = useState<boolean>(false);
    const [wantsItinerary, setWantsItinerary] = useState<boolean>(false);
  

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  // const [genItinerary, setGenItinerary] = useState({
  //     id: 0,
  //     title: "",
  //     itinerary: {},
  //     packing_list: "",
  //     cultural_info: {},
  //     additional_comments: "",
  // });

  const [currentMessegeType, setCurrentMessegeType] = useState<string>("");

  useEffect(() => {
    if (clearConversation && clearConversation > 0) {
      setConversation([]);
      setClearConversation?.(0);
    }
  }, [clearConversation, setClearConversation]);

  useEffect(() => {
    setConversation([]);
    setClearConversation?.(0);
  }, [selectedMatch, setClearConversation]);

  const startChat = async () => {
    const split = selectedMatch?.split(" ");
    console.log(split);
    console.log(selectedMatch);

    // this will handle normal conversation
    if (wantsItinerary != true) {
      const { messages, newMessage, type } =
        await streamFlirtatiousConversation( split == undefined ? "" : split[0], split == undefined ? "" : split[1],
          [...conversation, { role: "user", content: input, type: "message" }]
        );

      console.log(newMessage);

      let textContent = newMessage;
      setCurrentMessegeType(type);

      
      setConversation([
        ...messages,
        { role: "assistant", content: textContent, type: "message" },
      ]);

      // for await (const delta of readStreamableValue(newMessage)) {
      //   textContent = `${textContent}${delta}`;

      //   setConversation([
      //     ...messages,
      //     { role: "assistant", content: textContent, type: "message" },
      //   ]);
      // }

  

      setInput(""); // Clear the input field after submitting
    }

    // this will handle itinerary specifically
    // if (wantsItinerary != false) {

    //     const itineraryprompopt = 'Hi, can you make me an itinerary for my trip to' + " " + selectedMatch
    //     await setInput(itineraryprompopt);

    //     const { newMessage, type } = await makeItinerary(split == undefined ? "" : split[0], split == undefined ? "" : split[1], [
    //         { role: "user", content: input, type: "itinerary" },
    //     ]);

    //     const textContent = newMessage;
    //     setCurrentMessegeType(type);

    //     console.log("nmessage: ", textContent);

    //     try {
    //         const itineraryfull = JSON.parse(textContent);

    //         let generatedItinerary = {
    //             id: Math.floor(Math.random() * 1000000),
    //             title: itineraryfull.title,
    //             itinerary: itineraryfull.itinerary,
    //             packing_list: itineraryfull.packing_list,
    //             cultural_info: itineraryfull.cultural_info,
    //             additional_comments: itineraryfull.additional_comments

    //         };

    //         console.log("itinerary: ", generatedItinerary);
    //         console.log("itinerary id: ", generatedItinerary.id);
    //         console.log("itinerary itinerary: ", generatedItinerary.itinerary);
    //         console.log("itinerary packing_list: ", generatedItinerary.packing_list);
    //         console.log("itinerary cultural_info: ", generatedItinerary.cultural_info);

    //         setGenItinerary({
    //             id: generatedItinerary.id,
    //             title: generatedItinerary.title,
    //             itinerary: generatedItinerary.itinerary,
    //             packing_list: generatedItinerary.packing_list,
    //             cultural_info: generatedItinerary.cultural_info,
    //             additional_comments: generatedItinerary.additional_comments ,
    //         });

    //         setWantsItinerary(false);

    //     } catch (error) {
    //         console.error(`Error in fetching itinerary for ${selectedMatch}:`, error);
    //     }
    // }
  };

    const handleUserPrePrompt = (text: any) => {
        setInput(text);
    }

    const handleAddingItemToItinerary = (text: any) => {

        console.log("adding item....");
        console.log("text: ", text);
        setNewItineraryItem?.(text);
        console.log("adding item is true now....");
        setAddingItemToItinerary?.(true);
        
    }
    
    
    // import saved global state city

  return (
    <>
      <div className="relative hidden sm:flex px-[10%] text-[14px] flex-col place-content-center place-items-center w-full h-[100dvh]">
        <div className="absolute  top-0 w-full p-[1em] flex justify-between place-items-center p-5">
          {selectedMatch == "" ? (
            <h2 className="select-none">
              You are a{" "}
              <span className="text-green-400 font-bold">
                {usermatches?.[0]?.compatibility}%
              </span>{" "}
              match with <strong>{usermatches?.[0]?.city}</strong>!
            </h2>
          ) : (
            <h2 className="select-none">
              You are a{" "}
              <span className="text-green-400 font-bold">
                {selectedCompatibility}%
              </span>{" "}
              match with <strong>{selectedMatch}</strong>!
            </h2>
          )}
        </div>

        {conversation.length < 1 && (
          <>
            <div className="flex  flex-col select-none gap-1 place-items-center w-full">
              {selectedMatch == "" ? (
                <>
                  <div className="w-full flex justify-between gap-4 place-items-start pt-10">
                    <div className="flex w-[70%] gap-2 flex-col">
                      <motion.span
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75 }}
                        className="font-bold text-2xl"
                      >
                        <SparklesText
                          className="text-3xl"
                          colors={{ first: "#22d3ee", second: "#4ade80" }}
                          text={`You are a ${usermatches?.[0]?.compatibility}% match with ${usermatches?.[0]?.city}!`}
                        />
                      </motion.span>

                      <motion.p className="w-full text-[12px]">
                        <span className="font-bold">Bio:</span>{" "}
                        {usermatches?.[0]?.description}
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-[60px] h-[60px] rounded-full flex place-items-end place-content-end"
                    >
                      <Image
                        className="rounded-full h-full  w-full object-cover"
                        src={usermatches?.[0]?.illustration || placeholderimg}
                        sizes="100%"
                        width={30}
                        height={30}
                        alt=""
                      />
                    </motion.div>
                  </div>

                                <div className="flex w-full justify-between">

                                <div className="my-2">

                                    <p className="font-bold">Some of the <span className="text-green-400">pros</span> of this city are:</p>

                                    {userdata?.[0]?.pros?.slice(0, 3).map((pro: any, index: number) => (
                                        <motion.div 
                                        initial={{ opacity: 0, y: 100 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.75 }}
                                        key={index} className="flex gap-2 my-2">
                                            <div className="w-[10px] h-[10px] rounded-full bg-green-400"></div>
                                            <p className="text-[12px]">{pro}</p>
                                        </motion.div>
                                    ))}
                                </div>

                    <div className="my-2">
                      <p className="font-bold">
                        Some of the <span className="text-red-400">cons</span>{" "}
                        of this city are:
                      </p>

                      {userdata?.[0]?.cons
                        ?.slice(0, 3)
                        .map((con: any, index: number) => (
                          <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75 }}
                            key={index}
                            className="flex gap-2 my-2"
                          >
                            <div className="w-[10px] h-[10px] rounded-full bg-green-400"></div>
                            <p className="text-[12px]">{con}</p>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  <div className="w-full mt-14 place-content-center flex flex-col h-max no-scrollbar  overflow-x-scroll">
                    <motion.p
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75 }}
                      className="font-bold text-xl"
                    >
                      Suggested Questions to ask
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.5 }}
                      className="p-2 w-full place-content-center justify-between h-max flex gap-2 "
                    >
                      <motion.div
                        onClick={() =>
                          handleUserPrePrompt(
                            preprompts[0].prompt + " " + selectedMatch + "?"
                          )
                        }
                        className="cursor-pointer hover:bg-gray-100/50 flex w-[32%] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[150px] h-max"
                      >
                        <motion.div className="w-max">
                          <p>{preprompts[0].name}</p>
                        </motion.div>
                      </motion.div>

                      <motion.div
                        onClick={() =>
                          handleUserPrePrompt(
                            preprompts[1].prompt + " " + selectedMatch + "?"
                          )
                        }
                        className="cursor-pointer hover:bg-gray-100/50 flex w-[32%] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[150px] h-max"
                      >
                        <motion.div className="w-max">
                          <p>{preprompts[1].name}</p>
                        </motion.div>
                      </motion.div>

                      <motion.div
                        onClick={() =>
                          handleUserPrePrompt(
                            preprompts[2].prompt + " " + selectedMatch + "?"
                          )
                        }
                        className="cursor-pointer hover:bg-gray-100/50 flex w-[32%] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[150px] h-max"
                      >
                        <motion.div className="w-max">
                          <p>{preprompts[2].name}</p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>

                  <p className="text-muted-foreground text-[10px]">
                    By clicking on these suggested questions and then pressing
                    the green and white arrow button below, you will receive the
                    answers you seek from Cityswipe. Always do your own due
                    diligence before making any big decisions.
                  </p>

                  <p>or</p>

                  <p className="flex gap-2 place-items-center">
                    Ask any other questions you may have below{" "}
                    <ArrowDown className="w-[15px] h-[15px]" />
                  </p>
                </>
              ) : (
                <>
                  <div className="w-full flex justify-between gap-4 place-items-start pt-10">
                    <div className="flex w-[70%] gap-2 flex-col ">
                      <motion.span
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75 }}
                        className="font-bold text-2xl"
                      >
                        <SparklesText
                          className="text-3xl"
                          colors={{ first: "#22d3ee", second: "#4ade80" }}
                          text={`You are a ${selectedCompatibility}% match with ${selectedMatch}!`}
                        />
                      </motion.span>

                      <motion.p className="w-full text-[12px]">
                        <span className="font-bold">Bio:</span> {selectedBio}
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-[60px] h-[60px] rounded-full flex place-items-end place-content-end"
                    >
                      <Image
                        className="rounded-full h-full w-full object-cover"
                        src={chatImg || placeholderimg}
                        sizes="100%"
                        width={30}
                        height={30}
                        alt=""
                      />
                    </motion.div>
                  </div>

                            <div className="flex w-full justify-between">
                                
                                <div className="my-2">
    
                                    <p className="font-bold">Some of the <span className="text-green-400">pros</span> of this city are:</p>
    
                                    {selectedPros?.slice(0, 3).map((pro, index) => (
                                        <motion.div 
                                        initial={{ opacity: 0, y: 100 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.75 }}
                                        key={index} className="flex gap-2 my-2">
                                            <div className="w-[10px] h-[10px] rounded-full bg-green-400"></div>
                                            <p className="text-[12px]">{pro}</p>
                                        </motion.div>
                                    ))}
                                </div>
    
                                <div className="my-2">
    
                                    <p className="font-bold">Some of the <span className="text-red-400">cons</span> of this city are:</p>
    
                                    {selectedCons?.slice(0, 3).map((con, index) => (
                                        <motion.div 
                                        initial={{ opacity: 0, y: 100 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.75 }}
                                        key={index} className="flex gap-2 my-2">
                                            <div className="w-[10px] h-[10px] rounded-full bg-red-400"></div>
                                            <p className="text-[12px]">{con}</p>
                                        </motion.div>
                                    ))}
                                </div>
    
                            </div>
                
    
                            <div className="w-full mt-4 place-content-center flex flex-col h-max no-scrollbar  overflow-x-scroll">
    
                                <motion.p 
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.75 }}
                                className="font-bold text-xl">
                                    Suggested Questions to ask
                                </motion.p>
    
    
                                <motion.div 
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5 }}
                                className="p-2 w-full place-content-center justify-between h-max flex gap-2 ">
                                    <motion.div onClick={() => handleUserPrePrompt(preprompts[0].prompt + " " + selectedMatch + "?")} className="cursor-pointer hover:bg-gray-100/50 flex w-[32%] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[150px] h-max">
                                        
                                        <motion.div className="w-max">
                                            <p>{preprompts[0].name}</p>
                                        </motion.div>
                                    
                                    </motion.div>
                                
                                    <motion.div onClick={() => handleUserPrePrompt(preprompts[1].prompt + " " + selectedMatch + "?")} className="cursor-pointer hover:bg-gray-100/50 flex w-[32%] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[150px] h-max">
                                        
                                        <motion.div className="w-max">
                                            <p>{preprompts[1].name}</p>
                                        </motion.div>
                                    
                                    </motion.div>
    
                                    <motion.div onClick={() => handleUserPrePrompt(preprompts[2].prompt + " " + selectedMatch + "?")} className="cursor-pointer hover:bg-gray-100/50 flex w-[32%] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[150px] h-max">
                                        
                                        <motion.div className="w-max">
                                            <p>{preprompts[2].name}</p>
                                        </motion.div>
                                    
                                    </motion.div>
                                </motion.div>
    
    
                            </div>
    
                            <p className="text-muted-foreground text-[10px]">By clicking on these suggested questions and then pressing the green and white arrow button below, you will receive the answers you seek from Cityswipe. Always do your own due diligence before making any big decisions.</p>
    
                            <p>or</p>
    
                            <p className="flex gap-2 place-items-center">Ask any other questions you may have below <ArrowDown className="w-[15px] h-[15px]"/></p>
                            
                            </>
                        )}


                    </div>
                    
                </>
            )}
  


        {conversation.length > 0 && (
          <>
            <div
              id="chat-container"
              className=" flex flex-col w-full h-[80vh] no-scrollbar overflow-y-scroll "
            >
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`min-w-[20%] max-w-[70%] h-max flex ${
                    message.role === "user"
                      ? "place-self-end"
                      : "place-self-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Image
                      src={chatImg || placeholderimg}
                      sizes="100%"
                      width={30}
                      height={30}
                      className="object-cover w-[30px] h-[30px] rounded-full my-3"
                      alt=""
                    />
                  )}

                  <div className="flex gap-2 flex-col w-full h-max">
                    <div
                      className={`w-full m-2 rounded-md p-2 ${
                        message.role === "user" ? "bg-cyan-300" : "bg-green-300"
                      }`}
                      key={index}
                    >
                      <span className="font-bold w-max">
                        {message.role === "user"
                          ? `${userdata?.name?.split(" ")[0]}`
                          : `${selectedMatch}`}
                        :
                      </span>

                      <span> </span>

                      <span className="w-max">{message.content}</span>
                    </div>

                                    {message.role === 'assistant' && (
                                        <>
                                            <div className="w-full h-[1px] bg-gray-300"></div>
                                            <div onClick={() => handleAddingItemToItinerary(message.content)} className="flex w-max gap-1 place-items-center place-content-center text-gray-300 hover:text-gray-800 cursor-pointer">
                                                <Plus/>
                                                <p>
                                                    Add to itinerary
                                                </p>

                                            </div>

                                        </>
                                    )}

                                </div>



                                {message.role === 'user' && (
                                    <Image src={userdata?.profileImg || placeholderimg} sizes="100%" width={30} height={30} className="object-cover ml-4 my-3 w-[30px] h-[30px] rounded-full" alt="" />
                                )}
                                

                            </div>
                        ))} 

                                                

                    <div className="w-full flex flex-col gap-4 place-items-end py-3 h-max text-gray-500/60">
                        {/* <div className="w-full h-[1px] bg-gray-300 mt-3"></div> */}
                    </div>
             
                    </div>
                </>
            )}

        <div></div>

        <div className="absolute  flex justify-center px-5 gap-3 place-items-center bottom-0 w-full h-[9vh]">
          <div className=" py-1 flex gap-4 outline outline-primary/10 rounded-lg  px-4 w-[70%]">
            <Input
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  startChat();
                }
              }}
              className="outline-none border-0 focus:ring-0 focus-visible:ring-0 h-[35px]"
              autoFocus
            />
            <button
              className="scale-[80%] hover:scale-[95%] bg-gradient-to-t from-cyan-500 to-green-400 p-2 rounded-full"
              onClick={() => startChat()}
            >
              <ArrowUp className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/*  mobile */}
      <div className="relative text-[12px] flex sm:hidden  flex-col place-content-center place-items-center w-full h-[100dvh]">
        <div className="absolute border-b border-primary/20 top-0 w-full h-[6%] flex place-content-center place-items-center px-5">
          {selectedMatch == "" ? (
            <h2 className="select-none">
              You have matched with <strong>{usermatches?.[0]?.city}</strong>!
            </h2>
          ) : (
            <h2 className="select-none">
              You matched with <strong>{selectedMatch}</strong>!
            </h2>
          )}
        </div>

        {conversation.length < 1 && (
          <>
            <div className="flex flex-col select-none gap-2 place-items-center">
              <div className="w-[80px] h-[80px] rounded-full">
                <Image
                  className="object-cover w-full h-full rounded-full"
                  src={chatImg || placeholderimg}
                  sizes="100%"
                  width={30}
                  height={30}
                  alt=""
                />
              </div>

              {selectedMatch == "" ? (
                <>
                  <p className="text-center">
                    You matched with{" "}
                    <strong>{savedDestination.destinations[0]?.city}</strong>!
                  </p>
                  <p className="text-center">
                    Ask {usermatches?.[0]?.city} anything you would like to know
                  </p>
                </>
              ) : (
                <>
                  <p className="text-center">
                    You matched with <strong>{selectedMatch}</strong>!
                  </p>
                  <p className="text-center">
                    Ask {selectedMatch} anything you would like to know
                  </p>
                </>
              )}

              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.25 }}
                className="text-muted-foreground"
              >
                or
              </motion.p>

              <div className="w-full place-content-start lg:place-content-center flex h-max no-scrollbar  overflow-x-scroll">
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5 }}
                  className="p-3 w-max   h-max flex gap-2 "
                >
                  <motion.div
                    onClick={() =>
                      handleUserPrePrompt(
                        preprompts[0].prompt + " " + selectedMatch + "?"
                      )
                    }
                    className="cursor-pointer hover:bg-gray-100/50 flex w-[150px] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[80px] h-max"
                  >
                    <motion.div className="w-max">
                      <p>{preprompts[0].name}</p>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    onClick={() =>
                      handleUserPrePrompt(
                        preprompts[1].prompt + " " + selectedMatch + "?"
                      )
                    }
                    className="cursor-pointer hover:bg-gray-100/50 flex w-[150px] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[80px] h-max"
                  >
                    <motion.div className="w-max">
                      <p>{preprompts[1].name}</p>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    onClick={() =>
                      handleUserPrePrompt(
                        preprompts[2].prompt + " " + selectedMatch + "?"
                      )
                    }
                    className="cursor-pointer hover:bg-gray-100/50 flex w-[150px] text-center p-3 rounded-sm place-items-center place-content-center outline outline-[1px] min-h-[80px] h-max"
                  >
                    <motion.div className="w-max">
                      <p>{preprompts[2].name}</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </>
        )}

        {conversation.length > 0 && (
          <>
            <div
              id="chat-container"
              className=" flex flex-col w-[90%] h-[80vh] no-scrollbar overflow-y-scroll "
            >
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`min-w-[20%] max-w-[70%] h-max flex ${
                    message.role === "user"
                      ? "place-self-end"
                      : "place-self-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Image
                      src={chatImg || placeholderimg}
                      sizes="100%"
                      width={30}
                      height={30}
                      className="object-cover w-[30px] h-[30px] rounded-full"
                      alt=""
                    />
                  )}
                  <div
                    className={`w-full m-2 rounded-md p-2 ${
                      message.role === "user" ? "bg-cyan-300" : "bg-green-300"
                    }`}
                    key={index}
                  >
                    <span className="font-bold w-max">
                      {message.role === "user"
                        ? `${userdata?.name?.split(" ")[0]}`
                        : `${selectedMatch}`}
                      :
                    </span>
                    <span> </span>
                    <span className="w-max">{message.content}</span>
                  </div>
                  {message.role === "user" && (
                    <Image
                      src={userdata?.profileImg || placeholderimg}
                      sizes="100%"
                      width={30}
                      height={30}
                      className="object-cover w-[30px] h-[30px] rounded-full"
                      alt=""
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="absolute  flex justify-center px-5 gap-3 place-items-center bottom-0 w-full h-[9vh]">
          <div className=" py-1 flex gap-4 outline outline-primary/10 rounded-lg  px-4 w-full">
            <Input
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  startChat();
                }
              }}
              className="outline-none border-0 focus:ring-0 focus-visible:ring-0 h-[35px]"
              autoFocus
            />
            <button
              className="scale-[80%] hover:scale-[95%] bg-gradient-to-t from-cyan-500 to-green-400 p-2 rounded-full"
              onClick={() => startChat()}
            >
              <ArrowUp className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
