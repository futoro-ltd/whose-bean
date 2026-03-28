# Agent Guidelines

## Deployment Restrictions

This codebase **cannot be run on serverless platforms** (Vercel, Netlify, AWS Lambda, Cloudflare Pages/Workers, etc.). It requires a long-running Node.js server due to the in-memory EventBus used for real-time analytics streaming.

## Helpful hints

The phrase "analytics page" in the codebase refers to the page that displays the analytics of a specific dashboard. This page is located at refers to /src/dashboard/[id]/page.tsx

## Project Conventions

### Authentication

- JWT-based auth with token stored in HTTP-only cookie
- Token verification: `src/lib/auth.ts` exports `getCurrentUser()`, `verifyToken()`, `generateToken()`
- All server actions verify auth via `getCurrentUser()` before proceeding

### Route Protection (Proxy)

- Protected routes via `src/proxy.ts` (Next.js App Router proxy pattern)
- Intercepts requests to `/dashboard/*`, `/admin/*`, `/login`, `/register`
- Handles: unauthenticated redirects, invalid tokens, **deleted users** (redirects to `/login?reason=deleted`)

### Key File Locations

- Auth utilities: `src/lib/auth.ts`
- Server actions: `src/app/actions/`
- Protected routes: `/dashboard`, `/admin`

### Theme Management

- Uses `next-themes` for theme persistence
- ThemeProvider: `src/components/theme-provider.tsx` (wraps `next-themes` ThemeProvider)
- useTheme hook: `src/hooks/use-theme.ts`
- Components import `useTheme` from `@/hooks/use-theme`, NOT from `theme-provider`
