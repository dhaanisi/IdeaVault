"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [ideas, setIdeas] = useState<{ id: string; title: string }[]>([]);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filteredIdeas = q
    ? ideas.filter((idea) =>
        (idea.title ?? "").toLowerCase().includes(q)
      )
    : ideas;

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!open) return;

    const fetchIdeas = async () => {
      try {
        const res = await fetch("/api/ideas");
        let data: any = [];
        try {
          data = await res.json();
        } catch {
          data = [];
        }

        // handle both {ideas: []} and [] formats
        if (Array.isArray(data)) {
          setIdeas(data);
        } else if (Array.isArray(data.ideas)) {
          setIdeas(data.ideas);
        } else {
          setIdeas([]);
        }
      } catch (err) {
        console.error("Failed to load ideas", err);
      }
    };

    fetchIdeas();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-40">
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-neutral-900 p-4 shadow-xl">
        <Command shouldFilter={false} className="w-full">
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (filteredIdeas.length > 0) {
                  router.push(`/ideas/${filteredIdeas[0].id}`);
                  setOpen(false);
                }
              }
            }}
            placeholder="Search ideas or run a command..."
            className="w-full border-b border-white/10 bg-transparent pb-3 text-sm text-white outline-none"
          />

          <Command.List className="mt-3 space-y-1 text-sm">
            {query && filteredIdeas.length === 0 && (
              <Command.Empty className="py-6 text-center text-sm text-white/40">
                No ideas found
              </Command.Empty>
            )}
            <Command.Group heading="Navigation">
              <Command.Item
                onSelect={() => {
                  router.push("/");
                  setOpen(false);
                }}
                className="cursor-pointer rounded px-2 py-2 text-white/80 hover:bg-white/10"
              >
                Go to Dashboard
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  router.push("/ideas/new");
                  setOpen(false);
                }}
                className="cursor-pointer rounded px-2 py-2 text-white/80 hover:bg-white/10"
              >
                Create New Idea
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  router.push("/trash");
                  setOpen(false);
                }}
                className="cursor-pointer rounded px-2 py-2 text-white/80 hover:bg-white/10"
              >
                Open Trash
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  router.push("/settings");
                  setOpen(false);
                }}
                className="cursor-pointer rounded px-2 py-2 text-white/80 hover:bg-white/10"
              >
                Open Settings
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Ideas">
              {filteredIdeas.map((idea) => (
                <Command.Item
                  key={idea.id}
                  value={idea.title}
                  onSelect={() => {
                    router.push(`/ideas/${idea.id}`);
                    setOpen(false);
                  }}
                  className="cursor-pointer rounded px-2 py-2 text-white/80 hover:bg-white/10"
                >
                  {idea.title}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
