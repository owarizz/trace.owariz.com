# Trace

Anime scene search for screenshots and clips, built on top of the `trace.moe` API.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Biome

## Scripts

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run format
```

`bun` is the preferred package manager in this repository because `bun.lock` is the primary lockfile.

## Project Structure

```text
src/
  app/                       Next.js route entrypoints and document metadata
  assets/                    Global styles and design tokens
  common/config/             Shared app configuration
  features/home/
    controller/              Feature hooks and API-facing state
    view/                    UI components for the home page
```

## Architecture Notes

- `src/app/page.tsx` stays server-rendered and delegates interactivity to feature components.
- `src/features/home/view/home-render.tsx` is server-first, while search and status interactions live in client components.
- `src/features/home/controller/` contains browser-side hooks for `trace.moe` requests and local search history.
- Remote images are rendered through `next/image`, with allowed hosts configured in `next.config.ts`.

## Conventions

- Keep route files thin and move page behavior into `features/`.
- Prefer direct imports over wide barrel exports when the module graph is small.
- Keep browser-only logic inside client components or client hooks.
- Validate structural changes with `bun run lint` and `bun run build`.
