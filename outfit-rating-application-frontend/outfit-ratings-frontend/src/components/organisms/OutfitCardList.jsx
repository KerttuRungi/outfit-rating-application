"use client";

import React from "react";
import OutfitPostCard from "../molecules/OutfitCard";

export default function OutfitCardList({ outfits }) {
  if (!outfits || outfits.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-white text-lg">No outfits found.</p>
      </div>
    );
  }
  return (
    <div className="px-6 mx-auto max-w-7xl">
      <div className="grid grid-cols-12 gap-6 py-6">
        {outfits.map((outfit, i) => (
          <div
            key={outfit.outfitId || outfit.id || i}
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 h-full"
          >
            <OutfitPostCard
              outfit={outfit}
              eager={i === 0}
              outfitId={outfit.outfitId || outfit.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
