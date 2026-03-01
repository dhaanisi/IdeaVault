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

  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  if (!q) {
    redirect("/");
  }

  const ideas = await database.idea.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header page="Search" pages={["Ideas"]} />
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-2xl border border-white/10 bg-neutral-900 p-5"
            >
              <h3 className="text-lg font-semibold text-white">
                {idea.title}
              </h3>
              {idea.content && (
                <p className="mt-2 text-sm text-white/60">
                  {idea.content}
                </p>
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
