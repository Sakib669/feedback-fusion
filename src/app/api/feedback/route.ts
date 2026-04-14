import { prisma } from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const dbUser = await syncCurrentUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { title, description, category } = body;

    const post = await prisma.post.create({
      data: {
        title,
        description,
        category,
        authorId: dbUser.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post ", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching post ", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
