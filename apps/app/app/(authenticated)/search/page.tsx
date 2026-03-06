import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { notFound, redirect } from "next/navigation";
import { Header } from "../components/header";

type SearchPageProperties = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: q ? `${q} - Search results` : "Search",
    description: q ? `Search results for ${q}` : "Search ideas",
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;

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

  if (!q) {
    redirect("/");
  }

  const ideas = await database.idea.findMany({
    where: {
      userId: dbUser.id,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { tags: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header page="Search" pages={["Ideas"]} />
      <div className="p-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="group mb-6 break-inside-avoid flex flex-col rounded-2xl border border-white/10 bg-neutral-900/80 p-6 shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:bg-neutral-900"
            >
              <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-indigo-300">
                {idea.title}
              </h3>

              {idea.content && (
                <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-6 break-words">
                  {idea.content}
                </p>
              )}

              {idea.tags && idea.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/70"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {ideas.length === 0 && (
          <p className="mt-10 text-center text-white/50">
            No ideas found.
          </p>
        )}
      </div>
    </>
  );
};

export default SearchPage;
