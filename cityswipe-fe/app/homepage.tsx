"use client";

import { Button } from "@/components/ui/button";
import { useCitySwipe } from "./citySwipeContext";
import React, { useEffect, useState } from "react";
import quizQuestions from "./quiz-questions/questions";
import gsap from "gsap";
import destination1 from "./assets/imgs/destination-img-1.jpg";
import destination2 from "./assets/imgs/destination-img-2.jpg";
import destination3 from "./assets/imgs/destination-img-3.jpg";
import destination4 from "./assets/imgs/destination-img-4.jpg";
import { Heart } from "lucide-react";
import { Message } from "./actions";
import { useRouter } from "next/navigation";
import { useDestinationSetContext } from "../context/destinationSetContext";

export default function Hero() {
  // ANCHOR project variables
  const { isStarted, setIsStarted } = useCitySwipe();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [responses, setResponses] = useState<string[]>([]);
  // Responses for debuggin!
  // const [responses, setResponses] = useState<string[]>([
  //   "United States",
  //   "Luxury",
  //   "English",
  //   "Yes",
  //   "Summer",
  //   "Warm",
  //   "Beach",
  //   "Sprinting, Hiking, Camping, Swimming, Drawing",
  //   "Vegan",
  //   "Street food",
  //   "No",
  //   "No",
  // ]);
  const questionKeys = Object.keys(quizQuestions);
  const [updateHeart, setUpdateHeart] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const router = useRouter();
  const [loadingMatches, setLoadingMatches] = useState(false);
  // for pexals
  const [pexalsPhoto, setPexalsPhoto] = useState<string>("");
  const [cityCountryQuery, setCityCountryQuery] = useState<string>("");
  const { photoUrl, setPhotoUrl } = useCitySwipe();

  // ANCHOR animation handling

  const hoverAnimationEnter = (imgid: string) => {
    let id = "#" + imgid + "-img";

    if (imgid != "") {
      gsap.to(id, {
        opacity: 1,
        duration: 0.5,
      });
    }
  };

  const hoverAnimationLeave = (imgid: string) => {
    let id = "#" + imgid + "-img";
    if (imgid != "") {
      gsap.to(id, {
        opacity: 0,
        duration: 0.5,
      });
    }
  };

  useEffect(() => {
    const words = ["match", "with", "your", "destination"];
    let currentIndex = 0;

    const timer = setInterval(() => {
      hoverAnimationEnter(words[currentIndex]);
      currentIndex = (currentIndex + 1) % words.length;
    }, 3000);

    if (currentIndex === 3) {
      clearInterval(timer);
      currentIndex = 0;
      hoverAnimationEnter(words[currentIndex]);
    }

    return () => {
      clearInterval(timer); // Cleanup the timer if the component unmounts
      currentIndex = 0; // Reset the index when the component unmounts
    };
  }, [hoverAnimationEnter]);

  return (
    <>
      <div className="flex flex-col w-full place-items-center gap-6">
        <>
          <div className="z-[-1] top-0 left-0 w-screen h-screen absolute">
            <div className="absolute top-0 left-0 w-screen h-screen">
              <img
                id="match-img"
                className="opacity-1 w-full h-full object-cover"
                src={destination1.src}
                alt=""
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
            </div>

            <div className="absolute top-0 left-0 w-screen h-screen">
              <img
                id="with-img"
                className="opacity-0  w-full h-full object-cover"
                src={destination2.src}
                alt=""
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
            </div>

            <div className="absolute top-0 left-0 w-screen h-screen">
              <img
                id="your-img"
                className="opacity-0  w-full h-full object-cover"
                src={destination3.src}
                alt=""
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
            </div>

            <div className="absolute top-0 left-0 w-screen h-screen">
              <img
                id="destination-img"
                className="opacity-0  w-full h-full object-cover"
                src={destination4.src}
                alt=""
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
            </div>
          </div>

          <h2 className="select-none text-[14px]">
            <span className="font-bold">Cityswipe, </span>
            like Tinder, but for your vacations!
          </h2>

          <h1 className="text-5xl mb-3 w-[80%] font-bold flex gap-2 place-content-center select-none relative flex-wrap">
            <span
              id="match"
              onMouseOver={() => hoverAnimationEnter("match")}
              onMouseLeave={() => hoverAnimationLeave("match")}
              className="cursor-pointer"
            >
              Match{" "}
            </span>
            <span
              id="with"
              onMouseOver={() => hoverAnimationEnter("with")}
              onMouseLeave={() => hoverAnimationLeave("with")}
              className="cursor-pointer"
            >
              with{" "}
            </span>
            <span
              id="your"
              onMouseOver={() => hoverAnimationEnter("your")}
              onMouseLeave={() => hoverAnimationLeave("your")}
              className="cursor-pointer"
            >
              your{" "}
            </span>
            <span
              id="destination"
              onMouseOver={() => hoverAnimationEnter("destination")}
              onMouseLeave={() => hoverAnimationLeave("destination")}
              className="cursor-pointer"
            >
              destination
            </span>
          </h1>

          {/* QUIZ BUTTON */}

          <Button
            onMouseEnter={() => setUpdateHeart(true)}
            onMouseLeave={() => setUpdateHeart(false)}
            className="select-none text-[12px] hover:scale-[95%] hover:shadow-2xl bg-gradient-to-t from-cyan-500 to-green-400 flex place-items-center gap-2"
            onClick={() => router.push("/quiz")}
          >
            Get Started
            {updateHeart == false && (
              <span>
                <Heart className="w-2 h-2  " />
              </span>
            )}
            {updateHeart == true && <span>❤️</span>}
          </Button>
        </>

        {/* the quiz is in the quiz route now! */}
      </div>
    </>
  );
}
