"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function RatingStars({
  outfitId,
  value = 0,
  onChange,
  size = 18,
  readOnly = false,
}) {
  const [hover, setHover] = useState(0);
  const [displayValue, setDisplayValue] = useState(value); // Updates UI before DB change

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const activeValue = hover || displayValue;
  const isInteractable = !readOnly;

  function handleRate(v) {
    if (!isInteractable) return;
    setDisplayValue(v);
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
                active ? "text-[var(--dpink)]" : "text-lgray"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
