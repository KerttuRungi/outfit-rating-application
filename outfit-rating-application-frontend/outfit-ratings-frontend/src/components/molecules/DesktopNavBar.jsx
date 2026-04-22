"use client";
import React, { useEffect, useState } from "react";
import menuItems from "../../lib/menuItems";
import Link from "next/link";
import { Star, User } from "lucide-react";
import { getCurrentUser, logout } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation"; // To redirect after logout

export default function DesktopNavBar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    //fetch user before rendering (could be made a global hook)
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (mounted) {
        setUser(currentUser);
      }
    }

    fetchUser();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null); // Clear local state
      router.push("/");
      router.refresh(); // Refresh the page to clear any cached user data
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="w-full">
      <div className="bg-[var(--dpink)] backdrop-blur-sm">
        <div className="px-5 mx-auto grid grid-cols-3 items-center h-14 shadow-2xl">
          <div className="flex items-center">
            <Link
              href="/"
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
              {!user ? (
                <>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center h-8 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center h-8 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center h-8 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Logout
                </button>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <Link
                href="/user-profile"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full transition-all bg-white/10 hover:bg-white/20 "
              >
                <User size={18} className="text-white" />
              </Link>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
                  <div className="px-4 py-2 text-xs text-gray-500 truncate">
                    {user.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
