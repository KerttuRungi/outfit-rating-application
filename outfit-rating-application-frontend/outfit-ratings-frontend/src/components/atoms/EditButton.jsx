"use client";

import React from "react";
import Link from "next/link";
import { Pen } from "lucide-react";

export default function EditButton({ id }) {
  return (
    <Link
      className="p-2 rounded-full bg-[var(--dpink)]/80 hover:bg-[var(--lpink)] text-white shadow-md transition-colors"
      href={`/edit/${id}`}
    >
      <Pen size={16} />
    </Link>
  );
}
