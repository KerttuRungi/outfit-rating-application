"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RatingStars from "../atoms/RatingStars";
import { rateOutfit } from "@/services/ratingService";
import { getImageUrl } from "../../services/getOutfit";

export default function OutfitPostCard({ id, outfit, onRatingUpdated }) {
  const [data, setData] = useState(outfit || null);
  const [loading, setLoading] = useState(!outfit && !!id);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [localRatingsCount, setLocalRatingsCount] = useState(outfit?.ratingsCount ?? 0);

  const router = useRouter();

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!data) return <div className="text-center p-4">No outfit found</div>;

  const outfitId = data.id || data.outfitId;
  const name = data.name || "Untitled";
  const description = data.description || "";
  const averageRating = data.averageRating ?? 0;
  const ratingsCount = localRatingsCount;
  const imageUrls = data.imageUrls || [];

  function handleNavigate() {
    if (!outfitId) return;
    router.push(`/explore/${outfitId}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      handleNavigate();
    }
  }

  // Update rating state when data changes
  useEffect(() => {
    setRating(averageRating);
    setIndex(0);
    setLocalRatingsCount(data.ratingsCount ?? 0);
  }, [data, averageRating]);

  //Navigating between imgages, if there are multiple
  function prevImage(e) {
    e?.stopPropagation();
    if (imageUrls.length === 0) return;
    setIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  }

  function nextImage(e) {
    e?.stopPropagation();
    if (imageUrls.length === 0) return;
    setIndex((i) => (i + 1) % imageUrls.length);
  }

  async function handleRatingChange(newRating) {
    setRating(newRating);
    // Optimistically update ratings count if user hasn't rated before
    // For simplicity, always increment if rating was 0 before
    if (rating === 0 && newRating > 0) {
      setLocalRatingsCount((prev) => prev + 1);
    }
    if (!outfitId) return;
    try {
      await rateOutfit(outfitId, newRating);
      onRatingUpdated?.(newRating);
    } catch (err) {
      // If error, revert optimistic update
      if (rating === 0 && newRating > 0) {
        setLocalRatingsCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
      console.error(err);
    }
  }

  return (
    <div
      className="h-full rounded-2xl overflow-hidden shadow-xl border hover:border-[var(--dpink)] bg-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="relative bg-gradient-to-br from-gray-100/80 to-white/60 h-96 flex items-center justify-center">
        {imageUrls.length > 0 ? (
          <>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={getImageUrl(imageUrls[index])}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover rounded-xl"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent rounded-b-xl pointer-events-none" />
            </div>
          </>
        ) : (
          <div className="text-gray-400">No image</div>
        )}

        {imageUrls.length > 1 && (
          <>
            <button
              aria-label="previous image"
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-[var(--dpink)] hover:text-white shadow-md border border-white/60 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              aria-label="next image"
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-[var(--dpink)] hover:text-white shadow-md border border-white/60 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}

        <div className="absolute left-2 bottom-3 flex items-center">
          <span className="text-xl font-bold text-white tracking-tight">
            {name}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-base font-medium text-gray-700 mb-2 capitalize tracking-tight">
          {description}
        </p>
        <div className="gap-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold">Average:</span>
            <span className="text-gray-700 font-bold">
              {averageRating.toFixed(1)}
            </span>
            <Star size={16} className="text-[var(--dpink)]" />
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <RatingStars
              outfitId={outfitId}
              value={rating}
              onChange={handleRatingChange}
            />
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
