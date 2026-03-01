import { NextResponse } from "next/server";
import { auth } from "@repo/auth/server";
import {database} from "@repo/database";

export async function POST(req: Request) {
    const { userId } = await auth();

    if(!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, tagIds } = body;

    const idea = await database.idea.create({
      data: {
        title,
        content,
        userId,
        tags: {
          connect: (tagIds ?? []).map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json(idea);

}


