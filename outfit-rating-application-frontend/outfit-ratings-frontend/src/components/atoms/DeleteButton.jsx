"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/molecules/DeleteConfirmationModal";

export default function DeleteButton({ id, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="delete"
        onClick={(e) => {
          e.stopPropagation();
          if (!id) return;
          setOpen(true);
        }}
        className="p-2 rounded-full bg-[var(--dpink)]/80 hover:bg-red-600 text-white shadow-md transition-colors"
      >
        <Trash2 size={16} />
      </button>

      <DeleteConfirmationModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          try {
            await onDelete?.(id);
          } catch (err) {
            console.error("Delete failed", err);
          } finally {
            setOpen(false);
          }
        }}
      />
    </>
  );
}
