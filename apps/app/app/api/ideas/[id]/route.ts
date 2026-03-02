import { NextResponse } from "next/server";
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await database.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  console.log("BODY: ", body);
  const { title, content } = body;

  const existingIdea = await database.idea.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  if (!existingIdea) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try{
    const updatedIdea = await database.idea.update({
      where: { 
        id: existingIdea.id,
       },
      data: {
        title,
        content,
      },
    });
    return NextResponse.json(updatedIdea);  
  } catch (error) {
    console.error("UPDATE ERROR: ", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await database.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const existingIdea = await database.idea.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  if (!existingIdea) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    await database.idea.delete({
      where: { id: existingIdea.id },
    });

    return NextResponse.json({ message: "Idea deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}
