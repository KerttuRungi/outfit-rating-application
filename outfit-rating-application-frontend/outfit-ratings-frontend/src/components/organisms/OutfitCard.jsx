"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RatingStars from "../atoms/RatingStars";
import { getOutfitById, updateOutfit, getImageUrl } from "../../services/outfitService";

export default function OutfitPostCard({ id, outfit, onRatingUpdated }) {
	const [data, setData] = useState(outfit || null);
	const [loading, setLoading] = useState(!outfit && !!id);
	const [error, setError] = useState(null);
	const [index, setIndex] = useState(0);
	const [rating, setRating] = useState(0);

	const router = useRouter();

	if (loading) return <div className="text-center p-4">Loading...</div>;
	if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
	if (!data) return <div className="text-center p-4">No outfit found</div>;

	const outfitId = data.outfitId;
	const name = data.name || "Untitled";
	const description = data.description || "";
	const averageRating = data.averageRating ?? 0;
	const ratingsCount = data.ratingsCount ?? 0;
	const imageUrls = data.imageUrls || [];

	function handleNavigate() {
		if (!outfitId) return;
		router.push(`/explore/${outfitId}`);
	}

	function handleKeyDown(e) {
		if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
			handleNavigate();
		}
	}

	// Update rating state when data changes
	useEffect(() => {
		setRating(averageRating);
		setIndex(0);
	}, [data, averageRating]);

	//Navigating between imgages, if there are multiple
	function prevImage(e) {
		e?.stopPropagation();
		if (imageUrls.length === 0) return;
		setIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
	}

	function nextImage(e) {
		e?.stopPropagation();
		if (imageUrls.length === 0) return;
		setIndex((i) => (i + 1) % imageUrls.length);
	}

	async function handleRatingChange(newRating) {
		setRating(newRating);
		if (!outfitId) return;
		try {
			await updateOutfit(outfitId, { averageRating: newRating });
			if (typeof onRatingUpdated === "function") onRatingUpdated(newRating);
		} catch (err) {
			console.error("Failed to save rating", err);
		}
	}

	return (
		<div
			className="max-w-sm rounded-xl overflow-hidden shadow-sm card-hover"
			onClick={handleNavigate}
			role="button"
			tabIndex={0}
			onKeyDown={handleKeyDown}
		>
			<div className="relative bg-gray-50 h-64 flex items-center justify-center">
				{imageUrls.length > 0 ? (
					<Image
						src={getImageUrl(imageUrls[index])}
						alt={name}
						fill
						sizes="(max-width: 640px) 100vw, 25vw"
						className="object-cover"
						loading="eager"
						/>
				) : (
					<div className="text-gray-400">No image</div>
				)}

				{imageUrls.length > 1 && (
					<>
						<button aria-label="previous image" onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white">
							<ArrowLeft size={20} />
						</button>
						<button aria-label="next image" onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white">
							<ArrowRight size={20} />
						</button>
					</>
				)}

				<div className="absolute left-3 top-3 text-md font-bold text-black bg-[#F02692]/50 rounded-lg px-2  uppercase">{name}</div>
			</div>

			<div className="p-4">
				<p className="text-sm font-semibold text-gray-600 mb-2 capitalize">{description}</p>
				<div className="flex items-center justify-between">
					<div>
						<div className="flex cols-2 gap-2 items-center">
							<div className="text-xs text-gray-600">Average rating:</div>
							<div className="text-xs text-gray-600">{averageRating.toFixed(1)}</div>
						</div>
						<div className="mt-1" onClick={(e) => e.stopPropagation()}>
							<RatingStars value={rating} onChange={handleRatingChange} />
						</div>
					</div>

					<div className="text-sm text-gray-700 font-medium">{ratingsCount} ratings</div>
				</div>
			</div>
		</div>
	);
}

