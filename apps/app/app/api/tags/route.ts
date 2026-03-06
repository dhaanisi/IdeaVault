import { NextResponse } from "next/server";
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { headers } from "next/headers";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    console.log("Fetching tags for user:", clerkId);

    if (!clerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await database.user.findUnique({ where: { clerkId } });

    if(!dbUser) { 
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingTags = await database.tag.findMany({
      where: { userId: dbUser.id
       },
    });

    if (existingTags.length === 0) {
      const defaultTags = [
        { name: "Personal", color: "bg-purple-600/20 text-purple-300 border-purple-500/30" },
        { name: "Startup", color: "bg-pink-600/20 text-pink-300 border-pink-500/30" },
        { name: "Film", color: "bg-blue-600/20 text-blue-300 border-blue-500/30" },
        { name: "Health", color: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30" },
        { name: "Random", color: "bg-orange-600/20 text-orange-300 border-orange-500/30" },
      ];

      await database.tag.createMany({
        data: defaultTags.map((tag) => ({
          ...tag,
          userId: dbUser.id,
        })),
        skipDuplicates: true,
      });
    }

    const tags = await database.tag.findMany({
      where: { userId: dbUser.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("TAG API ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await database.user.findUnique({ where: { clerkId } });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    if (!body?.name || typeof body.name !== "string") {
      return NextResponse.json({ message: "Tag name required" }, { status: 400 });
    }

    const tag = await database.tag.create({
      data: {
        name: body.name.trim(),
        userId: dbUser.id,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("CREATE TAG ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}