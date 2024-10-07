'use client'

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

export default function SharedItineraryPage() {
    
    const pathname = usePathname();
    const userId = pathname.split('/').pop();
    const [itineraryData, setItineraryData] = useState<any>({});
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
          console.log('data: ', data);

          setItineraryData(data);
    
        } catch (error) {   
        }
    
    };

    useEffect(() => {
        handleSubmit(userId as string);
        console.log("handled")
    }, []);

    return (
        <>
        <div className="w-full h-[100dvh] p-8">

            <h1 className="text-3xl font-bold mb-4">Itinerary</h1>
            {itineraryData.itinerary && itineraryData.itinerary.map((item: any) => (
                <div key={item.id} className={`bg-[${item.props.backgroundColor}] text-${item.props.textAlignment}`}>
                    <p className={`text-[${item.props.textColor}]`}>{item.text}</p>
                </div>
            ))}

        </div>
        </>
    )
  }