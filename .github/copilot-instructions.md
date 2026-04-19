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

## Coding Guidelines for AI Agents

### Frontend — Language

- **All frontend code must be written in JavaScript (`.js` / `.jsx`).** Do not introduce TypeScript (`.ts` / `.tsx`) files or type annotations.
- Use ES module syntax (`import`/`export`). No CommonJS (`require`).

### Frontend — Styling

- Use **Tailwind CSS utility classes** for all styling. Prefer composing utilities over writing custom CSS rules.
- **Use CSS custom properties (variables) from `globals.css` instead of hard-coding colour values.** The available variables are:

  | Variable | Value |
  |---|---|
  | `--dpink` | `#f92a98` (primary brand pink) |
  | `--lpink` | `#e7a2ca` (light pink) |
  | `--dpurple` | `#400424` (dark purple) |
  | `--dpink-70` | `rgba(249, 42, 152, 0.7)` |
  | `--dpurple-10` | `rgba(64, 4, 36, 0.1)` |
  | `--gradient-down` | dark-purple → dpink vertical gradient |
  | `--background` | page background gradient |
  | `--foreground` | default text colour |

  Reference them in Tailwind with the bracket notation, e.g. `text-[var(--dpink)]`, `bg-[var(--gradient-down)]`.

- **Use the global utility classes** defined in `globals.css` when they apply:
  - `.card-hover` — adds GPU-accelerated lift/scale/shadow on hover; apply to the root element of card components.
  - `.hover-spin` — makes an inline element spin on hover; use for decorative icon interactions.
- Do **not** add new custom CSS classes unless absolutely necessary. Extend Tailwind utilities or `globals.css` instead.
- Page backgrounds use `bg-[var(--background)]` or `bg-[var(--gradient-down)]`; keep text readable on these dark backgrounds (white or light colours).

### Frontend — Component Structure

- Follow **atomic design**: place the smallest reusable pieces in `atoms/`, composed groups in `molecules/`, and full feature sections in `organisms/`.
- Server components (no directive) handle SSR data fetching and forward cookies. Client components must have `"use client"` at the top.
- Never call the backend directly from a component — always go through the relevant service module in `src/services/` or `src/lib/apiClient.js`.

### Backend — RESTful API Design

- Follow REST conventions for all new endpoints:
  - Use nouns for resource paths, not verbs: `/api/outfits`, not `/api/getOutfits`.
  - Use HTTP methods semantically: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove).
  - Return appropriate HTTP status codes: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.
  - New resource collections should follow the existing pattern: `[Route("api/[controller]")]` on the controller class.
- Keep business logic out of controllers — delegate to the corresponding service in `OutfitRating.Application/Services/`.
- Add new service methods behind an interface in `OutfitRating.Application/Interfaces/` and register them as scoped in `Program.cs`.

### Backend — Security Practices

- **Authentication**: Every endpoint that reads or modifies user data must carry `[Authorize]`. Public endpoints must be explicitly reviewed before omitting it.
- **Ownership checks**: Before any mutating operation on a resource, verify `resource.CreatorId == GetUserId()` and return `403 Forbid()` on mismatch.
- **Input validation**: Validate all incoming DTOs. `FileService` enforces extension allowlist (`.jpg`, `.jpeg`, `.png`, `.webp`) and 3 MB size cap — do not bypass these checks.
- **Rate limiting**: The `"fixed"` rate-limiter policy (5 req / 12 s) is applied at the controller level via `[EnableRateLimiting("fixed")]`. Apply it to any new controller that accepts user-driven write operations.
- **No secrets in code**: Connection strings and other secrets must live in `appsettings.json` (local only, never committed with real values) or environment/user-secrets — never hard-coded.
- **CORS**: The existing `"AllowNextJS"` CORS policy (`http://localhost:3000`, credentials allowed) must not be loosened without explicit justification.
- **Cookie security**: Auth cookies are `HttpOnly`, `SameSite=None`, `Secure=Always`. Do not change these settings.

---

## Known Issues / Workarounds

- There are no automated tests in this repository (no test projects or test files).
- `appsettings.json` has an empty `DefaultConnection` — always configure this locally before running the backend.
- The frontend `.gitignore` excludes `.env.local`, so the API URL must be set up manually in each environment.
- `FileService.DeleteImagesAsync` is fire-and-forget (returns `Task.CompletedTask`) — file deletion errors are silently swallowed.
- The `OutfitRating` DbSet name is misleading (see naming quirk above).
