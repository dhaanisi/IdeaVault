import { NextResponse } from "next/server";
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }  
) {
  const { id } = await context.params;
  const { userId } = await auth();  
  
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content } = body;

  const existingIdea = await database.idea.findUnique({
    where: { id },
  });

  if(!existingIdea || existingIdea.userId !== userId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const updatedIdea = await database.idea.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  return NextResponse.json(updatedIdea);
}