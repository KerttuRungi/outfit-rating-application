// Index
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Plus, Search, User } from "lucide-react";
import FeatureCard from "@/components/molecules/FeatureCard";
import useAuth from "@/hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <main className="landing-page text-white pt-16">
      <section className="min-h-[80vh] w-full container mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative flex items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm opacity-90">
                <span className="uppercase tracking-wider">Welcome</span>
              </div>

              <h1 className="text-7xl leading-[0.95] font-extrabold tracking-tight drop-shadow-lg">
                SHARE
                <br />
                YOUR
                <br />
                STYLE
              </h1>

              <p className="max-w-xl text-lg text-white/80 mt-4">
                Share posts of your outfits, get reviews from other users.
                Explore their posts, view your favorite styles, and get
                inspired.
              </p>

              <div className="mt-6">
                {user ? (
                  <Link
                    href="/explore"
                    className="inline-block bg-white text-(--dpink) font-semibold px-6 py-3 rounded-full shadow"
                  >
                    Explore
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-block bg-white text-(--dpink) font-semibold px-6 py-3 rounded-full shadow"
                  >
                    Sign up to start posting
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="max-w-md w-full text-right">
              <h3 className="text-xl font-semibold">Discover & Inspire</h3>
              <p className="mt-3 text-sm text-white/80">
                Explore posts from others and share your own to your profile.
              </p>
            </div>

            {/* <div className="relative w-full max-w-md h-64 flex items-center justify-center">
              <div className="absolute w-56 h-40 rounded-lg bg-[var(--dpurple)] opacity-70 shadow-xl transform -translate-x-28 -translate-y-4 rotate-[-8deg]" />

              <div className="absolute w-64 h-44 rounded-lg bg-white/8 ring-4 ring-[var(--dpink)]/20 shadow-2xl transform -translate-x-10 -translate-y-8 rotate-[-1deg]" />

              <div className="absolute w-56 h-52 rounded-lg bg-white/10 ring-4 ring-[var(--dpink)]/30 shadow-2xl transform translate-x-24 translate-y-4 rotate-[6deg]" />
            </div> */}
          </div>
        </div>
      </section>

      <section className="w-full bg-white min-h-[550px] flex items-center text-gray py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold mb-8 text-(--gray)">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard Icon={Plus} title="Share">
              Post your outfits, upload images and get them seen by the
              community.
            </FeatureCard>

            <FeatureCard Icon={Star} title="Rate">
              Rate looks and receive feedback to refine your style.
            </FeatureCard>

            <FeatureCard Icon={Search} title="Inspire">
              Browse different styles and find inspiration.
            </FeatureCard>
            <FeatureCard Icon={User} title="Profile">
              Manage your profile, view posts and ratings.
            </FeatureCard>
          </div>
        </div>
      </section>
    </main>
    //Footer to be added
  );
}
