import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Header } from "./components/header";
import Link from "next/link";
import DeleteBtn from "./components/DeleteBtn";
import EditBtn from "./components/EditBtn";

const App = async ({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}) => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const params = await searchParams;
  const sort = params?.sort || "new";
  const selectedTag = params?.tag;

  let dbUser = await database.user.findUnique({ where: { clerkId } });
  if (!dbUser) {
    dbUser = await database.user.create({ data: { clerkId } });
  }

  const tags = await database.tag.findMany({
    where: { userId: dbUser.id },
    orderBy: { name: "asc" },
  });

  let ideas: any[] = [];
  try {
    let orderBy: any = { createdAt: "desc" };
    if (sort === "old") orderBy = { createdAt: "asc" };
    if (sort === "az") orderBy = { title: "asc" };
    if (sort === "za") orderBy = { title: "desc" };

    ideas = await database.idea.findMany({
      where: {
        userId: dbUser.id,
        deleted: false,
        ...(selectedTag && { tags: { some: { name: selectedTag } } }),
      },
      include: { tags: true },
      orderBy,
    });
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    ideas = [];
  }

  const SORT_OPTIONS = [
    { key: "new", label: "Newest" },
    { key: "old", label: "Oldest" },
    { key: "az", label: "A–Z" },
    { key: "za", label: "Z–A" },
  ];

  return (
    <>
      <Header page="Ideas" pages={["Dashboard"]} />

      <div className="min-h-screen px-6 py-8 pb-28">
        {/* ── Toolbar ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tag filters */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/?sort=${sort}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                  !selectedTag
                    ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-300"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                All
              </Link>
              {tags.map((t: any) => (
                <Link
                  key={t.id}
                  href={`/?sort=${sort}&tag=${t.name}`}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                    selectedTag === t.name
                      ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-300"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}

          {/* Sort controls */}
          <div className="ml-auto flex shrink-0 gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            {SORT_OPTIONS.map(({ key, label }) => (
              <Link
                key={key}
                href={`/?sort=${key}${selectedTag ? `&tag=${selectedTag}` : ""}`}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  sort === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {ideas.length === 0 ? (
          <div className="flex h-[58vh] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
              💡
            </div>
            <p className="text-base font-medium text-white">
              {selectedTag ? `No ideas tagged "${selectedTag}"` : "No ideas yet"}
            </p>
            <p className="mt-2 max-w-xs text-sm text-white/40">
              {selectedTag
                ? "Try a different tag or clear the filter."
                : "Start capturing your thoughts by creating your first idea."}
            </p>
            {!selectedTag && (
              <Link
                href="/ideas/new"
                className="mt-6 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Create your first idea
              </Link>
            )}
            <p className="mt-4 text-xs text-white/25">
              Tip: Press ⌘K to quickly search or create
            </p>
          </div>
        ) : (
          <>
            {/* idea count */}
            <p className="mb-5 text-xs text-white/30">
              {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
              {selectedTag && (
                <>
                  {" "}tagged{" "}
                  <span className="text-indigo-400">#{selectedTag}</span>
                  {" · "}
                  <Link href={`/?sort=${sort}`} className="underline underline-offset-2 hover:text-white/50">
                    Clear
                  </Link>
                </>
              )}
            </p>

            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="group relative mb-5 break-inside-avoid rounded-2xl border border-white/[0.07] bg-neutral-900/60 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-indigo-500/40 hover:bg-neutral-800/80 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15),0_2px_8px_rgba(0,0,0,0.5)]"
                >
                  {/* Top glow edge on hover */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-indigo-400/0 to-transparent transition-all duration-300 group-hover:via-indigo-400/50" />
                  <h2 className="text-sm font-semibold leading-snug text-white/90 transition-colors duration-200 group-hover:text-white">
                    {idea.title}
                  </h2>

                  {idea.content && (
                    <p className="mt-2.5 line-clamp-6 break-words text-xs leading-relaxed text-white/50">
                      {idea.content}
                    </p>
                  )}

                  {idea.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {idea.tags.map((tag: any) => (
                        <Link
                          key={tag.id}
                          href={`/?sort=${sort}&tag=${tag.name}`}
                          className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/50 transition-colors hover:border-indigo-500/40 hover:text-indigo-300"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Actions — visible on hover */}
                  <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-white/[0.06] pt-3 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <EditBtn id={idea.id} />
                    <DeleteBtn id={idea.id} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── FAB ── */}
      <Link
        href="/ideas/new"
        title="New idea"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-900/50 transition-all duration-200 hover:scale-105 hover:bg-indigo-500 hover:shadow-indigo-800/60 active:scale-95"
      >
        +
      </Link>
    </>
  );
};

export default App;