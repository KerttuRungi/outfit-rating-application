"use client";

import { useState, useEffect, useMemo } from "react";
import OutfitPostCard from "../molecules/OutfitCard";
import Select from "@/components/atoms/Select";
import { getAllStyles } from "@/services/styleFiltersService";
import SearchBar from "../atoms/SearchBar";

export default function OutfitCardList({
  outfits: initialOutfits,
  showControls = false,
  onDelete,
  compact = false,
  enableStyleFilter = false,
}) {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [styles, setStyles] = useState([]);
  const [stylesLoading, setStylesLoading] = useState(true);
  const [search, setSearch] = useState("");

  function handleSearch(newSearch) {
    setSearch(newSearch);
  }

  const [outfits, setOutfits] = useState(initialOutfits || []);
  useEffect(() => {
    setOutfits(initialOutfits || []);
  }, [initialOutfits]);

  function handleRatingUpdated(outfitId, updatedData) {
    setOutfits((prev) =>
      prev.map((o) => ((o.id || o.outfitId) === outfitId ? updatedData : o)),
    );
  }

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
    let result = outfits;

    if (enableStyleFilter && selectedStyle) {
      result = result.filter((o) => o.styleId == selectedStyle);
    }

    if (search.trim()) {
      const normalizedSearch = search.trim().toLowerCase();

      result = result.filter((o) =>
        (o.name || "").toLowerCase().includes(normalizedSearch),
      );
    }
    return result;
  }, [outfits, selectedStyle, enableStyleFilter, search]);

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
    <main className="px-6 mx-auto max-w-7xl">
      <div className="flex flex-row items-center gap-4">
        <SearchBar
          value={search}
          search={handleSearch}
          placeholder="Search outfits..."
        />
        {enableStyleFilter && (
          <div className="w-full max-w-sm">
            <Select
              options={styles}
              value={selectedStyle}
              onChange={setSelectedStyle}
              variant={enableStyleFilter ? "explore" : "default"}
              placeholder="All styles"
              className="flex items-center justify-between w-full px-4 py-2 rounded-xl bg-white text-white placeholder:text-gray focus:outline-none"
            />
          </div>
        )}
      </div>

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
                onRatingUpdated={handleRatingUpdated}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
