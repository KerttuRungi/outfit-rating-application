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
    <nav className="fixed top-0 w-full z-50">
      <div className="bg-(--dpink)/50 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="px-6 mx-auto grid grid-cols-3 items-center h-16">

          <div className="flex items-center">
            <Link href="/" className="text-white hover:text-(--lpink-light) transition-colors">
              <Star size={22} className="hover-spin fill-current" />
            </Link>
          </div>

          <div className="flex items-center gap-8 justify-self-center">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/80 hover:text-white text-sm font-semibold tracking-widest uppercase transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5 justify-self-end">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-white/70 hover:text-white border border-white/20 px-4 py-1.5 rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-bold text-white/70 hover:text-white border border-white/20 px-4 py-1.5 rounded-full transition-all"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-white/70 hover:text-white border border-white/20 px-4 py-1.5 rounded-full transition-all"
              >
                Logout
              </button>
            )}
            {user && (
            <div
              className="relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <Link
                href="/user-profile"
                className="flex items-center justify-center h-10 w-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                <User size={18} className="text-white" />
              </Link>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-xs text-(--gray) truncate">
                    {user.email}
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
