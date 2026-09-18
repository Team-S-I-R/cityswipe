import PricingClientElements from "./_components/pricingClientElements";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { isBillingConfigured } from "@/lib/stripe";

export default async function PricingPage() {
  const user = await currentUser();
  const subscription = user && isBillingConfigured
    ? await prisma.subscription.findUnique({ where: { userId: user.id } }) : null;
  return (
    <div className="w-full h-[100dvh] flex place-items-center place-content-center p-4 flex-col">
      <PricingClientElements status={subscription} planId={subscription} billingEnabled={isBillingConfigured} />
    </div>
  );
}
