const API_URL = process.env.NEXT_PUBLIC_API_URL;
const OUTFITS_URL = `/api/OutfitRating`;

import { apiRequest } from "@/lib/apiClient";

export async function rateOutfit(id, rating) {
  const url = `${OUTFITS_URL}/${id}/rating`;

  return apiRequest(url, {
    method: "POST",
    body: JSON.stringify({ value: rating }),
    cache: "no-store",
  });
}
