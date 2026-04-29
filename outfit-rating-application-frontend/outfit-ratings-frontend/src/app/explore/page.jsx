// All outfit posts
"use client";

import CreateButton from "@/components/atoms/CreateButton";
import OutfitCardList from "@/components/organisms/OutfitCardList";
import { getAllOutfits } from "@/services/getOutfit";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        if (!authLoading && !user) {
          router.push("/auth/login");
          return;
        }

        if (user) {
          const outfits = await getAllOutfits(user.userId);
          setOutfits(outfits);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(
          "Failed to load your profile or outfits: " + (err?.message || err),
        );
      }
    };

    fetchOutfits();
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen items-center justify-center flex">
        <p className="text-white text-lg">Loading...</p>
      </main>
    );
  }

  return (
    <main className="pt-16">
      <div>
        <h1 className="text-3xl font-bold text-white text-center mt-20">
          Explore Outfits
        </h1>
        <p className="text-center text-white mt-2 mb-2">
          Browse and rate outfits from the community
        </p>
        <div className="flex justify-center w-full mb-4">
          <div className="w-full max-w-sm">
            <CreateButton />
          </div>
        </div>
        <OutfitCardList outfits={outfits} enableStyleFilter />
      </div>
    </main>
  );
}
