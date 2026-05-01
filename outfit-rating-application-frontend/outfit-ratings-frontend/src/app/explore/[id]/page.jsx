"use client";

// Details of an outfit — restyled to match the create-post UI

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import RatingStars from "@/components/atoms/RatingStars";
import { getOutfitById, getImageUrl } from "@/services/getOutfit";

export default function OutfitDetailPage() {
  const params = useParams();
  const outfitId = params?.id;
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!outfitId) return;
    setLoading(true);
    setError(null);
    getOutfitById(outfitId)
      .then((data) => setOutfit(data))
      .catch(() => setError("Failed to load outfit"))
      .finally(() => setLoading(false));
  }, [outfitId]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!outfit) return <div className="text-center p-8">Outfit not found</div>;

  const {
    name,
    description,
    averageRating,
    ratingsCount,
    imageUrls,
    styleName,
  } = outfit;

  // function prevImage() {
  //   if (!imageUrls || imageUrls.length === 0) return;
  //   setImageIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  // }
  // function nextImage() {
  //   if (!imageUrls || imageUrls.length === 0) return;
  //   setImageIndex((i) => (i + 1) % imageUrls.length);
  // }

  return (
    <main className="min-h-screen w-full flex flex-col bg-transparent mt-20">
      <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-x-12 px-4 md:px-12 py-8 md:py-10 max-w-[1200px] mx-auto w-full">
        <div className="w-full md:col-span-5 flex flex-col">
          <div className="relative bg-white/80 rounded-2xl h-70 md:h-130 w-full flex items-center justify-center overflow-hidden shadow-md">
            {imageUrls && imageUrls.length > 0 ? (
              <>
                <Image
                  src={getImageUrl(imageUrls[imageIndex])}
                  alt={name}
                  fill
                  className="object-cover"
                />
                {/* <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                >
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                >
                </button> 
              </>*/}
                {}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-(--lgray) px-6">
                No image available
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:col-span-7 flex flex-col gap-6">
          <div className="w-full mt-2 md:mt-6 mb-2">
            <h1 className="text-3xl font-bold text-white text-center">
              Outfit details
            </h1>
          </div>

          <div className="bg-white/80 rounded-2xl px-6 py-4 font-semibold text-gray">
            {name || "Untitled"}
          </div>

          <div className="bg-white/80 rounded-2xl px-6 py-4 text-gray font-semibold">
            {description || "No description provided."}
          </div>

          <div className="bg-white/80 rounded-2xl px-6 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-gray font-semibold">Average rating</span>
              <div className="flex items-center gap-3">
                <RatingStars value={averageRating} readOnly size={24} />
                <span className="text-gray text-sm">{averageRating ?? 0}</span>
              </div>
            </div>
            <div className="text-gray text-sm">
              Rated by: {ratingsCount ?? 0} users
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl px-6 py-4 text-gray">
            <span className="font-semibold">Style</span>
            <div className="mt-2 text-sm text-gray">
              {styleName ?? "No style specified"}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
