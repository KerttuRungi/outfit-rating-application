const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_URL = `${API_URL}/auth`;

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
