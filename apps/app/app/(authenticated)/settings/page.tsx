import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function DeleteAllButton() {
  return (
    <button
      type="submit"
      className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20"
    >
      Delete
    </button>
  );
}


export default async function SettingsPage({ searchParams }: { searchParams?: { deleted?: string } }) {
  const { userId } = await auth();

  async function deleteAllIdeas() {
    "use server";

    if (!userId) return;

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) return;

    await database.idea.deleteMany({
      where: { userId: dbUser.id },
    });

    revalidatePath("/");
    revalidatePath("/trash");
    redirect("/settings?deleted=1");
  }

  return (
    <div className="p-6 max-w-2xl">
      {searchParams?.deleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-80 rounded-xl border border-white/10 bg-[#0f0f10] p-6 shadow-2xl text-center">
            <p className="text-sm text-white/80 mb-4">All ideas deleted successfully</p>

            <a
              href="/settings"
              className="inline-block rounded-md px-3 py-1.5 text-xs text-white/80 bg-white/10 hover:bg-white/20"
            >
              Close
            </a>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-10">Settings</h1>

      <div className="space-y-10">
        {/* Account */}
        <div>
          <h2 className="text-lg font-medium">Account</h2>
          <p className="mt-2 text-sm text-white/60">
            Logged in as: {userId}
          </p>
        </div>

        {/* About */}
        <div>
          <h2 className="text-lg font-medium">About</h2>
          <p className="mt-2 text-sm text-white/60">IdeaVault v1.0</p>
          <p className="text-sm text-white/40">
            Built with Next.js, Prisma, Neon and Clerk.
          </p>
        </div>

        {/* Delete all ideas */}
        <div className="pt-4">
          <details className="relative">
            <summary className="cursor-pointer list-none text-sm text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/10">
              Delete all ideas
            </summary>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-80 rounded-xl border border-white/10 bg-[#0f0f10] p-6 shadow-2xl">
                <p className="text-sm text-white/80 mb-3">Delete all ideas?</p>
                <p className="text-xs text-white/40 mb-5">This will permanently remove all your ideas.</p>

                <div className="flex justify-end gap-3">
                  <summary className="cursor-pointer rounded-md px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white">
                    Cancel
                  </summary>

                  <form action={deleteAllIdeas}>
                    <DeleteAllButton />
                  </form>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}