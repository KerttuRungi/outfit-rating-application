"use client";

import React, { useMemo, useState, useEffect } from "react";
import OutfitPostCard from "../molecules/OutfitCard";
import Select from "@/components/atoms/Select";
import { getAllStyles } from "@/services/styleFiltersService";

export default function OutfitCardList({
  outfits,
  showControls = false,
  onDelete,
  compact = false,
  enableStyleFilter = false,
}) {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [styles, setStyles] = useState([]);
  const [stylesLoading, setStylesLoading] = useState(true);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const data = await getAllStyles();
        const styleOptions = [
          { value: "", label: "All styles" },
          ...data.map((style) => ({ value: style.id, label: style.name })),
        ];
        setStyles(styleOptions);
      } catch (err) {
        console.error("Failed to fetch styles", err);
      } finally {
        setStylesLoading(false);
      }
    }
    fetchStyles();
  }, []);

  const visibleOutfits = useMemo(() => {
    if (!enableStyleFilter || !selectedStyle) return outfits;
    return outfits.filter((o) => o.styleId == selectedStyle);
  }, [outfits, selectedStyle, enableStyleFilter]);

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
      {enableStyleFilter && (
        <div className="flex justify-center w-full mb-4">
          <div className="w-full max-w-sm">
            <Select
              label="Filter by style"
              options={styles}
              value={selectedStyle}
              onChange={setSelectedStyle}
              placeholder="All styles"
            />
          </div>
        </div>
      )}

      {visibleOutfits.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-white text-lg">
            {enableStyleFilter && selectedStyle
              ? "No outfits found for the selected style."
              : "No outfits found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6 py-6">
          {visibleOutfits.map((outfit, i) => (
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
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
