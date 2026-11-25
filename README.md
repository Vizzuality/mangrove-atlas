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
- [Playwright](https://playwright.dev/) — end-to-end & accessibility testing (with [axe-core](https://github.com/dequelabs/axe-core))
- [Vitest](https://vitest.dev/) — unit & component testing (with React Testing Library)

## Getting Started

### Requirements

- Node.js 24 (see `.nvmrc`)
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
pnpm lint:a11y        # Run oxlint static accessibility checks (jsx-a11y rules)
pnpm check-types      # TypeScript type checking
pnpm test             # Run Playwright tests (end-to-end + accessibility)
pnpm test-ui          # Run Playwright tests with interactive UI
pnpm test:unit        # Run Vitest unit & component tests
pnpm test:unit:watch  # Run Vitest in watch mode
pnpm test:unit:coverage # Run Vitest with coverage report
```

Run a single Playwright test:

```bash
npx playwright test tests/navigation.spec.ts
```

See [docs/testing.md](docs/testing.md) for the full test inventory, conventions, and CI details.

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
├── fetch-alerts/       # Deforestation alert data from Google Earth Engine
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

| Variable                          | Description                                                           |
| --------------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox token (required for map rendering)                             |
| `NEXT_PUBLIC_ENVIRONMENT`         | Deploy environment (`development` / `staging` / `production`)         |
| `NEXT_PUBLIC_FEATURED_FLAGS`      | JSON overrides for feature flags (`src/lib/feature-flags.ts`), e.g. `{"iucn-ecoregion":true}` |
| `NEXT_PUBLIC_API_URL`             | Backend API URL (staging)                                             |
| `NEXT_PUBLIC_API_URL`             | Backend API URL (production)                                          |
| `NEXT_PUBLIC_ANALYSIS_API_URL`    | Analysis cloud function base URL (bare cloud-functions domain)        |
| `NEXT_PUBLIC_ANALYSIS_API_PATH`   | Analysis function name per env (`analysis` / `analysis-staging` / `analysis-production`) |
| `NEXT_PUBLIC_BLOG_API_URL`        | WordPress blog API URL                                                |
| `NEXT_PUBLIC_PLANET_API_KEY`      | Planet satellite imagery API key                                      |
| `NEXT_PUBLIC_TRANSIFEX_API_KEY`   | Transifex API key for i18n                                            |
| `NEXT_PUBLIC_GA_ID`               | Google Analytics 4 tracking ID                                        |
| `NEXTAUTH_SECRET`                 | Secret for NextAuth session encryption                                |
| `NEXTAUTH_URL`                    | NextAuth base URL                                                     |

See `.env.default` for the full list.

## Analytics

This project uses **Google Analytics 4 (GA4)** via [`react-ga4`](https://github.com/PriceRunner/react-ga4). Analytics is initialized only when `NEXT_PUBLIC_GA_ID` is set. Custom events follow the `trackEvent` wrapper pattern with GA4-recommended structure.

## Deployment

- **Pull request previews** — [Railway](https://railway.com/) (project `mangroves-atlas`, service `mangrove-atlas`).
- **Staging and production** — [Heroku](https://www.heroku.com/).

Cloud functions are deployed independently via GitHub Actions on push to `develop`/`master` when their files change.

### Railway

Railway builds the root `Dockerfile` on every push to `develop` and runs the Next.js standalone server (`node server.js`). The Railway environment is named `production`, but it serves `develop` with `NEXT_PUBLIC_ENVIRONMENT=staging`.

Variables live as **shared variables** in the Railway environment and are attached to the service as `${{shared.NAME}}` references. Because `NEXT_PUBLIC_*` values are inlined at build time and `env.mjs` validates the schema during `next build`, every variable must also be declared as an `ARG` in the Dockerfile's builder stage. When you add a variable to `env.mjs`:

1. Add it to the Railway shared variables and reference it from the service.
2. Add a matching `ARG` line to the `Dockerfile`.

See [ADR 002](docs/adr/002-railway-dockerfile-deployment.md) for why the Dockerfile is used instead of Railway's auto-detected builder.

Playwright tests run automatically on PRs to `develop`, against a production build made in CI.

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
