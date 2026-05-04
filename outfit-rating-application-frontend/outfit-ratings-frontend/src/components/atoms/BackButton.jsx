"use client";
import { useRouter } from "next/navigation";
import { LucideArrowLeft } from "lucide-react";

export default function BackButton({ className = "", href = "/explore" }) {
  const router = useRouter();
  return (
    <button
      className={`w-fit px-3 py-1.5 bg-(--dpink) hover:bg-(--dpink-hover) rounded-lg transition cursor-pointer flex items-center justify-center gap-2 text-white text-sm ${className}`}
      onClick={() => router.push(href)}
    >
      <LucideArrowLeft size={16} />
      <span className="font-semibold">Back</span>
    </button>
  );
}
