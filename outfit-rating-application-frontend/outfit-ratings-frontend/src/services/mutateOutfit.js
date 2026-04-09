const API_URL = process.env.NEXT_PUBLIC_API_URL;
const OUTFITS_URL = `${API_URL}/api/OutfitRating`;

import { apiRequest } from "@/lib/apiClient";

export async function createOutfit(outfitData) {
  const formData = new FormData();
  formData.append("Name", outfitData.name);
  formData.append("Description", outfitData.description);
  //other fields here, style in the future

  // Image handling: [Fromform] on backend
  if (outfitData.imageFile) {
    formData.append("ImageFile", outfitData.imageFile);
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
