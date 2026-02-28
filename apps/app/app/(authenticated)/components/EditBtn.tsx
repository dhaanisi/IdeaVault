"use client";

import { useRouter } from "next/navigation";

interface EditBtnProps {
    id: string;
}

export default function EditBtn({id}: EditBtnProps) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/ideas/${id}`);
    };

    return(
    <button
      onClick={handleEdit}
      aria-label="Edit idea"
      className="rounded-full border px-3 py-1 text-sm text-blue-400 transition hover:bg-blue-500/10"
    >
      ✏️
    </button>
  );
}