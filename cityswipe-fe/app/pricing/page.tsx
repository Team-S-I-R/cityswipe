'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import destination1 from "../assets/imgs/destination-img-1.jpg";
import destination2 from "../assets/imgs/destination-img-2.jpg";
import destination3 from "../assets/imgs/destination-img-3.jpg";
import destination4 from "../assets/imgs/destination-img-4.jpg";

const PricingPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [destination1, destination2, destination3, destination4];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const pricingPlans = [
        {
            title: "Free",
            price: "$0",
            description: "Perfect for casual travelers",
            features: [
                "8 city matches per quiz",
                "itinerary planning for 1 city match",
                "1000 chat messages",
            ]
        },
        {
            title: "Pro",
            price: "$19.99",
            description: "Ideal for serious travelers",
            features: [
                "Unlimited city matches",
                "Advanced itinerary planning for all matches",
                "unlimited chat messages",
            ]
        }
    ];

    return (
        <div className="container w-full h-full py-12 flex flex-col items-center justify-center min-h-screen">
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
            <h1 className="text-4xl font-bold text-center mb-12 relative z-10">Choose Your Plan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
                {pricingPlans.map((plan, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{plan.title}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-3xl font-bold mb-4">{plan.price}<span className="text-sm font-normal">{plan.price !== "$0" ? "/month" : ""}</span></p>
                            <ul className="space-y-2">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-gradient-to-t from-cyan-500 to-green-400">{plan.title === "Free" ? "Get Started" : "Choose Plan"}</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PricingPage;
