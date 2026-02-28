import { notFound } from "next/navigation";
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import EditIdeaForm from "./EditIdeaForm";


interface PageProps {
    params : Promise<{
        id: string;
    }>
}

export default async function IdeaPage({params}: PageProps) {
    
    const { id } = await params;
    const { userId } = await auth();

    if(!userId) {
    notFound();
    }

const idea = await database.idea.findFirstOrThrow({
    where:{
        id,
        userId,
    },
});


if(!idea || idea.userId !== userId) {
    notFound();
}

  return (
    <div className="flex min-h-screen items-start justify-center bg-black p-6 text-white">
      <EditIdeaForm idea={idea} />
    </div>
  );
}