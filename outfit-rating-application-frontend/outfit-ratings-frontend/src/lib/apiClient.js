const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}, cookieHeader = null) {
  const headers = { ...options.headers };

  // Attach cookies for server-side components/pages
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Attach cookies for client-side
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) throw new Error(`API Error: ${res.status}`);

  return res.status === 204 ? null : res.json();
}
