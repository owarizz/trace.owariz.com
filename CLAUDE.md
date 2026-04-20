# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
bun run dev       # start dev server
bun run build     # production build
bun run lint      # biome check (linter)
bun run format    # biome format --write
```

`bun` is the only supported package manager — `bun.lock` is the lockfile.

## Architecture

**Feature modules** under `src/features/` each follow a three-layer split:

| Subdirectory  | Role                                                              |
|---------------|-------------------------------------------------------------------|
| `controller/` | Client-side hooks and Zustand stores (browser-only logic)        |
| `view/`       | React components (server-first; client components opt in with `"use client"`) |
| `server/`     | Server-only data fetching (AniList, Jikan — never imported in client code) |

**Route files** in `src/app/` are thin: they set metadata and delegate rendering to a `*-render.tsx` component in the matching feature's `view/` folder.

**API route** `src/app/api/anime/[id]/route.ts` proxies AniList GraphQL so the API key never reaches the browser.

**State** is managed with Zustand. The main store is `src/features/home/controller/bookmark-store.ts` — it persists bookmarks to `localStorage` and co-locates UI state (panel open, detail view). Max 50 bookmarks; IDs generated from anime data via `makeBookmarkId()`.

**Search flow**: `useSearch` hook (`src/features/home/controller/search-hook.ts`) handles upload + URL search, abort, progress tracking, and history via `useHistoryStore`.

## Design System

All design tokens are CSS custom properties defined in `src/assets/globals.css`:

- Surfaces: `--bg-primary`, `--bg-secondary`, `--bg-elevated`, `--bg-glass`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-faint`
- Accent (indigo/violet): `--accent`, `--accent-muted`, `--accent-soft`, `--accent-glow`
- Borders: `--border-subtle`, `--border-default`, `--border-strong`
- Radii: `--radius-lg` (16px), `--radius-md` (12px), `--radius-sm` (8px)

Use Tailwind's arbitrary-property syntax to reference them: `bg-(--bg-glass)`, `text-(--accent)`.

The `.glass-card` utility class applies glassmorphism (backdrop-blur, bg-glass, border-subtle, hover transitions). Prefer it over hand-rolling the same properties.

Fonts: `IBM Plex Sans Thai` / `IBM Plex Sans` for UI, `IBM Plex Mono` for code. Reference via `var(--font-sans)` / `var(--font-mono)`.

## Conventions

- All pages add `pb-28` to their content container to clear the fixed bottom navigation bar.
- Heavy client components (modals, panels) are loaded with `next/dynamic` + `{ ssr: false }`.
- Remote images must be declared in `next.config.ts` under `remotePatterns` before use.
- Section headers follow this pattern: icon + uppercase label + `h-px flex-1 bg-(--border-subtle)` divider + optional action button.
- Validate before committing: `bun run lint && bun run build`.
