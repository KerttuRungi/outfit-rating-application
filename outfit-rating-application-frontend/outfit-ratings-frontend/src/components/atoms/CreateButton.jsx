"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CreateButton({ className = "" }) {
  const router = useRouter();
  return (
    <button
      className={`px-4 py-2 bg-[var(--dpink)] hover:bg-[var(--dpink-hover)] rounded-xl transition cursor-pointer w-full flex items-center justify-center gap-2 ${className}`}
      onClick={() => router.push("/create-post")}
    >
      <Plus size={18} />
      <span className="text-white font-semibold">Post an outfit</span>
    </button>
  );
}
