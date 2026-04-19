# Copilot Instructions — Outfit Rating Application

## Project Overview

This is a full-stack **outfit sharing and rating web application** (Estonian university graduation thesis). Users register, post outfit photos with a name and description, and rate each other's outfits on a 1–5 star scale.

---

## Repository Structure

```
outfit-rating-application/
├── Outfit-Rating-Backend/          # ASP.NET Core Web API (entry point)
│   ├── Controllers/                # HTTP controllers
│   ├── Program.cs                  # App bootstrap, DI registration
│   ├── appsettings.json            # Config (connection string, etc.)
│   └── Outfit-Rating-Backend.sln   # Solution file
├── OutfitRating.Application/       # Application layer (Clean Architecture)
│   ├── Dtos/                       # Data Transfer Objects
│   ├── Interfaces/                 # Service abstractions
│   └── Services/                   # Business logic implementations
├── OutfitRating.Domain/            # Domain entities
│   └── Entities/                   # Outfit, Rating, ApplicationUser, OutfitImages
├── OutfitRating.Infrastructure/    # Data access layer
│   ├── AppDbContext.cs             # EF Core DbContext
│   └── Migrations/                 # EF Core migrations
└── outfit-rating-application-frontend/
    └── outfit-ratings-frontend/    # Next.js 16 frontend
        ├── src/
        │   ├── app/                # Next.js App Router pages
        │   │   ├── auth/           # login / register pages
        │   │   ├── explore/        # browse all outfits
        │   │   └── create-post/    # create new outfit post
        │   ├── components/
        │   │   ├── atoms/          # smallest UI units
        │   │   ├── molecules/      # composed components
        │   │   └── organisms/      # full feature sections
        │   ├── services/           # API call modules
        │   │   ├── authService.js
        │   │   ├── getOutfit.js
        │   │   ├── mutateOutfit.js
        │   │   └── ratingService.js
        │   ├── lib/
        │   │   ├── apiClient.js    # central fetch wrapper
        │   │   └── menuItems.js
        │   └── helpers/
        ├── package.json
        └── next.config.mjs
```

---

## Architecture

**Backend**: ASP.NET Core Web API following Clean Architecture with three separate class library projects:

| Layer | Project | Role |
|-------|---------|------|
| API | `Outfit-Rating-Backend` | Controllers, DI wiring, middleware pipeline |
| Application | `OutfitRating.Application` | Service interfaces + implementations, DTOs |
| Domain | `OutfitRating.Domain` | Plain entity classes (no dependencies) |
| Infrastructure | `OutfitRating.Infrastructure` | `AppDbContext`, EF Core migrations |

**Frontend**: Next.js 16 App Router, React 19, Tailwind CSS v4. Uses both server components (for SSR data fetching with cookie forwarding) and client components.

---

## Key Domain Concepts

- **Outfit**: A post created by a user. Has a name, description, images, and aggregated rating stats (`AverageRating`, `RatingsCount`).
- **Rating**: A 1–5 integer value. One rating per user per outfit (upsert logic in `RatingService`). Rating stats are denormalized back to `Outfit` on every update.
- **OutfitImages**: Stores file paths for images attached to an outfit. Images are stored on disk under `wwwroot/images/` on the backend.
- **ApplicationUser**: Extends `IdentityUser` (no extra fields currently).

---

## Important Naming Quirk

> **`AppDbContext.OutfitRating` is the `DbSet<Outfit>` (not a rating table).**

The EF Core `DbSet` for `Outfit` entities is named `OutfitRating` — this does **not** hold `Rating` entities. The ratings table is `AppDbContext.Ratings`. Always use the correct set:

```csharp
_context.OutfitRating  // → Outfit entities
_context.Ratings       // → Rating entities
```

---

## Authentication

- Uses **ASP.NET Core Identity** with built-in `/auth` endpoints (`MapIdentityApi<ApplicationUser>()`).
- Auth is **cookie-based** (`useCookies=true` query param on login).
- Cookie is configured `SameSite=None; Secure=Always` to support cross-origin requests between the Next.js frontend (port 3000) and the backend.
- The logout endpoint is a custom controller at `POST /auth/logout` that calls `SignOutAsync()`.
- Frontend uses `credentials: "include"` on all fetch calls.
- For **server-side** Next.js pages, the `Cookie` header is forwarded manually from `next/headers` to the backend.

