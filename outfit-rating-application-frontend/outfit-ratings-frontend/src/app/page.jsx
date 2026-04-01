  try {
    const outfits = await getAllOutfits();

    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">All Outfits</h1>
        <div className="grid gap-4">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="border p-4 rounded shadow">
              {/* Change 'name' to whatever property your C# Model has */}
              <h2 className="text-lg">{outfit.name}</h2>
              <p>Rating: {outfit.rating} / 5</p>
            </div>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    return <div className="text-red-500">Error loading outfits: {error.message}</div>;
