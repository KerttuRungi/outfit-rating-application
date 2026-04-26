const STYLES_URL = `/api/Styles`;

import { apiRequest } from "@/lib/apiClient";

export async function getAllStyles(cookieHeader) {
  return apiRequest(STYLES_URL, { method: "GET" }, cookieHeader);
}

export async function getStyleById(id, cookieHeader) {
  return apiRequest(`${STYLES_URL}/${id}`, { method: "GET" }, cookieHeader);
}