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
  const[newTag, setNewTag] = useState("");

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

        <div className="mt-4">
  <div className="flex flex-wrap gap-2">
    {selectedTags.map((tagId) => {
      const tag = availableTags.find((t) => t.id === tagId);
      if (!tag) return null;

      return (
        <span
          key={tag.id}
          className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs"
        >
          {tag.name}
          <button
            type="button"
            onClick={() =>
              setSelectedTags(selectedTags.filter((id) => id !== tag.id))
            }
            className="ml-1 text-red-400"
          >
            ×
          </button>
        </span>
      );
    })}

    <button
      type="button"
      onClick={() => setShowDropdown(!showDropdown)}
      className="rounded-full border border-white/20 px-2 py-1 text-xs"
    >
      + Tag
    </button>
  </div>

{showDropdown && (
  <div className="mt-2 rounded-lg border border-white/10 bg-neutral-800 p-2">
    
    {/* Tag search / input */}
    <input
      value={newTag}
      onChange={(e) => setNewTag(e.target.value)}
      placeholder="Search or create tag"
      className="mb-2 w-full rounded bg-black/40 px-2 py-1 text-sm outline-none"
    />

    {/* Existing tags */}
    {availableTags
      .filter(
        (tag) =>
          !selectedTags.includes(tag.id) &&
          tag.name.toLowerCase().includes(newTag.toLowerCase())
      )
      .map((tag) => (
        <div
          key={tag.id}
          onClick={() => {
            setSelectedTags([...selectedTags, tag.id]);
            setShowDropdown(false);
            setNewTag("");
          }}
          className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-white/10"
        >
          {tag.name}
        </div>
      ))}

    {/* Create new tag */}
    {newTag.trim() !== "" &&
      !availableTags.some(
        (tag) => tag.name.toLowerCase() === newTag.toLowerCase()
      ) && (
        <div
          onClick={async () => {
            const res = await fetch("/api/tags", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: newTag }),
            });

            const tag = await res.json();

            setAvailableTags([...availableTags, tag]);
            setSelectedTags([...selectedTags, tag.id]);
            setNewTag("");
            setShowDropdown(false);
          }}
          className="cursor-pointer rounded px-2 py-1 text-sm text-green-400 hover:bg-white/10"
        >
          + Create "{newTag}"
        </div>
      )}
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