// All outfit posts
import OutfitCardList from "@/components/organisms/OutfitCardList";
import { getAllOutfits } from "@/services/getOutfit";
import { cookies } from "next/headers";

export default async function ExplorePage() {
  const cookieHeader = (await cookies()).toString();
  const outfits = await getAllOutfits(cookieHeader);
  return (
    <main>
      <div>
        <h1 className="text-3xl font-bold text-white text-center mt-8">
          Explore Outfits
        </h1>
        <p className="text-center text-white mt-2 mb-2">
          Browse and rate outfits from the community
        </p>
        <OutfitCardList outfits={outfits} />
      </div>
    </main>
  );
}
