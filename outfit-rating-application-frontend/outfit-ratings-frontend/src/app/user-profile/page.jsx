"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OutfitCardList from "@/components/organisms/OutfitCardList";
import UserProfileSidebar from "@/components/organisms/UserProfileSidebar";
import { getCurrentUser } from "@/services/authService";
import { getOutfitsByCreatorId } from "@/services/getOutfit";
import { deleteOutfit } from "@/services/mutateOutfit";

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

        // Fetch outfits for this creator (creatorId = userId)
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

  async function handleDelete(id) {
    try {
      await deleteOutfit(id);
      setOutfits((prev) => prev.filter((o) => (o.outfitId || o.id) !== id));
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete outfit");
    }
  }

  return (
    <main className="min-h-screen">
      <div className="flex flex-col md:flex-row">
        <UserProfileSidebar user={user} outfits={outfits || []} />

        <div className="flex-1 linear-gradient">
          <div className="px-6 mx-auto max-w-7xl">
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-white mt-8">My Outfits</h1>
              <p className="text-white mt-2 mb-2">View and manage your posts</p>
            </div>

            {error && (
              <div className="text-center mb-4">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-lg">Loading your profile...</p>
                </div>
              </div>
            ) : (
              <OutfitCardList
                outfits={outfits}
                showControls={true}
                onDelete={handleDelete}
                compact={true}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
