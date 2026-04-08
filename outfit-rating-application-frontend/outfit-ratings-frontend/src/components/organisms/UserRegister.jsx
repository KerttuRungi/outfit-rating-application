"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { register } from "@/services/authService";

export default function UserRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      setSuccess("Registration successful! You can now log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        err &&
        (err.errors
          ? Object.values(err.errors).flat().join(", ")
          : err.message || err.error);
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-transparent rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-white rounded-l-3xl p-12 flex flex-col justify-center gap-6 h-full">
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold text-black">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your details to register.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mt-6 space-y-4"
          >
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 font-medium">{success}</p>
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
                disabled={loading}
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
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#F02692]"
              />
            </label>

            <label className="relative block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#F02692]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-full bg-black text-white py-3 font-medium hover:opacity-95 disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Create an account"}
            </button>

            <p className="text-sm font-light text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-black hover:underline hover:text-[#F02692]"
              >
                Login here
              </a>
            </p>
          </form>
        </div>

        <div className="hidden md:flex items-center rounded-none justify-center bg-linear-to-b from-[#17010D] to-[#F02692]"></div>
      </div>
    </div>
  );
}
