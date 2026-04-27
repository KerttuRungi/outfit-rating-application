"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createOutfit } from "@/services/mutateOutfit";
import { getAllStyles } from "@/services/styleFiltersService";
import Select from "@/components/atoms/Select";
import { Upload, X } from "lucide-react";

export default function CreateOutfitPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [styles, setStyles] = useState([]);
  const [stylesLoading, setStylesLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const router = useRouter();

  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  useEffect(() => {
    async function fetchStyles() {
      try {
        const data = await getAllStyles();
        const styleOptions = data.map((style) => ({
          value: style.id,
          label: style.name,
        }));
        setStyles(styleOptions);
      } catch (err) {
        console.error("Failed to fetch styles", err);
      } finally {
        setStylesLoading(false);
      }
    }
    fetchStyles();
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setImageError("Invalid file type. Only JPG, JPEG, PNG or WEBP allowed.");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      return;
    }

    setImageError("");
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  // Clear field-specific errors on input change
  const handleInputChange = (setter, errorSetter, value) => {
    setter(value);
    errorSetter("");
    setError("");
  };

  function handleNameChange(value) {
    if (value.length > 20) {
      setName(value.slice(0, 20));
      setNameError("Title cannot exceed 20 characters");
    } else {
      handleInputChange(setName, setNameError, value);
    }
  }

  function handleDescriptionChange(value) {
    if (value.length > 200) {
      setDescription(value.slice(0, 200));
      setDescriptionError("Description cannot exceed 200 characters");
    } else {
      handleInputChange(setDescription, setDescriptionError, value);
    }
  }

  function removeImage() {
    setImage(null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setImageError("");
    setNameError("");
    setDescriptionError("");

    // Validate inputs
    let hasError = false;
    if (!name.trim()) {
      setNameError("Title is required");
      hasError = true;
    } else if (name.length > 20) {
      setNameError("Title cannot exceed 20 characters");
      hasError = true;
    }
    if (!description.trim()) {
      setDescriptionError("Description is required");
      hasError = true;
    } else if (description.length > 200) {
      setDescriptionError("Description cannot exceed 200 characters");
      hasError = true;
    }
    if (!selectedStyle) {
      setError("Style is required");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      if (image && !allowedImageTypes.includes(image.type)) {
        setImageError("Invalid file type.");
        setLoading(false);
        return;
      }
      await createOutfit({
        name,
        description,
        styleId: selectedStyle,
        imageFile: image,
      });
      router.push("/explore");
    } catch (err) {
      setError("Failed to create outfit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-transparent mt-20">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-x-12 px-4 md:px-12 py-8 md:py-10 max-w-[1200px] mx-auto w-full"
      >
        <div className="w-full md:col-span-12 mt-4 md:mt-8 mb-2">
          <h1 className="text-3xl font-bold text-white text-center">
            Create a post
          </h1>
        </div>

        <div className="w-full md:col-span-5 flex flex-col">
          <div className="relative  bg-white/80 rounded-2xl h-[280px] md:h-[520px] w-full flex items-center justify-center overflow-hidden shadow-md">
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 z-30 bg-white/80 hover:bg-[var(--dpink)] hover:text-white text-gray-700 rounded-full p-2 shadow-md border border-white/60 transition-colors"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <div className="text-center text-gray-400 px-8 flex flex-col items-center">
                {imageError ? (
                  <span className="text-red-500 font-medium">{imageError}</span>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Upload className="text-gray-500" />
                    </div>
                    <p className="font-semibold text-lg text-gray-700">
                      Choose a file
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      Recommended file types: JPG and PNG
                    </p>
                  </>
                )}
              </div>
            )}
            <input
              type="file"
              accept=".jpg,.png"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>
        </div>

        <div className="w-full md:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold ml-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Name your post"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`bg-white/80 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-400 border border-gray-200 focus:bg-white focus:ring-2 transition-all outline-none shadow-md ${
                nameError
                  ? "ring-2 ring-red-500"
                  : "focus:border-[var(--dpink)] focus:ring-[var(--dpink)]/20"
              }`}
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-500 font-medium">
                {nameError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold ml-1">
              Style
            </label> 
            <Select
              placeholder="Choose a style"
              options={styles}
              value={selectedStyle}
              onChange={setSelectedStyle}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold ml-1">
              Description
            </label>
            <textarea
              placeholder="Describe your outfit"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={8}
              className={`bg-white/80 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-400 border border-gray-200 focus:bg-white focus:ring-2 resize-none transition outline-none shadow-md ${
                descriptionError
                  ? "ring-2 ring-red-500"
                  : "focus:border-[var(--dpink)] focus:ring-[var(--dpink)]/20"
              }`}
            />
            {descriptionError && (
              <p className="mt-1 text-sm text-red-500 font-medium">
                {descriptionError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading || !image}
              className="w-full bg-white text-gray-700 font-bold rounded-2xl py-4 text-lg border border-gray-200 hover:bg-[var(--dpink)] hover:text-white hover:border-[var(--dpink)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md"
            >
              {loading ? "Uploading..." : "Upload post"}
            </button>

            {(error || imageError) && (
              <p className="text-red-500 text-sm font-medium text-center">
                {error || imageError}
              </p>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}
