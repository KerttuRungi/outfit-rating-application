import React from "react";
import Link from "next/link";
import menuItems from "../../lib/menuItems";
import { Star, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const resources = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
  ];

  const features = [
    { label: "Create outfit post", href: "/explore" },
    { label: "My outfit posts", href: "/user-profile" },
  ];

  return (
    <footer className="w-full">
      <div className="bg-(--dpink)/50 backdrop-blur-md border-t border-white/10">
        <div className="px-6 mx-auto max-w-7xl py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2">
                <Star size={20} className="text-white" />
                <span className="text-white font-semibold">Outfit Ratings</span>
              </Link>
              <span className="text-white/70 text-sm">© {year}</span>
            </div>

            <div className="flex gap-8 md:gap-12 ml-auto">
              <div className="flex flex-col items-start">
                <h4 className="text-white/90 text-sm font-semibold mb-2">
                  Features
                </h4>
                <div className="flex flex-col items-start gap-1">
                  {features.map((f) => (
                    <Link
                      key={f.label}
                      href={f.href}
                      className="text-white/70 hover:text-white text-xs font-medium transition-colors"
                    >
                      {f.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <h4 className="text-white/90 text-sm font-semibold mb-2">
                  Navigate
                </h4>
                <div className="flex flex-col items-start gap-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-white/70 hover:text-white text-xs font-medium uppercase tracking-wider transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <h4 className="text-white/90 text-sm font-semibold mb-2">
                  Resources
                </h4>
                <div className="flex flex-col items-end gap-1">
                  {resources.map((r) => (
                    <Link
                      key={r.label}
                      href={r.href}
                      className="text-white/70 hover:text-white text-xs font-medium transition-colors"
                    >
                      {r.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-6 pt-3">
            <div className="text-center text-white/60 text-xs flex justify-center items-center gap-1">
              Made with <Heart size={14} className="inline-block text-white" />{" "}
              by KR
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
