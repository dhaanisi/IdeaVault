import { NextResponse } from "next/server";
import { auth } from "@repo/auth/server";
import {database} from "@repo/database";

export async function POST(req: Request) {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let dbUser = await database.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      dbUser = await database.user.create({
        data: { clerkId },
      });
    }

    const body = await req.json();
    const { title, content, tagIds } = body;

    const idea = await database.idea.create({
      data: {
        title,
        content,
        userId: dbUser.id,
        tags: {
          connect: (tagIds ?? []).map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json(idea);

}
