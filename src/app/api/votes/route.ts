import { prisma } from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const dbUser = await syncCurrentUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post id is required" },
        { status: 400 },
      );
    }

    // check if the vote already exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: dbUser.id,
          postId,
        },
      },
    });

    if (existingVote) {
      // remove vote (toggle)
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });
      return NextResponse.json({ voted: false });
    } else {
      // add vote (toggle)
      await prisma.vote.create({
        data: {
          userId: dbUser.id,
          postId,
        },
      });

      return NextResponse.json({ voted: true });
    }
  } catch (error) {
    console.error("Error toggling vote ", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
