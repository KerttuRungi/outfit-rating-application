"use client";

import React, { useState, useEffect } from "react";
import OutfitPostCard from "./OutfitCard";
import { getAllOutfits } from "../../services/outfitService";

export default function OutfitCardList() {
	const [outfits, setOutfits] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		getAllOutfits()
			.then((data) => setOutfits(data || []))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <div className="text-center p-4">Loading outfits...</div>;
	if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

	return (
		<div className="grid grid-cols-12 gap-6 p-6">
			{outfits.map((outfit, i) => (
				<div key={outfit.outfitId || outfit.id || i} className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
					<OutfitPostCard outfit={outfit} eager={i === 0} />
				</div>
			))}
		</div>
	);
}
