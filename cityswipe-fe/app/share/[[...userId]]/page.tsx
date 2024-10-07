'use client'

import { useEffect } from "react";
import { usePathname } from 'next/navigation';

export default function SharedItineraryPage() {
    
    const pathname = usePathname();
    const userId = pathname.split('/').pop();
    console.log(userId);

    async function handleSubmit ()  {

    
        try {
          const response = await fetch('/api/openai/coverletter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: "",
            })
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
    
          const data = await response.json();
    
        } catch (error) {   
        }
    
    
      };

    // function fetchItinerary(userId: string) {

    //     let allItineraryBlocks = prisma?.itinerary.findMany({
    //         where: {
    //             userId: userId
    //         }
    //     });
        
    //     return allItineraryBlocks;
    // }

    // useEffect(() => {
    //     if (userId) {
    //         fetchItinerary(userId as string);
    //     }
    // }, [userId]);

    return (
        <>
            <div>test</div>
        </>
    )
}