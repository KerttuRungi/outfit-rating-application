"use client";

import React from "react";
import { User, Star } from "lucide-react";

export default function UserProfileSidebar({ user, outfits = [] }) {
  // Display total posts and average rating for all user posts
  const postsCount = outfits?.length || 0;
  const avg =
    postsCount > 0
      ? outfits.reduce((s, o) => s + (o.averageRating ?? 0), 0) / postsCount
      : null;

  return (
    <section className="bg-white w-full md:w-75 sticky top-0 z-30 md:relative md:min-h-screen p-4 md:p-6 shadow-md">
      <div className="flex md:flex-col flex-row items-center md:items-start justify-between gap-4 md:gap-6 pt-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-(--dpink)">
            <User size={24} className="text-white" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm text-black font-semibold">
              {user?.email || "Unknown user"}
            </div>
            <div className="text-xs text-gray-700 opacity-70">user name</div>
          </div>
        </div>

        <div className="flex md:flex-col flex-row items-center md:items-start gap-6">
          <div className="text-center md:text-left">
            <div className="text-sm text-gray-700 opacity-70">Posts</div>
            <div className="text-xl md:text-2xl font-bold text-gray-700">
              {postsCount}
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="text-sm text-gray-700 opacity-70">
              Average rating for your posts
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="text-xl md:text-2xl font-bold text-gray-700">
                {avg !== null ? avg.toFixed(1) : "—"}
              </div>
              <Star size={16} className="text-(--dpink)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
