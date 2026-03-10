"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewIdeaPage() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (Array.isArray(data)) setAvailableTags(data);
      else if (Array.isArray(data.tags)) setAvailableTags(data.tags);
      else setAvailableTags([]);
    }
    fetchTags();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tagIds: selectedTags }),
      });
      if (!res.ok) {
        const message = await res.text();
        alert(message || "Something went wrong");
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

  async function handleCreateTag() {
    if (!newTag.trim()) return;
    setCreatingTag(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag }),
      });
      const tag = await res.json();
      setAvailableTags((prev) => [...prev, tag]);
      setSelectedTags((prev) => [...prev, tag.id]);
      setNewTag("");
      setShowDropdown(false);
    } finally {
      setCreatingTag(false);
    }
  }

  const filteredTags = availableTags.filter(
    (t) =>
      !selectedTags.includes(t.id) &&
      t.name.toLowerCase().includes(newTag.toLowerCase())
  );

  const canCreateNew =
    newTag.trim() !== "" &&
    !availableTags.some((t) => t.name.toLowerCase() === newTag.trim().toLowerCase());

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Back link */}
        <button
          onClick={() => router.push("/")}
          className="mb-5 flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to ideas
        </button>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-neutral-900/80 shadow-2xl shadow-black/60 backdrop-blur-md"
        >
          {/* Form header */}
          <div className="border-b border-white/[0.06] px-6 py-4">
            <h1 className="text-sm font-medium text-white/50 tracking-wide uppercase">New Idea</h1>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Title */}
            <input
              autoFocus
              className="w-full bg-transparent text-xl font-semibold text-white outline-none placeholder:text-white/20 caret-indigo-400"
              placeholder="Give it a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Divider */}
            <div className="h-px bg-white/[0.05]" />

            {/* Content */}
            <textarea
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-white/70 outline-none placeholder:text-white/20 caret-indigo-400 min-h-[140px]"
              placeholder="What's on your mind..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />

            {/* Tags section */}
            <div className="pt-1">
              <div className="flex flex-wrap gap-2 items-center">
                {/* Selected tags */}
                {selectedTags.map((tagId) => {
                  const tag = availableTags.find((t) => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <span
                      key={tagId}
                      className="group flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300"
                    >
                      #{tag.name}
                      <button
                        type="button"
                        onClick={() => setSelectedTags(selectedTags.filter((id) => id !== tagId))}
                        className="ml-0.5 text-indigo-400/50 transition-colors hover:text-indigo-200"
                        aria-label={`Remove ${tag.name}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}

                {/* Add tag button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all duration-150 ${
                      showDropdown
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                        : "border-white/10 bg-white/[0.04] text-white/40 hover:border-white/20 hover:text-white/60"
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Tag
                  </button>

                  {showDropdown && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-52 rounded-xl border border-white/10 bg-neutral-800/95 shadow-xl shadow-black/50 backdrop-blur-sm overflow-hidden">
                      <div className="p-2">
                        <input
                          autoFocus
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (canCreateNew) handleCreateTag();
                              else if (filteredTags.length === 1) {
                                setSelectedTags([...selectedTags, filteredTags[0].id]);
                                setShowDropdown(false);
                                setNewTag("");
                              }
                            }
                            if (e.key === "Escape") setShowDropdown(false);
                          }}
                          placeholder="Search or create..."
                          className="w-full rounded-lg bg-black/40 px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-white/30"
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto">
                        {filteredTags.length > 0 && (
                          <div className="px-1 pb-1">
                            {filteredTags.map((tag) => (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => {
                                  setSelectedTags([...selectedTags, tag.id]);
                                  setShowDropdown(false);
                                  setNewTag("");
                                }}
                                className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                              >
                                #{tag.name}
                              </button>
                            ))}
                          </div>
                        )}

                        {canCreateNew && (
                          <div className="border-t border-white/[0.06] px-1 py-1">
                            <button
                              type="button"
                              onClick={handleCreateTag}
                              disabled={creatingTag}
                              className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-emerald-400 transition-colors hover:bg-emerald-400/10 disabled:opacity-50"
                            >
                              {creatingTag ? "Creating..." : `+ Create "${newTag}"`}
                            </button>
                          </div>
                        )}

                        {filteredTags.length === 0 && !canCreateNew && (
                          <p className="px-3 py-3 text-xs text-white/25 text-center">No tags found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
            <p className="text-xs text-white/20">
              {title.length > 0 ? `${title.length} chars` : "Start typing..."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/20 hover:text-white/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-medium text-white shadow-md shadow-indigo-900/40 transition-all hover:bg-indigo-500 hover:shadow-indigo-800/50 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
              >
                {loading ? "Saving..." : "Save idea"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}