# Copilot Instructions — Outfit Rating Application

## What This App Does

A full-stack **outfit sharing and rating** web app (Estonian university graduation thesis). Users register, post outfit photos with a name and description, and rate each other's outfits on a 1–5 star scale.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | ASP.NET Core Web API, Clean Architecture, EF Core, SQL Server, ASP.NET Identity |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, `lucide-react` icons, Montserrat font |
| Auth | Cookie-based (`SameSite=None; Secure=Always`), cross-origin between ports 3000 and 5033/7129 |

## Project Structure

```
outfit-rating-application/
├── Outfit-Rating-Backend/          # API entry point — controllers, Program.cs, appsettings.json, .sln
├── OutfitRating.Application/       # Business logic — Interfaces/, Services/, Dtos/
├── OutfitRating.Domain/            # Plain entities — Outfit, Rating, OutfitImages, ApplicationUser
├── OutfitRating.Infrastructure/    # AppDbContext, EF Core Migrations/
└── outfit-rating-application-frontend/outfit-ratings-frontend/
    └── src/
        ├── app/               # Next.js App Router pages (auth/, explore/, create-post/)
        ├── components/        # atoms/ → molecules/ → organisms/ (atomic design)
        ├── services/          # authService.js, getOutfit.js, mutateOutfit.js, ratingService.js
        └── lib/apiClient.js   # Central fetch wrapper — ALL API calls go through here
```

**Path alias**: `@/*` → `src/*` (defined in `jsconfig.json`).

## Running Locally

**Backend** (run from `Outfit-Rating-Backend/`):
```sh
# Set DefaultConnection in appsettings.json first (SQL Server connection string — never commit real values)
dotnet ef database update   # Apply migrations
dotnet run                  # http://localhost:5033 | https://localhost:7129 | Swagger at /swagger
```

**Frontend** (run from `outfit-rating-application-frontend/outfit-ratings-frontend/`):
```sh
# Create .env.local (git-ignored — must be set up manually each environment)
echo "NEXT_PUBLIC_API_URL=https://localhost:7129" > .env.local
npm install
npm run dev      # http://localhost:3000
npm run lint     # ESLint 9 flat config via eslint-config-next
npm run build    # Production build
```

**There are no automated tests** — no test projects or test runner is configured.

## API Endpoints (all under `[Authorize]` + `[EnableRateLimiting("fixed")]`)

| Method | Path | Notes |
|---|---|---|
| GET/POST | `/api/OutfitRating` | List all / Create (multipart/form-data) |
| GET/PUT/DELETE | `/api/OutfitRating/{id}` | By ID / Owner-only update or delete |
| POST | `/api/OutfitRating/{id}/rating` | Body: `{ value: 1–5 }` |
| POST | `/auth/login?useCookies=true` | Identity — sets HttpOnly cookie |
| POST | `/auth/register` | Identity |
| POST | `/auth/logout` | Custom `AuthController` → `SignOutAsync()` |
| GET | `/auth/manage/info` | Current user info |

## ⚠️ Critical Naming Gotcha

`AppDbContext.OutfitRating` is `DbSet<Outfit>` — **not** ratings. Ratings live in `AppDbContext.Ratings`.

## Coding Guidelines

### Frontend
- **JavaScript only** — `.js` / `.jsx`. No TypeScript, no CommonJS `require`.
- **All API calls** must go through `src/lib/apiClient.js` (`apiRequest()`). Never fetch directly from a component.
- **Server components** (no directive): fetch data SSR, pass `cookieHeader` from `next/headers`. **Client components**: `"use client"` at top, use `credentials: "include"`.
- **Atomic design**: atoms → molecules → organisms. New service functions go in `src/services/`.

### Styling
- **Tailwind CSS** for all styling — compose utilities, avoid new custom CSS classes.
- **Use CSS variables** from `globals.css` — never hard-code brand colours:
  - `--dpink` `#f92a98` · `--lpink` `#e7a2ca` · `--dpurple` `#400424`
  - `--dpink-70` · `--dpurple-10` · `--gradient-down` · `--background` · `--foreground`
  - Reference via bracket notation: `text-[var(--dpink)]`, `bg-[var(--gradient-down)]`
- **Use global utility classes** from `globals.css`: `.card-hover` (lift/scale/shadow on card root), `.hover-spin` (spin animation for decorative icons).
- Dark page backgrounds (`--background` / `--gradient-down`) — use white or light text.

### Backend
- **Clean Architecture**: controllers call services only. Business logic lives in `OutfitRating.Application/Services/`. New services must have an interface in `Interfaces/` and be registered as scoped in `Program.cs`.
- **RESTful design**: noun-based resource paths, semantic HTTP verbs, correct status codes (`201 Created`, `204 No Content`, `403 Forbidden`, `404 Not Found`). New controllers use `[Route("api/[controller]")]`.
- **Security**:
  - `[Authorize]` on every endpoint that touches user data.
  - Ownership check before any mutation: `resource.CreatorId == GetUserId()` → `Forbid()`.
  - `[EnableRateLimiting("fixed")]` on all write controllers (5 req / 12 s).
  - `FileService` enforces `.jpg/.jpeg/.png/.webp` allowlist and 3 MB cap — do not bypass.
  - Auth cookies: `HttpOnly`, `SameSite=None`, `Secure=Always` — do not change.
  - CORS `"AllowNextJS"` policy (`http://localhost:3000`) — do not loosen.

## Image Handling

`FileService` saves uploads to `wwwroot/images/<guid>.<ext>`. `OutfitImages.FilePath` stores `/images/<filename>`. Frontend builds full URLs with `getImageUrl()` in `getOutfit.js`, prepending `NEXT_PUBLIC_API_URL`. `next.config.mjs` whitelists localhost ports 5033 (HTTP) and 7129 (HTTPS) for `next/image`.
