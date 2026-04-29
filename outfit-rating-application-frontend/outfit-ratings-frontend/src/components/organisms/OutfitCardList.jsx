"use client";

import { useState, useEffect } from "react";
import OutfitPostCard from "../molecules/OutfitCard";

export default function OutfitCardList({
  outfits: initialOutfits,
  showControls = false,
  onDelete,
  compact = false,
}) {
  const [outfits, setOutfits] = useState(initialOutfits || []);
  useEffect(() => {
    setOutfits(initialOutfits || []);
  }, [initialOutfits]);

  function handleRatingUpdated(outfitId, updatedData) {
    setOutfits((prev) =>
      prev.map((o) => ((o.id || o.outfitId) === outfitId ? updatedData : o)),
    );
  }

  if (!outfits || outfits.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-white text-lg">No outfits found.</p>
      </div>
    );
  }

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
              onDelete={(id) => onDelete?.(id)}
              onRatingUpdated={handleRatingUpdated}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
