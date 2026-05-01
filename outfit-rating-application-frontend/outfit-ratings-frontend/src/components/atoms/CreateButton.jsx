"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CreateButton({ className = "" }) {
  const router = useRouter();
  return (
    <button
      className={`px-4 py-2 bg-(--dpink) hover:bg-(--dpink-hover) rounded-xl transition cursor-pointer w-full flex items-center justify-center gap-2 text-white ${className}`}
      onClick={() => router.push("/create-post")}
    >
      <Plus size={18} />
      <span className="font-semibold">Post an outfit</span>
    </button>
  );
}
