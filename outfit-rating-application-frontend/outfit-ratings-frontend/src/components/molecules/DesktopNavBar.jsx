// src/components/molecules/DesktopNavBar.jsx
"use client";
import React, { useEffect, useState } from "react";
import menuItems from "../../lib/menuItems";
import Link from "next/link";
import { Star, User } from "lucide-react";
import { getCurrentUser } from "@/services/authService";

export default function DesktopNavBar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted && u) setUser(u);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <nav className="w-full">
      <div className="bg-[var(--dpink-70)] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center h-14 px-6 shadow-2xl">
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="home"
              className="inline-flex items-center justify-center text-white"
            >
              <Star size={20} className="hover-spin" />
            </Link>
          </div>
          <div className="flex items-center gap-10 justify-self-center">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white hover:text-[var(--lpink)] font-medium tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 justify-self-end">
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="inline-flex items-center h-8 px-3 rounded-full bg-[var(--dpink)] hover:bg-[var(--dpurple-10)] hover:text-[var(--lpink)] text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center h-8 px-3 rounded-full bg-[var(--dpink)] hover:bg-[var(--dpurple-10)] hover:text-[var(--lpink)] text-white"
              >
                Register
              </Link>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                type="button"
                aria-label="profile"
                aria-haspopup="true"
                aria-expanded={showMenu}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border-2 border-white/20 bg-[var(--dpink)]"
              >
                <User size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
