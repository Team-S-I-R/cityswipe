'use client'

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Header from "@/app/cs-componets/header";
import SparklesText from "@/components/magicui/sparkles-text";
import { searchGiphyGif } from "@/app/actions";
import { set } from "date-fns";
import dImg1 from '../../assets/imgs/destination-img-1.jpg'
import Link from "next/link";

export default function SharedItineraryPage(userId: any) {
    
    const pathname = usePathname();
    const [itineraryData, setItineraryData] = useState<any>([]);
    const [itineraryIsLoading, setItineraryIsLoading] = useState<boolean>(true);
    const [usersName, setUsersName] = useState<any>("");
    const [usersMatches, setUsersMatches] = useState<any>([
        { city: "New York", country: "USA", compatibility: 85, illustration: "https://images.pexels.com/photos/27079241/pexels-photo-27079241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
        { city: "Tokyo", country: "Japan", compatibility: 90, illustration: "https://images.pexels.com/photos/27079241/pexels-photo-27079241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
        { city: "Paris", country: "France", compatibility: 80, illustration: "https://images.pexels.com/photos/27079241/pexels-photo-27079241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
        { city: "Sydney", country: "Australia", compatibility: 75, illustration: "https://images.pexels.com/photos/27079241/pexels-photo-27079241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
        { city: "Barcelona", country: "Spain", compatibility: 78, illustration: "https://images.pexels.com/photos/1231231/pexels-photo-1231231.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
        { city: "Cape Town", country: "South Africa", compatibility: 82, illustration: "https://images.pexels.com/photos/2342342/pexels-photo-2342342.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
        { city: "Rio de Janeiro", country: "Brazil", compatibility: 88, illustration: "https://images.pexels.com/photos/3453453/pexels-photo-3453453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
        { city: "Dubai", country: "UAE", compatibility: 77, illustration: "https://images.pexels.com/photos/4564564/pexels-photo-4564564.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" }
    ]);
    // const [usersMatches, setUsersMatches] = useState<any>({});
    
    // NOTE: When we get the production level giphy api , This can get commented.
    const [gifs, setGifs] = useState<any>([
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXB4eDYydTNkZXNjejZjemsxbGZtazE4dzh0YXNiMWozdDZja29idyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KGwTZd1qr8hsSKsrFI/giphy.webp',
      'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTUzdDJ6Z3hoZzAxaDFwaDBrajJ6dGR4Y2s4aDFhY2s5M3MwOHJmMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WKMJ7ciFwp6OJk4mcS/giphy.webp',
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTNocnkzMmIxZ201am9uNDRkaXJuNmpvZ3FqcW56cjNrYTFzOXFycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kEo6yQKbCB09zr8WIo/giphy.webp',
      'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHoxcmcydXVha2ZmZ295aWtuaWEyZjBjZTJ6M2FsdXYxb2Y3Z3l2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d8Vheey9K53m17OyPI/giphy.webp',
    ]);
    
    // NOTE: When we get the production level giphy api , This can get uncommented.
    // const [gifs, setGifs] = useState<any>([]);
    console.log(userId);

    async function handleSubmit (uId: string) { 

        try {
          const response = await fetch('/api/sharedItineraryData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: uId,
            })
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
    
          const data = await response.json();
          const itinerary = data?.itinerary;
          const matches = data?.matches;
          console.log('data: ', data);

          setItineraryData(itinerary);
          setUsersName(data?.usersName.split(' ')[0].charAt(0).toUpperCase() + data?.usersName.split(' ')[0].slice(1));
          // setUsersMatches(matches);

          console.log("matches: ", matches);

          // get gifs
          // NOTE: When we get the production level giphy api , This can get uncommented and it will search gipy.
          // it already works

          // const allGifs: any[] = [];
      
          // for (let i = 0; i < matches.length; i++) {
          //   const query = matches?.[i]?.city + " " + "travel";
          //   console.log(`query: ${query}`);
          //   const data = await searchGiphyGif(query, 5);
          //   allGifs.push(data);
          //   console.log(`gifs set ${i + 1}: `, data);
          // }
          
          // setGifs(allGifs);
          // console.log("all gifs: ", allGifs);

          setItineraryIsLoading(false);
    
        } catch (error) {   
        }
    
    };



    useEffect(() => {
          handleSubmit(userId as string);
          console.log("handled")
    }, []);

    return (
        <>
        <div className="flex flex-col w-full h-[100dvh] place-items-center justify-between gap-6">

          <div className="w-full h-max relative flex place-content-center place-items-center">
            <Header/>
          </div>

          {/* NOTE: This is an easter egg, dont remove this, this doubles to give me the right spacing as far as the formattting of this page. */}
          <div className="text-transparent">
            <p>You found an easter egg!</p>              
          </div>
            
            {itineraryIsLoading === false && (
              
              <>
                <div className="w-full px-[5%] flex place-content-center place-items-center justify-between">
                  <div className="flex flex-col">
                        <h1 className="text-xl font-bold mb-2 text-muted-foreground">Explore</h1>
                        <SparklesText
                          className="text-5xl"
                          colors={{ first: "#22d3ee", second: "#4ade80" }}
                          text={`${usersName}'s Itinerary`}
                        />
                  </div>

                  <div>
                    <h1>{usersName} also matched with:</h1>
                  </div>
                </div>

                <div className="px-[5%] grid grid-cols-3 gap-8 h-[70%]">

                  {/* grid 1 */}
                  <div className="col-span-2 flex flex-col gap-4 overflow-y-scroll no-scrollbar">
                    
                    <div className="w-full h-max flex flex-col gap-6">

                        {gifs && gifs.length > 0 && (
                          <div className="w-full h-[300px] flex overflow-x-scroll no-scrollbar">
                            {gifs?.map((gif: any, index: number) => (
                              <div key={index} className="flex-none w-full h-full" style={{ backgroundImage: `url(${gif})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            ))}
                          </div>
                        )}
            
                  
                        {itineraryData && itineraryData.map((item: any) => (
                            <div key={item.id} className={`bg-[${item.props.backgroundColor}] text-${item.props.textAlignment}`}>
                                <p className={` text-[${item.props.textColor}]`}>{item.text}</p>
                            </div>
                        ))}

                    </div>

                  </div>

                    <div className="w-full h-full flex flex-col justify-between gap-4">

                  
                        <div className="col-span-1 max-h-[320px] py-1 overflow-y-scroll no-scrollbar mx-2 gap-2 flex flex-col">
                          
                          {usersMatches && usersMatches.map((item: any) => (
                            <div key={item.id} 
                              className={`h-max rounded-2xl flex place-items-center gap-2 justify-between`} style={{ background: `linear-gradient(to right, #22d3ee, #4ade80 ${item.compatibility * 0.6}%, white)` }}
                              // style={{ backgroundSize: `${item.compatibility}% 100%` }}
                              >
                              
                              <div className="flex place-items-center gap-4">
                            
                                <div className="place-items-center flex pl-4 flex-col p-2 rounded text-white">
                                  <p className="text-xl font-bold">{item.compatibility}%</p>
                                  <p className="text-xs">Match</p>
                                </div>

                                <div className="flex flex-col gap-1 truncate py-1 h-max text-white">
                                  <p className="text-3xl font-bold">{item.city},</p>
                                  <p className="italic font-bold">{item.country}</p>
                                </div>
                              
                              </div>

                                {/* <div className="w-[100px] h-[100px] " style={{ backgroundImage: `url(${item.illustration})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div> */}
                            </div>
                          ))}         

                        </div>

                        <div style={{ backgroundImage: `url(${dImg1.src})`, backgroundSize: 'cover', backgroundPosition: "bottom" }} className={`my-4  rounded-lg p-3 flex flex-col gap-2 place-items-center place-content-center w-full h-max min-h-[100px]`}>
                          <h1 className="text-white text-xl">Want to find <strong>YOUR</strong> perfect match?</h1>
                          <Link href="/sign-up" target="_blank">
                            <button className="bg-gradient-to-t from-[#22d3ee] to-[#4ade80] text-white font-bold py-2 px-4 rounded">Sign up today!</button>
                          </Link>
                        </div>

                    </div>


                  
                </div>
              </>
            )}

        </div>
        </>
    )
  }