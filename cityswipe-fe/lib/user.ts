import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import prisma from "./db";

export const requireUser = cache(async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const email = user.emailAddresses.find(address => address.id === user.primaryEmailAddressId)
    ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("An email address is required to use CitySwipe.");

  const profile = {
    email,
    name: user.fullName,
    username: user.username,
    profileImg: user.imageUrl,
  };

  return prisma.user.upsert({
    where: { id: user.id },
    create: { id: user.id, ...profile },
    update: profile,
  });
});
