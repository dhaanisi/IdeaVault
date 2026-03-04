"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewIdeaPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState("");
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const tagColors = [
    "bg-purple-600/20 text-purple-300 border-purple-500/30",
    "bg-pink-600/20 text-pink-300 border-pink-500/30",
    "bg-blue-600/20 text-blue-300 border-blue-500/30",
    "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
    "bg-orange-600/20 text-orange-300 border-orange-500/30",
  ];

  useEffect(() => {
    async function fetchTags() {
      const res = await fetch("/api/tags");
      const data = await res.json();

      // Ensure we always store an array
      if (Array.isArray(data)) {
        setAvailableTags(data);
      } else if (Array.isArray(data.tags)) {
        setAvailableTags(data.tags);
      } else {
        setAvailableTags([]);
      }
    }

    fetchTags();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tagIds: selectedTags,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        alert(message || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-black p-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl bg-neutral-900 p-6 shadow-lg transition-shadow focus-within:shadow-2xl"
      >
        <input
          className="mb-3 w-full bg-transparent text-lg font-semibold outline-none placeholder:text-gray-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-500"
          placeholder="Take a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />

        <div className="relative mt-4">
  <button
    type="button"
    onClick={() => setShowDropdown(!showDropdown)}
    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-left text-sm text-white"
  >
    {selectedTags.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {availableTags
          .filter((tag) => selectedTags.includes(tag.id))
          .map((tag, index) => (
            <span
              key={tag.id}
              className={`rounded-full border px-3 py-1 text-xs ${
                tagColors[index % tagColors.length]
              }`}
            >
              {tag.name}
            </span>
          ))}
      </div>
    ) : (
      "Select tags"
    )}
  </button>

  {showDropdown && (
    <div className="absolute z-10 mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 p-2">
      {availableTags.map((tag) => (
        <div
          key={tag.id}
          onClick={() => {
            if (selectedTags.includes(tag.id)) {
              setSelectedTags(selectedTags.filter((id) => id !== tag.id));
            } else {
              setSelectedTags([...selectedTags, tag.id]);
            }
          }}
          className={`cursor-pointer rounded-lg px-3 py-2 text-sm border ${
            selectedTags.includes(tag.id)
              ? tagColors[
                  availableTags.findIndex((t) => t.id === tag.id) %
                    tagColors.length
                ]
              : "border-transparent hover:bg-white/10"
          }`}
        >
          {tag.name}
        </div>
      ))}
    </div>
  )}
</div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

//new/page.tsx