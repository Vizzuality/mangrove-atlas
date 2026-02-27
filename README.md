# Mangrove Atlas

![Screenshot 2023-07-14 at 08 48 02](https://github.com/Vizzuality/mangrove-atlas/assets/33252015/8fa99ca2-16d4-4563-92e0-2c063edfe6b6)

## Overview

[Global Mangrove Watch (GMW)](https://www.globalmangrovewatch.org/) is an online platform that provides remote sensing data and tools for monitoring mangroves. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable.

## Tech Stack

- [Next.js](https://nextjs.org/) (Pages Router) — framework
- [React 18](https://reactjs.org/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Recoil](https://recoiljs.org/) — client state management (URL-synced)
- [React Query](https://tanstack.com/query/v4) (`@tanstack/react-query` v4) — server state & data fetching
- [Mapbox GL JS v3](https://docs.mapbox.com/mapbox-gl-js/) via `react-map-gl` v7 — map rendering
- [Recharts](https://recharts.org/) — charts & data visualization
- [Radix UI](https://www.radix-ui.com/) — accessible UI primitives
- [NextAuth v4](https://next-auth.js.org/) — authentication
- [Transifex Native](https://www.transifex.com/) — internationalization (en, fr, es)
- [Playwright](https://playwright.dev/) — end-to-end testing

## Getting Started

### Requirements

- Node.js 22 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) 10.x

### Setup

1. Clone the repository
2. Use the correct Node.js version:
   ```bash
   nvm use
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Copy the environment file and fill in the required values:
   ```bash
   cp .env.default .env
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Commands

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm check-types      # TypeScript type checking
pnpm test             # Run Playwright end-to-end tests
pnpm test-ui          # Run Playwright tests with interactive UI
```

Run a single Playwright test:
```bash
npx playwright test tests/navigation.spec.ts
```

## Project Structure

```
src/
├── pages/              # Next.js pages (catch-all route at [[...params]].tsx)
├── containers/
│   ├── datasets/       # Widget-specific code (data hooks, charts, map layers)
│   └── widgets/        # Widget system configuration & constants
├── components/         # Shared UI components
├── store/              # Recoil atoms organized by domain
├── services/           # API clients (Axios instances)
├── hooks/              # Shared React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles

cloud-functions/        # Google Cloud Functions (Node.js 22)
├── analysis/           # Geospatial analysis (habitat extent, net change, biomass)
├── alerts-tiler/       # Tile server for alert visualization
├── fetch-alerts/       # Deforestation alert data from Google Earth Engine
├── fetch-alerts-heatmap/
└── upload-alerts/
```

### URL Patterns

The app uses a catch-all route (`src/pages/[[...params]].tsx`) with these patterns:
- `/` — worldwide view
- `/country/:id` — country view
- `/wdpa/:id` — protected area view
- `/custom-area/:id` — user-drawn area

## Environment Variables

Copy `.env.default` to `.env` for local development. Key variables:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox token (required for map rendering) |
| `NEXT_PUBLIC_VERCEL_ENV` | Controls API URL selection (`development` / `staging` / `production`) |
| `NEXT_PUBLIC_API_URL_STAGING` | Backend API URL (staging) |
| `NEXT_PUBLIC_API_URL_PRODUCTION` | Backend API URL (production) |
| `NEXT_PUBLIC_ANALYSIS_API_URL` | Analysis cloud function URL |
| `NEXT_PUBLIC_BLOG_API_URL` | WordPress blog API URL |
| `NEXT_PUBLIC_PLANET_API_KEY` | Planet satellite imagery API key |
| `NEXT_PUBLIC_TRANSIFEX_API_KEY` | Transifex API key for i18n |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 tracking ID |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption |
| `NEXTAUTH_URL` | NextAuth base URL |

See `.env.default` for the full list.

## Analytics

This project uses **Google Analytics 4 (GA4)** via [`react-ga4`](https://github.com/PriceRunner/react-ga4). Analytics is initialized only when `NEXT_PUBLIC_GA_ID` is set. Custom events follow the `trackEvent` wrapper pattern with GA4-recommended structure.

## Deployment

The app is deployed on [Vercel](https://vercel.com/). Cloud functions are deployed independently via GitHub Actions on push to `develop`/`master` when their files change.

Playwright tests run automatically on PRs to `develop` (after the Vercel preview deploy completes).

## Contributing

Create a PR for any improvement or feature. Avoid committing directly to `develop` or `master`.

### Code Style

- ESLint flat config with Prettier integration
- Prettier: single quotes, trailing commas (es5), 100 char line width, Tailwind CSS plugin
- Pre-commit hook runs lint on staged files via lint-staged

## Vulnerability Mitigation

[Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) are configured for this repository.

To check for production vulnerabilities:
```bash
pnpm audit --prod
```

When a vulnerability is detected:
1. Check if it affects production dependencies
2. Try creating a Dependabot security update PR
3. If automatic fixes fail, manually update the affected dependencies
