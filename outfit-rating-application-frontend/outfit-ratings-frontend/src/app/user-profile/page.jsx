"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OutfitCardList from "@/components/organisms/OutfitCardList";
import { getCurrentUser } from "@/services/authService";
import { getOutfitsByCreatorId, getAllOutfits } from "@/services/getOutfit";

export default function UserProfilePage() {
  const router = useRouter();
  const [outfits, setOutfits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndOutfits = async () => {
      try {
        // Check if user is logged in
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/auth/login");
          return;
        }

        setUser(currentUser);

        const userOutfits = await getOutfitsByCreatorId(currentUser.userId);
        setOutfits(userOutfits);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load your profile or outfits: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOutfits();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div>
        <h1 className="text-3xl font-bold text-white text-center mt-8">
          My Outfits
        </h1>
        <p className="text-center text-white mt-2 mb-8">{user?.email}</p>
        <OutfitCardList outfits={outfits} />
      </div>
    </main>
  );
}
