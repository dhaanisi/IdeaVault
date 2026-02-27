"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditIdeaFormProps {
    idea: {
        id: string;
        title: string;
        content: string | null;
    };
}

export default function EditIdeaForm({ idea }: EditIdeaFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.content ?? "");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        setLoading(true);

        try{
            const res = await fetch(`/api/ideas/${idea.id}`,{
                method: "PUT",
                headers:{
                    "Content-Type" : "applications/json",
                },
                body: JSON.stringify({
                    title,
                    content,
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

      <div className="mt-4 flex justify-end gap-3">
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
