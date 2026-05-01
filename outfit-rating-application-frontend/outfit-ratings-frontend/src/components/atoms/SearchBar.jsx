"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  value = "",
  search,
  placeholder = "Search outfits...",
}) {
  return (
    <div className="flex w-full justify-between items-center bg-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray">
      <input
        aria-label="Search outfits by name"
        placeholder={placeholder}
        value={value}
        onChange={(e) => search(e.target.value)}
        className="w-full border-none bg-transparent focus:ring-0 focus:outline-none "
      />
      <Search />
    </div>
  );
}
