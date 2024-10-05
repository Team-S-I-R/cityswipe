
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import getStripe from "@/utils/get-stripe";
import destination1 from "../assets/imgs/destination-img-1.jpg";
import destination2 from "../assets/imgs/destination-img-2.jpg";
import destination3 from "../assets/imgs/destination-img-3.jpg";
import destination4 from "../assets/imgs/destination-img-4.jpg";
import { useCitySwipe } from '../citySwipeContext';
import PricingClientElements from './_components/pricingClientElements';
import { createSubscription } from './../actions';
import { createCustomerPortal } from './../actions';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

async function SubscriptionStatus () {

    const clerkUser = await currentUser();

    const sStatus = await prisma?.subscription?.findUnique({
        where: {
            userId: clerkUser?.id as string
        },
        select: {
            status: true
        }
    })

    return sStatus;
}

async function SubscriptionId () {

    const clerkUser = await currentUser();

    const sStatus = await prisma?.subscription?.findUnique({
        where: {
            userId: clerkUser?.id as string
        },
        select: {
            planId: true
        }
    })

    return sStatus;
}

export default async function PricingPage () {

    // ----------------------------------------------

    const status = await SubscriptionStatus();
    const subscriptionId = await SubscriptionId();

    return (
        <>
        <div className='w-full h-[100dvh] flex place-items-center place-content-center p-4 flex-col'>

           <PricingClientElements status={status} planId={subscriptionId} />
     
        </div>
        </>
       
    );
};


