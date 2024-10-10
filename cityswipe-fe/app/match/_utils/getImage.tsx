"use server"

import { createClient } from "pexels";

export const getImage = async (city:string, country:string) => {
   const client = createClient(
      "8U6Se7vVT3H9tx1KPZAQTkDUSW0IKi3ldgBTVyh3W9NFF7roIpZxktzY"
    );
    let illustration: string[] = [];

    const searchQuery = `${city}, landscape`;
    try {
      const response = await client.photos.search({
        query: `${searchQuery}`,
        per_page: 4,
      });
      if ("photos" in response && response.photos.length > 0) {
        // illustration = response.photos[0].src.landscape;
        response.photos.map((photo)=>{
          illustration.push(photo.src.landscape)
        })
      }
    } catch (error) {
      console.error(`Error in fetching photo for ${city}, ${country}:`, error);
    }
    return illustration
}