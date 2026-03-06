"use client";

import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface DeleteBtnProps {
    id: string;
}

export default function DeleteBtn({id}: DeleteBtnProps) {
    const router = useRouter();

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this idea?");
        if (!confirmDelete) return;

        const loadingToast = toast.loading("Deleting idea...");

        const res = await fetch(`/api/ideas/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Delete failed:", text);
          toast.error("Failed to delete idea", { id: loadingToast });
          return;
        }

        toast.success("Idea moved to Trash", { id: loadingToast });
        router.refresh();
    };

    return(
    <button
      type="button"
      onClick={handleDelete}
      aria-label="Delete idea"
      className="rounded-md border border-white/10 px-3 py-1 text-sm text-white/70 transition hover:bg-red-500/10 hover:text-red-400 ml-2"
    >
      <Trash2Icon className="h-4 w-4" />
    </button>
  );
    
    
}