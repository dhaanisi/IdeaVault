import { database } from "@repo/database";
import { auth } from "@repo/auth/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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

  async function cancelDelete() {
    "use server";
    redirect("/trash");
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

                  <details className="relative">
                    <summary className="cursor-pointer list-none text-red-400 hover:text-red-500">
                      Delete forever
                    </summary>

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                      <div className="w-72 rounded-xl border border-white/10 bg-[#0f0f10] p-5 shadow-2xl">
                        <p className="text-sm text-white/80 mb-3">
                          Permanently delete this idea?
                        </p>

                        <p className="text-xs text-white/40 mb-5">
                          This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end gap-2">
                          <form action={cancelDelete}>
                            <button
                              type="submit"
                              className="cursor-pointer rounded-md px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                            >
                              Cancel
                            </button>
                          </form>

                          <form action={deleteForever.bind(null, idea.id)}>
                            <button
                              type="submit"
                              className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}