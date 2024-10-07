"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getStripe from "@/utils/get-stripe";
import destination1 from "../../assets/imgs/destination-img-1.jpg";
import destination2 from "../../assets/imgs/destination-img-2.jpg";
import destination3 from "../../assets/imgs/destination-img-3.jpg";
import destination4 from "../../assets/imgs/destination-img-4.jpg";
import { useRouter } from "next/navigation";
import { useCitySwipe } from "@/app/citySwipeContext";
import { createSubscription, createCustomerPortal } from "../../actions";
import { getSubscription } from "@/app/match/_utils/checkSubscribed";
import Stripe from "stripe";

export default function PricingClientElements({ status, planId }: any) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [destination1, destination2, destination3, destination4];
  const router = useRouter();
  const { userdata, setUserData } = useCitySwipe();
  const { subscriptionStatus, setSubscriptionStatus } = useCitySwipe();
  const { subscriptionPlanId, setSubscriptionPlanId } = useCitySwipe();
  const [subscriptionDetails, setSubscriptionDetails] = useState<any | null>(
    null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSubscriptionStatus?.(status?.status);
    setSubscriptionPlanId?.(planId?.planId);
  }, [status?.status, planId?.planId, setSubscriptionStatus, setSubscriptionPlanId]);

  useEffect(() => {
    if (subscriptionStatus === "active" && subscriptionPlanId) {
      fetchSubscriptionDetails();
    }
  }, [subscriptionStatus, subscriptionPlanId]);

  const fetchSubscriptionDetails = async () => {
    try {
      const details = await getSubscription();
      setSubscriptionDetails(details);
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    }
  };

  const handleFreePlan = () => {
    router.push("/quiz");
  };

  const pricingPlans = [
    {
      title: "Free",
      price: "$0",
      description: "Perfect for casual travelers",
      features: [
        "8 city matches per quiz",
        "Itinerary planning for 1 city match",
        "100 chat messages",
      ],
    },
    {
      title: "Pro Monthly",
      price: "$5",
      description: "Ideal for serious travelers",
      features: [
        "Unlimited city matches",
        "Itinerary planning for all city matches",
        "Unlimited chat messages",
      ],
    },
    {
      title: "Pro Yearly",
      price: "$50",
      description: "Best value for frequent travelers",
      features: [
        "All Pro Monthly features",
        "Save $10 compared to monthly plan",
      ],
    },
  ];

  return (
    <div className="container w-full h-max py-12 flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-[-1] overflow-hidden w-screen h-screen">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={`Background ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="h-full absolute inset-0 bg-gradient-to-b from-white via-white to-transparent"></div>
      </div>

      {subscriptionStatus === "active" && (
        <>
          <h1 className="text-4xl font-bold text-center mb-12 relative z-10">
            Manage your subscription
          </h1>

          <div className="grid h-max max-h-[50dvh] overflow-y-scroll place-items-center no-scrollbar grid-cols-1 gap-8 max-w-6xl w-full relative z-10">
            <Card className="flex flex-col max-w-3xl">
              <CardHeader>
                <CardTitle>My Subscription</CardTitle>
                <CardDescription>
                  If you would like, you can deactivate your Cityswipe subscription.
                  <br />
                  <em>
                    Theses changes will take affect at the end of the current
                    billing period.
                  </em>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {subscriptionDetails ? (
                  <div>
                    <p><b>Plan:</b> {subscriptionDetails.plan}</p>
                    <p><b>Status:</b> {subscriptionDetails.status}</p>
                    <p>
                    <b>Current Period End:{" "}</b>
                      {subscriptionDetails.current_period_end
                        ? new Date(
                            subscriptionDetails.current_period_end * 1000
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    {/* <p>Amount: ${subscriptionDetails.amount / 100} / {subscriptionDetails.interval}</p> */}
                  </div>
                ) : (
                  <p>Loading subscription details...</p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-t from-cyan-500 to-green-400"
                  onClick={() => createCustomerPortal()}
                >
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}

      {subscriptionStatus !== "active" && (
        <>
          <h1 className="text-4xl font-bold text-center mb-12 relative z-10">
            Choose Your Plan
          </h1>

          <div className="grid h-max max-h-[50dvh] overflow-y-scroll no-scrollbar grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-3xl font-bold mb-4">
                    {plan.price}
                    <span className="text-sm font-normal">
                      {plan.price !== "$0"
                        ? plan.title === "Pro Yearly"
                          ? "/year"
                          : "/month"
                        : ""}
                    </span>
                  </p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-t from-cyan-500 to-green-400"
                    onClick={() =>
                      plan.title !== "Free"
                        ? createSubscription(plan.title)
                        : handleFreePlan()
                    }
                  >
                    {plan.title === "Free" ? "Get Started" : "Choose Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
