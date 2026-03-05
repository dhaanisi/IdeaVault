import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Header } from "./components/header";
import Link from "next/link";
import DeleteBtn from "./components/DeleteBtn";

import EditBtn from "./components/EditBtn";



const App = async ({ searchParams }: { searchParams: Promise<{ tag?: string }> }) => {
  const { userId: clerkId} = await auth();
  if(!clerkId) {
    return null;
  }
  const params = await searchParams;
  const selectedTags = params?.tag;
  const tag = params?.tag;
  let dbUser = await database.user.findUnique({ where: { clerkId } });

  if (!dbUser) {
    dbUser = await database.user.create({
      data: {
        clerkId,
      },
    });
  }
  const tags = await database.tag.findMany({
    where: { userId: dbUser.id },
    orderBy: { name: "asc" },
  });

let ideas: any[]= [];
 
  try {
    ideas = await database.idea.findMany({
  where: {
    userId: dbUser.id,
    deleted:false,
    ...(selectedTags && {
      tags: {
        some: {
          name: selectedTags,
        },
      },
    }),
  },
  include: { tags: true },
  orderBy: { createdAt: "desc" },
});
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    ideas = [];
  }

  return (
    <>
      <Header page="Data Fetching" pages={["Building Your Application"]} />

      <Link
        href="/ideas/new"
        className="fixed right-8 bottom-8 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-900 to-indigo-900 text-2xl text-white transition-transform duration-200 hover:scale-105"
      >
        +
      </Link>
      <div className="p-6">
  {ideas.length === 0 ? (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-lg text-white">No ideas yet</p>
      <p className="mt-2 text-sm text-white/40">
        Start capturing your thoughts by creating your first idea.
      </p>
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900/80 p-6 shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
        >
          <div>
            <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-indigo-300">
              {idea.title}
            </h2>
            <p className="mt-1 text-xs text-white/40">
              {new Date(idea.createdAt).toLocaleDateString()}
            </p>

            {idea.content && (
              <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-4">
                {idea.content}
              </p>
            )}

            {idea.tags && idea.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {idea.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/5 pt-4 opacity-0 transition-opacity group-hover:opacity-100">
            <EditBtn id={idea.id} />
            <DeleteBtn id={idea.id} />
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </>
  );
};

export default App;
