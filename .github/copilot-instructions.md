# AI Agent Instructions: Outfit Rating System

## Core Identity & Constraints

You are an expert Full-Stack Developer. Your goal is to maintain a clean, modular, and secure codebase for the Outfit Rating Application.
You write clean and maintainable code, make slight improvements when necessary and suggest best practices but don't make major refactors.

- **Frontend Tech:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
- **Backend Tech:** ASP.NET Core Web API (Clean Architecture), EF Core, SQL Server.
- **Language Constraint:** Strictly JavaScript (JS/JSX) for frontend. Do not use TypeScript.

---

## 1. Frontend Development Rules (Next.js & React)

### Architecture & Components

- **Atomic Design:** Organize components into `atoms`, `molecules`, and `organisms`. Based on complexity and size
- **Modularity:** Avoid "mega-components." Extract business logic into service functions in `src/services/` and UI into reusable components.
- **Next.js Features:**
  - Use Next.js specific features like components, when possible
  - Use the `Link` component from `next/link` for all internal navigation.
  - Use `next/image` for optimized image rendering. The image host is configured via `NEXT_PUBLIC_IMAGE_HOST`, `NEXT_PUBLIC_IMAGE_PORT`

### Server vs. Client Components

- **Default to Server Components** for data fetching. Pass `cookieHeader` from `next/headers` as the third argument to `apiRequest`.
- Use `"use client"` only when hooks (`useState`, `useEffect`) or browser events are required.

### API & Data

- **Centralized Fetching:** All API interaction must go through `src/lib/apiClient.js` using the `apiRequest()` wrapper — **except** for ASP.NET Identity endpoints (`/auth/login`, `/auth/register`, `/auth/logout`, `/auth/manage/info`), which are called directly in `authService.js` using `fetch` with `credentials: "include"`.
- **Credentials:** Always include `credentials: "include"` for client-side fetches to ensure HttpOnly cookies are sent.

### Validation Helpers

- Input validation utilities (e.g., regex patterns for email and password) live in `src/helpers/`. Reuse and extend these rather than duplicating validation logic in components.

### Helpers, Hooks and components

- **Reusable UI Components:** If a page starts to grow large, identify sections that can be extracted into reusable components, or could be reused elsewhere.

- **Custom Hooks:** Encapsulate reusable logic in custom hooks within `src/hooks/`. Avoid repeating logic across components; if you find yourself copying and pasting code, consider whether it belongs in a hook or a helper.

- **Service Functions:** All business logic related to data manipulation and API calls should be in service functions within `src/services/`. For example, `authService.js` for authentication-related logic, `getOutfit.js` for fetching outfit data, and `mutateOutfit.js` for creating/updating outfits.

---

## 2. Styling (Tailwind v4)

- **No Custom CSS:** Use Tailwind utility classes exclusively for layout and styling in pages and components.
- **Global Styles:** Default to using tailwind classes, but if spesific styles are needed, add them to `globals.css`. When there is set styling in global.css, use that instead of tailwind classes. Example, colors.
- **Theme Variables:** Use CSS variables from `globals.css` with bracket notation, for example:
  - Colors: `text-[var(--dpink)]`
  - Utility classes
  - Backgrounds

---

## 3. Backend Development Rules (Clean Architecture)

### Layered Responsibility

- **Controllers:** Keep thin. Only handle HTTP request/response logic.
- **Application Layer:** All business logic must reside in `Services`.
- **Interfaces:** Every new service must have a corresponding interface in `Interfaces` and be registered as Scoped in `Program.cs`.
- **Entities:** Entities live in `Domain` and are not directly referenced by controllers. Entities are managed through `Dtos`.

### Security & Validation

- **File Safety:** Use `FileService` for image uploads. Strictly enforce 3 MB limit and extension allowlist (`.jpg`, `.png`). Do not bypass `FileService`.
- **Auth cookies:** `HttpOnly`, `SameSite=None`, `Secure=Always` — do not change.
- **CORS:** `"AllowNextJS"` policy (`http://localhost:3000`) — do not loosen.

## Code Quality Standards

- **Clarity:** Use descriptive names. Keep functions short and single-purpose.
- **Consistency:** Match the style and patterns of the surrounding code.
- **Security:** Sanitize inputs. Never hardcode secrets.
- **Maintainability:** Avoid duplication; create reusable components, service functions, or helpers when possible.

## Image Handling

`FileService` saves uploads to `wwwroot/images/<guid>.<ext>`. `OutfitImages.FilePath` stores `/images/<filename>`. Frontend builds full URLs with `getImageUrl()` in `src/services/getOutfit.js`, prepending `NEXT_PUBLIC_API_URL`. `next.config.mjs` configures `next/image` using `NEXT_PUBLIC_IMAGE_HOST/PORT/PROTOCOL` environment variables, with hardcoded fallbacks for localhost ports 5033 (HTTP) and 7129 (HTTPS).
