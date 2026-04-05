const API_URL = process.env.NEXT_PUBLIC_API_URL;
const OUTFITS_URL = `${API_URL}/api/OutfitRating`;

// Helper to construct full image URL from relative path
export function getImageUrl(imagePath) {
	if (!imagePath) return '';
	
	// Url for images
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	
	// Ensure imagePath starts with /
	const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
	return `${API_URL}${normalizedPath}`;
}

// Normalize API outfit data to consistent format
// API may return PascalCase but frontend expects camelCase
function normalizeOutfit(o) {
    if (!o) return null;
    return {
        outfitId: o.Id ?? o.id,
        name: o.Name ?? o.name ?? "",
        description: o.Description ?? o.description ?? "",
        averageRating: o.AverageRating ?? o.averageRating ?? 0,
        ratingsCount: o.RatingsCount ?? o.ratingsCount ?? 0,
        imageUrls: o.ImageUrls ?? o.imageUrls ?? [],
        _raw: o
    };
}

async function fetchOutfitPosts(url, options = {}) {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }

    if (res.status === 204) {
        return null;
    }

    return res.json();
}

export async function getAllOutfits() {
    const data = await fetchOutfitPosts(OUTFITS_URL, {
        method: 'GET',
        cache: 'no-store'
    });
    return (data || []).map(normalizeOutfit);
}

export async function getOutfitById(id) {
    const o = await fetchOutfitPosts(`${OUTFITS_URL}/${id}`, {
        method: 'GET',
        cache: 'no-store'
    });
    return o ? normalizeOutfit(o) : null;
}

export async function createOutfit(outfitData) {
    return fetchOutfitPosts(OUTFITS_URL, {
        method: 'POST',
        body: JSON.stringify(outfitData)
    });
}

export async function updateOutfit(id, outfitData) {
    return fetchOutfitPosts(`${OUTFITS_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(outfitData)
    });
}

export async function deleteOutfit(id) {
    return fetchOutfitPosts(`${OUTFITS_URL}/${id}`, {
        method: 'DELETE'
    });
}
