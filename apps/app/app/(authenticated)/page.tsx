import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Header } from "./components/header";
import Link from "next/link";
import DeleteBtn from "./components/DeleteBtn";
import EditBtn from "./components/EditBtn";


const App = async () => {
  const { userId: clerkId} = await auth();
  const dbUser = await database.user.findFirstOrThrow({
    where: { clerkId },
  });


type IdeasWithTags = Awaited<ReturnType<typeof database.idea.findMany>>;
let ideas: IdeasWithTags = [];
 
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

          <div className="mt-4 flex justify-end gap-2">
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
