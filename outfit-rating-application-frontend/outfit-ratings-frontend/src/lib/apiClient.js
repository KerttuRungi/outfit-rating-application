const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}, cookieHeader = null) {
  const headers = { ...options.headers };

  // Automatically set Content-Type for JSON bodies
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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
      window.location.href = "/auth/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let errorMessage = `API Error: ${res.status}`;
    try {
      const errorData = await res.json();
      console.error("API error response:", errorData);
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = res.statusText || errorMessage;
      console.error("Backend error (non-JSON):", res.statusText);
    }
    throw new Error(errorMessage);
  }

  return res.status === 204 ? null : res.json();
}
