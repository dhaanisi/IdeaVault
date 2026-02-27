"use client";

import { useRouter } from "next/navigation";

export function CreateIdeaBtn() {
  const router = useRouter();

  async function handleCreateIdea() {
    try{
      const res = await fetch("api/ideas",{
        method:"POST",
      });

      const data: { id: string } = await res.json();

      router.push(`/ideas/${data.id}`);
    }
    catch(error){
      console.error("Failed to create idea:", error);
    }
  }


  return (
    <button
      type="button"
      onClick={handleCreateIdea}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-black text-2xl text-white shadow-lg transition hover:scale-105"
    >
      +
    </button>
  );

}
