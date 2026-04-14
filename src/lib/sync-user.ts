import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export const syncCurrentUser = async () => {
  try {
    // get user data from cleck
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    // check if the user already exists
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (dbUser) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          image: clerkUser.imageUrl,
        },
      });
    } else {
      // create a new user in database
      // check if this is the first user-make them admin

      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;

      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName}`.trim(),
          image: clerkUser.imageUrl,
          role: isFirstUser ? "admin" : "user",
        },
      });
      console.log(`New user created: ${email} with role: ${dbUser.role}`);
      return dbUser;
    }
  } catch (error) {
    console.error("Error syncing user form Clerk: ", error);
    throw error;
  }
};
