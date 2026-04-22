"use client";

import React from "react";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black">Confirm delete</h3>
            <p className="text-sm text-gray-700 mt-1">
              Are you sure you want to delete this item?
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl border bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await onConfirm?.();
              } catch (err) {
                console.error("Delete action failed", err);
              }
            }}
            className="px-4 py-2 rounded-2xl bg-red-600 text-white flex items-center gap-2"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
