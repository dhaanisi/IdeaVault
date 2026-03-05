import { database } from "@repo/database";
import { auth } from "@repo/auth/server";
import { revalidatePath } from "next/cache";

export default async function TrashPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  const dbUser = await database.user.findUnique({
    where: { clerkId }
  });

  const ideas = await database.idea.findMany({
    where: {
      userId: dbUser?.id,
      deleted: true
    }
  });

  async function restoreIdea(id: string) {
    "use server";

    await database.idea.update({
      where: { id },
      data: { deleted: false },
    });

    revalidatePath("/trash");
    revalidatePath("/");
  }

  async function deleteForever(id: string) {
    "use server";

    await database.idea.delete({
      where: { id },
    });

    revalidatePath("/trash");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Trash</h1>

      {ideas.length === 0 ? (
        <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
          Trash is empty
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-2xl border border-white/10 p-4 transition hover:bg-white/5"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-medium text-white">{idea.title}</h3>

                <div className="flex gap-4 text-sm">
                  <form action={restoreIdea.bind(null, idea.id)}>
                    <button
                      type="submit"
                      className="text-white/60 hover:text-white"
                    >
                      Restore
                    </button>
                  </form>

                  <form action={deleteForever.bind(null, idea.id)}>
                    <button
                      type="submit"
                      className="text-red-400 hover:text-red-500"
                    >
                      Delete forever
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}