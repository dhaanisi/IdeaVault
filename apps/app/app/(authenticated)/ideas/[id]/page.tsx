import { notFound } from "next/navigation";
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import EditIdeaForm from "./EditIdeaForm";


interface PageProps {
  params: {
    id: string;
  };
}

export default async function IdeaPage({ params }: PageProps) {
  const { id } = params;
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    notFound();
  }

  const dbUser = await database.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) {
    notFound();
  }

  const idea = await database.idea.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
    include: {
      tags: true,
    },
  });

  if (!idea) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-black p-6 text-white">
      <EditIdeaForm idea={idea} />
    </div>
  );
}