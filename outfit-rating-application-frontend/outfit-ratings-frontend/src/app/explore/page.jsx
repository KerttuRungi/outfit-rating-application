// All outfit posts
import CreateButton from "@/components/atoms/CreateButton";
import OutfitCardList from "@/components/organisms/OutfitCardList";
import { getAllOutfits } from "@/services/getOutfit";
import { cookies } from "next/headers";

export default async function ExplorePage() {
  const cookieHeader = (await cookies()).toString();
  const outfits = await getAllOutfits(cookieHeader);
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
        <OutfitCardList outfits={outfits} />
      </div>
    </main>
  );
}
