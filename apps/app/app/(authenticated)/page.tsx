import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Header } from "./components/header";
import Link from "next/link";
import DeleteBtn from "./components/DeleteBtn";
import EditBtn from "./components/EditBtn";



const App = async ({ searchParams }: { searchParams: Promise<{ tag?: string; sort?: string }> }) => {
  const { userId: clerkId} = await auth();
  if(!clerkId) {
    return null;
  }
  const params = await searchParams;
  const sort = params?.sort || "new";
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
    let orderBy: any = { createdAt: "desc" };

    if (sort === "old") {
      orderBy = { createdAt: "asc" };
    }

    if (sort === "az") {
      orderBy = { title: "asc" };
    }

    if (sort === "za") {
      orderBy = { title: "desc" };
    }
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
  orderBy,
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
  <div className="mb-4 flex justify-end">
    <div className="flex gap-2 text-xs text-white/70">
      <Link href="/?sort=new" className={`px-2 py-1 rounded border border-white/10 ${sort === "new" ? "bg-white/10 text-white" : "hover:bg-white/5"}`}>
        Newest
      </Link>
      <Link href="/?sort=old" className={`px-2 py-1 rounded border border-white/10 ${sort === "old" ? "bg-white/10 text-white" : "hover:bg-white/5"}`}>
        Oldest
      </Link>
      <Link href="/?sort=az" className={`px-2 py-1 rounded border border-white/10 ${sort === "az" ? "bg-white/10 text-white" : "hover:bg-white/5"}`}>
        A‑Z
      </Link>
      <Link href="/?sort=za" className={`px-2 py-1 rounded border border-white/10 ${sort === "za" ? "bg-white/10 text-white" : "hover:bg-white/5"}`}>
        Z‑A
      </Link>
    </div>
  </div>
  {ideas.length === 0 ? (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-lg text-white">No ideas yet</p>
      <p className="mt-2 text-sm text-white/40">
        Start capturing your thoughts by creating your first idea.
      </p>
      <p className="mt-3 text-xs text-white/30">
        Tip: Press ⌘K to quickly search or create ideas
      </p>
    </div>
  ) : (
  
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="group mb-6 break-inside-avoid flex flex-col rounded-2xl border border-white/10 bg-neutral-900/70 p-6 shadow-md backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-indigo-400/40 hover:bg-neutral-900/90"
        >
          <div>
            <h2 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-indigo-300">
              {idea.title}
            </h2>
            {idea.content && (
              <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-6 break-words">
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
