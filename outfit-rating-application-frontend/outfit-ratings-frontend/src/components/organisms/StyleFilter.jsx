"use client";

import React, { useMemo, useState } from "react";
import Select from "@/components/atoms/Select";
import OutfitCardList from "./OutfitCardList";

export default function StyleFilter({ outfits = [] }) {
  const [selectedStyle, setSelectedStyle] = useState("");

  const styleOptions = useMemo(() => {
    const setOfStyles = new Set(
      outfits.map((o) => (o.styleName ? o.styleName : "Unknown")),
    );
    const options = [{ label: "All styles", value: "" }];
    for (const s of Array.from(setOfStyles)) {
      options.push({ label: s, value: s });
    }
    return options;
  }, [outfits]);

  const filtered = selectedStyle
    ? outfits.filter((o) => (o.styleName ? o.styleName : "Unknown") === selectedStyle)
    : outfits;

  return (
    <div>
      <div className="flex justify-center w-full mb-4">
        <div className="w-full max-w-sm">
          <Select
            label="Filter by style"
            options={styleOptions}
            value={selectedStyle}
            onChange={(v) => setSelectedStyle(v)}
            placeholder="All styles"
          />
        </div>
      </div>

      <OutfitCardList outfits={filtered} />
    </div>
  );
}
