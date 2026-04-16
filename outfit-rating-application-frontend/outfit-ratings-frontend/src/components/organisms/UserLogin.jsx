"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { login } from "@/services/authService";
import ValidateEmail from "@/helpers/emailRegex";
import ValidatePassword from "@/helpers/passwordRegex";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Clear errors on input change
  const handleInputChange = (setter, errorSetter, value) => {
    setter(value);
    errorSetter("");
    setError("");
  };

  //Show errors on submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    // Validation using your helpers
    if (!email.trim()) {
      setEmailError("Enter email");
      setLoading(false);
      return;
    }

    if (!ValidateEmail(email)) {
      setEmailError("Invalid email format");
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError("Enter password");
      setLoading(false);
      return;
    }

    if (!ValidatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 character, contain atleast 1 upper lowercase letter, number and special character",
      );
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      router.push("/explore");
      router.refresh();
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-transparent overflow-hidden shadow-lg">
        <div className="bg-white p-12 rounded-r-2xl flex flex-col justify-center gap-6 h-full">
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold text-black">Welcome!</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and password to log in.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="max-w-md w-full mt-6 space-y-4"
          >
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <div className="flex flex-col">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    handleInputChange(setEmail, setEmailError, e.target.value)
                  }
                  placeholder="Email"
                  className={`w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 transition-all ${
                    emailError
                      ? "ring-2 ring-red-500"
                      : "focus:ring-[var(--dpink)]"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 ml-4 text-xs text-red-500 font-medium italic animate-in fade-in slide-in-from-top-1">
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    handleInputChange(
                      setPassword,
                      setPasswordError,
                      e.target.value,
                    )
                  }
                  placeholder="Password"
                  className={`w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 transition-all ${
                    passwordError
                      ? "ring-2 ring-red-500"
                      : "focus:ring-[var(--dpink)]"
                  }`}
                />
              </div>
              {passwordError && (
                <p className="mt-1 ml-4 text-xs text-red-500 font-medium italic animate-in fade-in slide-in-from-top-1">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-full bg-black text-white py-3 font-medium hover:opacity-95 disabled:bg-gray-400 transition-opacity"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-sm font-light text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-black hover:underline hover:text-[var(--dpink)]"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
