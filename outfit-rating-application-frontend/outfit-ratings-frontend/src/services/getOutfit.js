const API_URL = process.env.NEXT_PUBLIC_API_URL;
const OUTFITS_URL = `/api/OutfitRating`;

import { apiRequest } from "@/lib/apiClient";

export async function getAllOutfits(cookieHeader) {
  return apiRequest(OUTFITS_URL, { method: "GET" }, cookieHeader);
}

export async function getOutfitById(id, cookieHeader) {
  return apiRequest(
    `${OUTFITS_URL}/${id}`,
    { method: "GET", cache: "no-store" },
    cookieHeader,
  );
}

export async function getOutfitsByCreatorId(creatorId, cookieHeader) {
  return apiRequest(
    `${OUTFITS_URL}/creator/${creatorId}`,
    { method: "GET" },
    cookieHeader,
  );
}

export function getImageUrl(imagePath) {
  if (!imagePath) return "";

  // Url for images
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Ensure imagePath starts with /
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;
  return `${API_URL}${normalizedPath}`;
}
