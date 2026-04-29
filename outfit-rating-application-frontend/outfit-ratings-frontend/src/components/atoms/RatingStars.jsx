"use client";

import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { rateOutfit } from "@/services/ratingService";

export default function RatingStars({
  outfitId,
  value = 0,
  onChange,
  size = 18,
  readOnly = false,
}) {
  const [hover, setHover] = useState(0);

  const activeValue = hover || value;
  const isInteractable = !readOnly;

  async function handleRate(v) {
    if (!isInteractable) return;
    onChange?.(v);
  }

  return (
    <div className="flex items-center space-x-1" role="radiogroup">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const active = starValue <= activeValue;

        return (
          <button
            key={starValue}
            type="button"
            disabled={!isInteractable}
            onClick={() => handleRate(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-colors focus:outline-none cursor-pointer disabled:cursor-default"
            aria-label={`${starValue} star`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                active ? "text-(--dpink)" : "text-lgray"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
