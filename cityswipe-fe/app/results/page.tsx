"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from '../cs-componets/header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Spinner } from "@/components/ui/spinner";
import getStripe from "@/utils/get-stripe";

const ResultPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (plan: string): Promise<void> => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { origin: "http://localhost:3000"},
      body: JSON.stringify({ plan: plan })
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    }
  };

  useEffect(() => {
    const fetchCheckoutSession = async (): Promise<void> => {
      if (!session_id) return;
      try {
        const res = await fetch(
          `/api/checkout_sessions?session_id=${session_id}`
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occurred while retrieving the session.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center bg-white rounded-lg p-6">
          <div className="pt-6">
            {/* <Spinner className="w-8 h-8" /> */}
            <p className="mt-2 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-sm mx-auto mt-4 text-center">
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Header />

      <div className="flex items-center justify-center min-h-screen">
        <div className="container mx-auto max-w-md text-center">
          {session.payment_status === "paid" ? (
            <div>
              <h1 className="text-4xl font-bold mb-12">Thank you for your purchase!</h1>
              <p className="mb-12">
                We have received your payment. You will receive an email with the
                order details shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-gradient-to-t from-cyan-500 to-green-400">
                  <a href="/">Home</a>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-12">Payment failed</h2>
              <p className="mb-12">
                Your payment was not successful. Please try again.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-t from-cyan-500 to-green-400">
                  Get Started Free
                </Button>
                <Button onClick={() => handleSubmit('Pro Monthly')} className="bg-gradient-to-t from-cyan-500 to-green-400">
                  Try Pro Monthly
                </Button>
                <Button onClick={() => handleSubmit('Pro Yearly')} className="bg-gradient-to-t from-cyan-500 to-green-400">
                  Try Pro Yearly
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultPage;
