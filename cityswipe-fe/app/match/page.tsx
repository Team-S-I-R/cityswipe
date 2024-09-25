"use client";

import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { DestinationCompletion, DestinationCards } from "./_components";
import { savedDestination as initialDestination } from "../../api/savedDestination.api";
import { getInitialSet } from "../../api/destinationSets.api";
import { useDestinationSetContext } from "../../context/destinationSetContext";
import { useEffect } from "react";
import { useSavedDestinationContext } from "../../context/savedDestinationContext";
import Header from "../cs-componets/header";
import Sidebar from "../cs-componets/sidebar";
import destination1 from "../assets/imgs/destination-img-1.jpg"
import destination2 from "../assets/imgs/destination-img-2.jpg";
import destination3 from "../assets/imgs/destination-img-3.jpg";
import destination4 from "../assets/imgs/destination-img-4.jpg";
import { useState } from "react";

const Match = () => {
  // "destination" is the list of destinations 
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const [_, setDestination] = useSavedDestinationContext();

  const initialDestinationSet = getInitialSet(0);

  useEffect(() => {
    setDestination(initialDestination);
    // setDestination(destination);
    // setDestination({
    //     id: 1,
    //     cards: destination.reverse(),
    // });
  }, []);

  const isCardStockEmpty = destinationSet.cards.length === 0;
  const destinationScreenVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 2, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: cubicBezier(0.7, 0, 0.84, 0) },
    },
  };

  // const testPexelsAPI = async () => {
  //   const client = createClient('8U6Se7vVT3H9tx1KPZAQTkDUSW0IKi3ldgBTVyh3W9NFF7roIpZxktzY');
  //   const searchQuery = 'Tokyo, Japan landscape';
  //   try {
  //     const response = await client.photos.search({ query: `${searchQuery}`, per_page: 1 });
  //     console.log("pexels query", searchQuery);
  //     if ('photos' in response && response.photos.length > 0) {
  //       const illustration = response.photos[0].src.landscape;
  //       console.log(searchQuery, "illustration URL:", illustration);
  //     } else {
  //       console.log("No photos found for the query.");
  //     }
  //   } catch (error) {
  //     console.error(`Error in fetching photo for ${searchQuery}:`, error);
  //   }
  // };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [destination1, destination2, destination3, destination4];

  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
  }, []);



  return (
    <>
 
      <main className="h-[100dvh] flex w-full mx-auto">
        
        {/* img debug
        <button className="absolute top-[50%] left-10 bg-red-500 text-white px-4 rounded-md z-[100]" onClick={testPexelsAPI}>
          test
        </button> */}

        <div className="flex w-[75px] h-full items-center justify-center">
          <Sidebar />
        </div>

        <div className="absolute inset-0 z-[-1] overflow-hidden w-screen h-screen">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.src}
                        alt={`Background ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
                <div className="h-full absolute inset-0 bg-gradient-to-b from-white via-white to-transparent"></div>
            </div>


        <AnimatePresence mode="wait">
          {!isCardStockEmpty ? (
            <>
            
            <motion.div
              // else (if the matching is not done) 
              key="destinationScreen1"
              id="destinationScreen"
              variants={destinationScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >

              <DestinationCards />
            </motion.div>

            </>
            /* if the matching is done! */
          ) : (
            <motion.div
              key="destinationScreen2"
              id="destinationCompletion"
              variants={destinationScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <DestinationCompletion />
            </motion.div>
          )}
        </AnimatePresence>

      </main>


    </>
  )
}

export default Match;