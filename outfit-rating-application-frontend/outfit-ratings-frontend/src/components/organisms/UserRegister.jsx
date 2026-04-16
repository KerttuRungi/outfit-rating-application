"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { register, login } from "@/services/authService";
import ValidateEmail from "@/helpers/emailRegex";
import ValidatePassword from "@/helpers/passwordRegex";

export default function UserRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!email.trim()) {
      setEmailError("Enter email");
      return;
    }

    if (!ValidateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (!password) {
      setPasswordError("Enter password");
      return;
    }

    if (!ValidatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 character, contain atleast 1 upper lowercase letter, number and special character",
      );
      return;
    }

    if (password !== confirmPassword) {
      const err = "Passwords do not match.";
      setPasswordError(err);
      setConfirmPasswordError(err);
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      // Registered users are automatically logged in
      await login(email, password);
      setSuccess("Registration successful! Redirecting...");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/explore");
      router.refresh();
    } catch (err) {
      const errorMsg =
        err &&
        (err.errors
          ? Object.values(err.errors).flat().join(", ")
          : err.message || err.error);
      setError(errorMsg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-transparent overflow-hidden shadow-lg">
        <div className="bg-white rounded-r-2xl p-12 flex flex-col justify-center gap-6 h-full">
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
            noValidate
          >
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {success && (
              <p className="text-sm text-black font-medium">{success}</p>
            )}

            <div className="flex flex-col">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setError("");
                  }}
                  placeholder="Email"
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 transition-all ${
                    emailError
                      ? "ring-2 ring-red-500"
                      : "focus:ring-[var(--dpink)]"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 ml-4 text-xs text-red-500 font-medium italic">
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                    setError("");
                  }}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 transition-all ${
                    passwordError
                      ? "ring-2 ring-red-500"
                      : "focus:ring-[var(--dpink)]"
                  }`}
                />
              </div>
              {passwordError && (
                <p className="mt-1 ml-4 text-xs text-red-500 font-medium italic">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                    setPasswordError("");
                    setError("");
                  }}
                  placeholder="Confirm password"
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 transition-all ${
                    confirmPasswordError
                      ? "ring-2 ring-red-500"
                      : "focus:ring-[var(--dpink)]"
                  }`}
                />
              </div>
              {confirmPasswordError && (
                <p className="mt-1 ml-4 text-xs text-red-500 font-medium italic">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-full bg-black text-white py-3 font-medium hover:opacity-95 disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Create an account"}
            </button>

            <p className="text-sm font-light text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-black hover:underline hover:text-[var(--dpink)]"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