---

## API Endpoints

All outfit endpoints require authentication (`[Authorize]`). Rate limiting is applied (fixed window: 5 req / 12 s).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/OutfitRating` | List all outfits |
| GET | `/api/OutfitRating/{id}` | Get outfit by ID |
| POST | `/api/OutfitRating` | Create outfit (multipart/form-data) |
| PUT | `/api/OutfitRating/{id}` | Update outfit (owner only) |
| DELETE | `/api/OutfitRating/{id}` | Delete outfit (owner only) |
| POST | `/api/OutfitRating/{id}/rating` | Rate an outfit (body: `{ value: 1-5 }`) |
| POST | `/auth/login` | Login (Identity) |
| POST | `/auth/register` | Register (Identity) |
| POST | `/auth/logout` | Logout (custom controller) |
| GET | `/auth/manage/info` | Get current user info (Identity) |

---

## Image Handling

- Images are uploaded as `multipart/form-data` via `IFormFile` in `OutfitDto.Images`.
- `FileService` validates extension (`.jpg`, `.jpeg`, `.png`, `.webp`) and size (max 3 MB).
- Files are saved to `wwwroot/images/<guid>.<ext>` on the backend server.
- `OutfitImages.FilePath` is stored as `/images/<filename>` (relative).
- Frontend constructs full image URLs using `getImageUrl()` in `getOutfit.js`, prepending `NEXT_PUBLIC_API_URL`.

---

## Configuration

### Backend
- `appsettings.json` → `ConnectionStrings.DefaultConnection`: SQL Server connection string (empty by default; must be set locally or via environment/secrets).
- CORS policy `"AllowNextJS"` allows `http://localhost:3000` with credentials.

### Frontend
- `NEXT_PUBLIC_API_URL`: Environment variable pointing to the backend base URL (e.g., `http://localhost:5000`). Must be set in `.env.local`.

---

## Running Locally

### Backend
1. Set the SQL Server connection string in `appsettings.json` or user secrets.
2. Apply migrations: `dotnet ef database update` (run from the solution root or `Outfit-Rating-Backend/`).
3. Start backend: `dotnet run` inside `Outfit-Rating-Backend/` (defaults to HTTPS + HTTP ports in `launchSettings.json`).

### Frontend
1. Create `outfit-rating-application-frontend/outfit-ratings-frontend/.env.local` with:
   ```
   NEXT_PUBLIC_API_URL=https://localhost:<backend-port>
   ```
2. Install deps: `npm install` inside the `outfit-ratings-frontend/` directory.
3. Start dev server: `npm run dev` (runs on `http://localhost:3000`).

---

## Development Conventions

- **Backend**: Standard C# / ASP.NET Core conventions. Services are scoped (`AddScoped`). All services use constructor injection.
- **DTOs** are the contract between the API and service layers. `OutfitDto` is reused for create, update, and response (fields like `Images` are nullable).
- **Authorization enforcement** at the controller level: ownership (`CreatorId == userId`) is checked before mutating or deleting outfits.
- **Frontend**: JavaScript (not TypeScript). Components follow atomic design (atoms → molecules → organisms). All backend calls go through `src/lib/apiClient.js`, which handles 401 redirects and JSON parsing.
- The frontend uses **Next.js App Router** exclusively. Server components fetch data server-side (passing the cookie header); client components use `"use client"` and call APIs directly with `credentials: "include"`.

---

## Known Issues / Workarounds

- There are no automated tests in this repository (no test projects or test files).
- `appsettings.json` has an empty `DefaultConnection` — always configure this locally before running the backend.
- The frontend `.gitignore` excludes `.env.local`, so the API URL must be set up manually in each environment.
- `FileService.DeleteImagesAsync` is fire-and-forget (returns `Task.CompletedTask`) — file deletion errors are silently swallowed.
- The `OutfitRating` DbSet name is misleading (see naming quirk above).
