import { NextResponse } from "next/server";
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export async function POST(req: Request) {
    try{
        const {userId} = await auth();

        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }
        const body = await req.json();
        const { title, content } = body;

        if (!title) {
            return new Response("Title is required", { status: 400 });
        }   
        
        const idea = await database.idea.create({
            data:{
                title,
                content,
                userId,
            },
        });

        return NextResponse.json(idea, { status: 201 });
    } catch (error) {
        console.error("Failed to create idea:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}