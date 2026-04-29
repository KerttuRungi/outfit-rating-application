const API_URL = process.env.NEXT_PUBLIC_API_URL;
const OUTFITS_URL = `/api/OutfitRating`;

import { apiRequest } from "@/lib/apiClient";

export async function createOutfit(outfitData) {
  const formData = new FormData();
  formData.append("Name", outfitData.name);
  formData.append("Description", outfitData.description);
  formData.append("StyleId", outfitData.styleId);

  // Image handling: [Fromform] on backend
  if (outfitData.imageFile) {
    formData.append("Images", outfitData.imageFile);
  }

  return apiRequest(OUTFITS_URL, {
    method: "POST",
    body: formData,
  });
}

export async function updateOutfit(id, outfitData) {
  const formData = new FormData();
  formData.append("Name", outfitData.name);
  formData.append("Description", outfitData.description);
  if (outfitData.styleId) {
    formData.append("StyleId", outfitData.styleId);
  }

  // Image handling for updates
  if (outfitData.imageFile) {
    formData.append("Images", outfitData.imageFile);
  }

  return apiRequest(`${OUTFITS_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteOutfit(id) {
  return apiRequest(`${OUTFITS_URL}/${id}`, {
    method: "DELETE",
  });
}
