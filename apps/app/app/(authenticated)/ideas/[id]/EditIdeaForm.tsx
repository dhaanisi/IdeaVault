"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeleteBtn from "../../components/DeleteBtn";
interface EditIdeaFormProps {
    idea: {
        id: string;
        title: string;
        content: string | null;
        tags: { id: string; name: string }[];
    };
}

export default function EditIdeaForm({ idea }: EditIdeaFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.content ?? "");
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<string[]>(idea.tags?.map(t => t.id) || []);
    const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>(idea.tags ?? []);
    const [showDropdown, setShowDropdown] = useState(false);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
      async function loadTags() {
        try {
          const res = await fetch("/api/tags");
          const data = await res.json();
          setAvailableTags((prev) => {
            const map = new Map(prev.map(t => [t.id, t]));
            data.forEach((t: { id: string; name: string }) => map.set(t.id, t));
            return Array.from(map.values());
          });
        } catch (err) {
          console.error("Failed to load tags", err);
        }
      }

      loadTags();
    }, []);

    useEffect(() => {
      setTitle(idea.title);
      setContent(idea.content ?? "");
      setTags(idea.tags?.map((t) => t.id) || []);
      setAvailableTags(idea.tags ?? []);
      setShowDropdown(false);
      setNewTag("");
      setLoading(false);
    }, [idea.id]);

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        setLoading(true);

        try{
            const res = await fetch(`/api/ideas/${idea.id}`,{
                method: "PUT",
                headers:{
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    tags,
                }),
            });

            if(!res.ok){
                const message = await res.text();
                alert (message || "Something went wrong");
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        }
        catch(error) {
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }

    

 

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-2xl bg-neutral-900 p-6 shadow-lg"
    >
      <input
        className="mb-3 w-full bg-transparent text-lg font-semibold outline-none placeholder:text-gray-500"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-500"
        placeholder="Edit your idea..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tagId) => {
          const tag = availableTags.find((t) => t.id === tagId) || idea.tags.find((t) => t.id === tagId);
          if (!tag) return null;

          return (
            <span
              key={tag.id}
              className="flex items-center gap-1 rounded-full border border-white/20 px-2 py-1 text-xs"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag.id))}
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
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Search or create tag"
            className="mb-2 w-full rounded bg-black/40 px-2 py-1 text-sm outline-none"
          />

          {availableTags
            .filter(
              (t) =>
                !tags.includes(t.id) &&
                t.name.toLowerCase().includes(newTag.toLowerCase())
            )
            .map((tag) => (
              <div
                key={tag.id}
                onClick={() => {
                  setTags([...tags, tag.id]);
                  setShowDropdown(false);
                  setNewTag("");
                }}
                className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-white/10"
              >
                {tag.name}
              </div>
            ))}

          {newTag.trim() !== "" &&
            !availableTags.some(
              (t) => t.name.toLowerCase() === newTag.toLowerCase()
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
                  setTags([...tags, tag.id]);
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

      <div className="mt-4 flex justify-end gap-3">
        <DeleteBtn id={idea.id} />
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full border border-white/20 px-5 py-2 text-sm text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white px-5 py-2 text-sm text-black disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
