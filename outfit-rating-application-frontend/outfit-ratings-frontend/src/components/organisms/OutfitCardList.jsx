"use client";

import React from "react";
import OutfitPostCard from "../molecules/OutfitCard";

export default function OutfitCardList({
  outfits,
  showControls = false,
  compact = false,
}) {
  if (!outfits || outfits.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-white text-lg">No outfits found.</p>
      </div>
    );
  }
  // Different columns for explore and user pages
  const columnClassName = compact
    ? "col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-4 h-full"
    : "col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 h-full";
  return (
    <div className="px-6 mx-auto max-w-7xl">
      <div className="grid grid-cols-12 gap-6 py-6">
        {outfits.map((outfit, i) => (
          <div
            key={outfit.outfitId || outfit.id || i}
            className={columnClassName}
          >
            <OutfitPostCard
              outfit={outfit}
              eager={i === 0}
              outfitId={outfit.outfitId || outfit.id}
              isCreator={showControls}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
