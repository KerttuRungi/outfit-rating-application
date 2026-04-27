const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_URL = `${API_URL}/auth`;
import { apiRequest } from "@/lib/apiClient";
import { redirect } from "next/navigation";

export async function login(email, password) {
  const res = await fetch(`${AUTH_URL}/login?useCookies=true`, {
    //Identity login endpoint for cookies
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include", // Browser accepts and stores cookie from .NET API
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  return { success: true };
}

export async function register(email, password) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }
  return { success: true };
}

export async function logout() {
  const res = await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  return { success: true };
}

export async function getCurrentUser() {
  try {
    const res = await fetch(`${AUTH_URL}/manage/info`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const userInfo = await res.json();

    // Get the user ID from a separate endpoint
    try {
      const userIdResult = await fetch(`${AUTH_URL}/user-id`, {
        method: "GET",
        credentials: "include",
      });

      if (userIdResult.ok) {
        const idData = await userIdResult.json();
        userInfo.userId = idData.userId;
        console.log("User ID from /auth/user-id:", idData.userId);
      }
    } catch (err) {
      console.warn("Could not fetch user ID from /auth/user-id:", err);
    }

    return userInfo;
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

// Server-side helper for server components/pages.
export async function requireAuthServer(cookieHeader) {
  try {
    const userInfo = await apiRequest("/auth/manage/info", { method: "GET" }, cookieHeader);

    try {
      const idData = await apiRequest("/auth/user-id", { method: "GET" }, cookieHeader);
      if (idData?.userId) userInfo.userId = idData.userId;
    } catch (e) {
      // ignore user-id failure
    }

    return userInfo;
  } catch (err) {
    redirect("/auth/login");
  }
}
