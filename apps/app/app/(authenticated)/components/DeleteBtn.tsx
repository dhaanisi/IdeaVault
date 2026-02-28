"use client";

interface DeleteBtnProps {
    id: string;
}

export default function DeleteBtn({id}: DeleteBtnProps) {
    const handleDelete = async () => {
        const condfirmDelete = confirm("Delete this idea?");
        if (!condfirmDelete) return;

        await fetch(`/api/ideas/${id}`, {
            method: "DELETE",
        });
        window.location.reload();
    };

    return(
    <button
      onClick={handleDelete}
      aria-label="Delete idea"
      className="rounded-full border px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/10 ml-2"
    >
      🗑️
    </button>
  );
    
    
}