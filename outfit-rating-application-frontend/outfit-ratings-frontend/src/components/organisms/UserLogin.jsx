"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { login } from "@/services/authService";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/explore");
      router.refresh(); // Refresh to update auth state in the app
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-transparent overflow-hidden shadow-lg">
        <div className="bg-white rounded-l-3xl p-12 flex flex-col justify-center gap-6 h-full">
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold text-black">Welcome!</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and password to log in.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mt-6 space-y-4"
          >
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <label className="relative block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#F02692]"
              />
            </label>

            <label className="relative block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#F02692]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-full bg-black text-white py-3 font-medium hover:opacity-95 disabled:bg-gray-400"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-sm font-light text-gray-500">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-black hover:underline hover:text-[#F02692]"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
        <div className="hidden md:flex items-center justify-center bg-linear-to-b from-[#17010D] to-[#F02692]"></div>
      </div>
    </div>
  );
}
