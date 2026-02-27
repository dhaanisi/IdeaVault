import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "./components/header";
import Link from "next/link";

const title = "Acme Inc";
const description = "My application.";

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

let ideas: { id: string; title: string; content: string | null }[] = [];
  
  try {
    ideas = await database.idea.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    ideas = [];
  }

  return (
    <>
      <Header page="Data Fetching" pages={["Building Your Application"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">...</div>

      <Link
        href="/ideas/new"
        className="fixed right-8 bottom-8 flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg transition-transform hover:scale-105"
      >
        +
      </Link>
      <div className="p-6">
  {ideas.length === 0 ? (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
      No ideas yet. Click + to create one.
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-lg transition hover:scale-[1.02] hover:border-white/20"
        >
          <h2 className="text-lg font-semibold text-white">
            {idea.title}
          </h2>

          {idea.content && (
            <p className="mt-3 text-sm text-white/70 line-clamp-4">
              {idea.content}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <Link
              href={`/ideas/${idea.id}`}
              className="rounded-full border border-white/20 px-4 py-1 text-xs text-white/70 transition hover:bg-white/10"
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default App;
