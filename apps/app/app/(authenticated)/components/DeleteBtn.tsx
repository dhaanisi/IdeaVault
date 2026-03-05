"use client";

import { useRouter } from "next/navigation";

interface DeleteBtnProps {
    id: string;
}

export default function DeleteBtn({id}: DeleteBtnProps) {
    const router = useRouter();

    const handleDelete = async () => {
        const confirmDelete = confirm("Delete this idea?");
        if (!confirmDelete) return;
        console.log("Deleting idea with id:", id);

        const res = await fetch(`/api/ideas/${id}`, {
          method: "DELETE",
        });
        console.log("Delete response status:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("Delete failed:", text);
          alert("Failed to delete idea. Check console for details.");
          return;
        }

        router.refresh();
    };

    return(
    <button
      type="button"
      onClick={handleDelete}
      aria-label="Delete idea"
      className="rounded-full border px-3 py-1 text-sm text-shadow-white transition hover:bg-red-900 ml-2"
    >
      Delete
    </button>
  );
    
    
}