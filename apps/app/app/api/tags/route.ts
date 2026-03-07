import { NextResponse } from "next/server";
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { headers } from "next/headers";
import { success } from "zod";

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
        {name: "Personal"},
        {name: "Startup"},
        {name: "Film"},
        {name: "Health"},
        {name: "Random"},
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
    if (!body?.name || typeof body.name !== "string"){
      return NextResponse.json({message: "Tag name required"}, {status:400});
    }

    const existing = await database.tag.findFirst({
      where:{
        userId: dbUser.id,
        name: body.name.trim(),
      },
    });
    if(existing){
      return NextResponse.json(existing);
    }

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

export async function DELETE(req: Request) {
  try{
    const {userId:clerkId} = await auth();

    if(!clerkId){
      return NextResponse.json({message: "Unauthorized"}, {status:401});
    }

    const dbUser = await database.user.findUnique({where: {clerkId}});

    if(!dbUser) {
      return  NextResponse.json({message: "User not found"}, {status:404});
    }

    const {id} = await req.json();

    if (!id){
      return NextResponse.json({message: "Tag id required"}, {status: 400});
    }

    await database.tag.delete({
      where:{id},
    });
    return NextResponse.json({success:true});
  }
  catch(error){
    console.error("DELETE TAG ERROR:", error);
    return NextResponse.json({message: "Internal Server Error"},{status:500})
  }
}

export async function PATCH(req: Request) {
  const {id, name} = await req.json();

  const tag = await database.tag.update({
    where: { id },
    data: {name},
  });

  return NextResponse.json(tag);
  
}