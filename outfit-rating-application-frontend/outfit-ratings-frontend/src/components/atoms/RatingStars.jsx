"use client";

import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react"; //loader, will update in future
import { rateOutfit } from "@/services/ratingService";

export default function RatingStars({
  outfitId,
  value = 0,
  onChange,
  size = 18,
  readOnly = false,
}) {
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick(v) {
    if (readOnly || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await rateOutfit(outfitId, v);
      if (onChange) {
        onChange(v);
      }
    } catch (error) {
      console.error("Failed to rate outfit:", error);
      alert("Something went wrong with your rating.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="flex items-center space-x-1"
      role="radiogroup"
      aria-label="Rating"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isActive = hover ? starValue <= hover : starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() =>
              !readOnly && !isSubmitting && setHover(starValue)
            }
            onMouseLeave={() => !readOnly && !isSubmitting && setHover(0)}
            onFocus={() => !readOnly && !isSubmitting && setHover(starValue)}
            onBlur={() => !readOnly && !isSubmitting && setHover(0)}
            aria-checked={starValue === value}
            role="radio"
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            className={`p-0.5 transition-colors focus:outline-none ${
              readOnly || isSubmitting ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                isActive ? "text-[var(--dpink)]" : "text-gray-400"
              } ${isSubmitting ? "opacity-50" : "opacity-100"}`}
            />
          </button>
        );
      })}

      {isSubmitting && (
        <Loader2 size={14} className="animate-spin text-[var(--dpink)] ml-1" />
      )}
    </div>
  );
}
