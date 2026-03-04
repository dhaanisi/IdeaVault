import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Header } from "./components/header";
import Link from "next/link";
import DeleteBtn from "./components/DeleteBtn";
import EditBtn from "./components/EditBtn";


const App = async () => {
  const { userId: clerkId} = await auth();
  if(!clerkId) {
    return null;
  }
  let dbUser = await database.user.findUnique({ where: { clerkId } });

  if (!dbUser) {
    dbUser = await database.user.create({
      data: {
        clerkId,
      },
    });
  }


let ideas: any[]= [];
 
  try {
    ideas = await database.idea.findMany({
      where: { userId: dbUser.id },
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-neutral-900 p-10 text-center">
      <p className="text-lg text-white/80">No ideas yet</p>
      <p className="mt-2 text-sm text-white/50">Start capturing your thoughts by creating your first idea.</p>
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="group rounded-2xl border border-white/10 bg-neutral-900/80 p-6 shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
        >
          <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
            {idea.title}
          </h2>

          {idea.content && (
            <p className="mt-3 text-sm text-white/70 line-clamp-4">
              {idea.content}
            </p>
          )}
          {idea.tags && idea.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {idea.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs font-medium text-indigo-300"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-end gap-2 border-t border-white/5 pt-4">
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
