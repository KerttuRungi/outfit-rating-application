"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createOutfit } from "@/services/mutateOutfit";
import { Upload } from "lucide-react";

// const styleOptions = [
// 	"Casual", "Formal", "Sporty", "Streetwear", "Vintage", "Other"
// ];

export default function CreateOutfitPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  //const [style, setStyle] = useState(styleOptions[0]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Send the actual file so backend can save it (FormData handled in service)
      await createOutfit({ name, description, imageFile: image });
      router.push("/explore");
    } catch (err) {
      setError("Failed to create outfit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#17010D] to-[#F02692] flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex-1 grid grid-cols-12 gap-4 px-8 py-10"
      >
        {/* Left fields */}
        <div className="col-span-4 flex flex-col gap-6 justify-center">
          <div className="text-white text-xl font-semibold mb-2">TITLE</div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/70 rounded-2xl px-6 py-3 text-lg font-medium text-gray-800 placeholder-gray-500 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white/70 rounded-2xl px-6 py-3 text-lg text-gray-800 placeholder-gray-500 outline-none"
            required
          />
          {/* <select
						value={style}
						onChange={e => setStyle(e.target.value)}
						className="bg-white/70 rounded-2xl px-6 py-3 text-lg text-gray-800 outline-none"
					>
						{styleOptions.map(opt => (
							<option key={opt} value={opt}>{opt}</option>
						))}
					</select>*/}
        </div>
        {/* Right image and upload */}
        <div className="col-span-8 flex flex-col items-center justify-center">
          <div className="bg-white/70 rounded-2xl flex items-center justify-center w-[400px] h-[400px] mb-6">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                width={360}
                height={360}
                className="object-contain rounded-xl max-w-full max-h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <label className="w-[400px]">
            <div className="flex items-center bg-white/70 rounded-2xl px-6 py-3 cursor-pointer">
              <span className="flex-1 text-gray-800">Upload image</span>
              <Upload />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </label>
        </div>
        {/* Submit button at the bottom */}
        <div className="col-span-12 flex justify-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl px-10 py-3 text-lg shadow-md transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Outfit"}
          </button>
        </div>
        {error && (
          <div className="col-span-12 text-center text-red-600 mt-2">
            {error}
          </div>
        )}
      </form>
    </main>
  );
}
