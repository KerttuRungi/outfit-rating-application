# Outfit Rating Application

A full-stack web application where users can share outfit posts, upload images, and rate each other's looks. Built as a thesis project (lõputöö).

---

## Features

- **Share** – Create outfit posts with images and a description
- **Rate** – Rate outfits on a 1–5 star scale
- **Explore** – Browse all outfits or filter by style
- **Profile** – View your own posts and profile
- **Auth** – Register and log in with secure HttpOnly cookie sessions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons |
| Backend | ASP.NET Core Web API (.NET 8, Clean Architecture) |
| Database | SQL Server + Entity Framework Core |
| Auth | ASP.NET Identity (cookie-based) |

---

## Project Structure

```
outfit-rating-application/
├── outfit-rating-application-frontend/
│   └── outfit-ratings-frontend/     # Next.js frontend app
│       └── src/
│           ├── app/                  # Pages (App Router)
│           ├── components/           # Atoms, Molecules, Organisms
│           ├── services/             # API service functions
│           ├── helpers/              # Validation utilities
│           └── lib/                  # API client, shared utilities
├── Outfit-Rating-Backend/            # ASP.NET Core entry point (Controllers, Program.cs)
├── OutfitRating.Application/         # Business logic (Services, DTOs, Interfaces)
├── OutfitRating.Domain/              # Domain entities (Outfit, Rating, User, StyleFilters)
└── OutfitRating.Infrastructure/      # EF Core DbContext and Migrations
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server instance

### Backend Setup

1. Set the database connection string in `Outfit-Rating-Backend/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "your-sql-server-connection-string"
   }
   ```

2. Apply database migrations:
   ```bash
   dotnet ef database update --project OutfitRating.Infrastructure --startup-project Outfit-Rating-Backend
   ```

3. Run the API:
   ```bash
   cd Outfit-Rating-Backend
   dotnet run
   ```
   The API will be available at `https://localhost:7129` (HTTPS) or `http://localhost:5033` (HTTP).  
   Swagger UI is available at `/swagger` in development.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd outfit-rating-application-frontend/outfit-ratings-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```env
   NEXT_PUBLIC_API_URL=https://localhost:7129
   NEXT_PUBLIC_IMAGE_HOST=localhost
   NEXT_PUBLIC_IMAGE_PORT=7129
   NEXT_PUBLIC_IMAGE_PROTOCOL=https
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## API Overview

All endpoints require authentication unless otherwise noted. Rate limiting applies: **5 requests per 12 seconds**.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/OutfitRating` | Get all outfits |
| `POST` | `/api/OutfitRating` | Create a new outfit |
| `GET` | `/api/OutfitRating/{id}` | Get outfit by ID |
| `PUT` | `/api/OutfitRating/{id}` | Update outfit (owner only) |
| `DELETE` | `/api/OutfitRating/{id}` | Delete outfit (owner only) |
| `POST` | `/api/OutfitRating/{id}/rating` | Rate an outfit (1–5) |
| `GET` | `/api/OutfitRating/style/{styleId}` | Filter outfits by style |
| `GET` | `/api/OutfitRating/creator/{creatorId}` | Get outfits by creator |
| `GET/POST` | `/api/StyleFilters` | List or manage style filters |
| `*` | `/auth/*` | ASP.NET Identity auth endpoints |

### Image Uploads

- Accepted formats: `.jpg`, `.png`
- Maximum file size: **3 MB**
- Stored in `wwwroot/images/` and served as static files
