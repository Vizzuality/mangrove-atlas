# ADR 002: Deploy to Railway from the repo Dockerfile

**Status:** Proposed
**Date:** 2026-11-18
**Jira:** —

---

## Context

The app is being deployed to Railway (project `mangroves-atlas`). Railway uses a root `Dockerfile` when one exists and falls back to Railpack, its auto-detecting builder, otherwise. The existing `Dockerfile` dated from the initial scaffold (Node 18, Yarn), so every Railway build failed.

`next.config.js` already emits `output: 'standalone'` outside Vercel, and Playwright serves that standalone bundle. `next start` does not work with standalone output.

`env.mjs` validates the whole schema (server and client vars) during `next build`, and `NEXT_PUBLIC_*` values are inlined into the client bundle at build time, so all variables must be available to the build.

## Decision

Keep a `Dockerfile` and rewrite it: Node 24, pnpm (version taken from `packageManager`), a multi-stage build, and a runtime image that runs `node server.js` from the standalone output as the non-root `node` user.

Every variable in `env.mjs` is declared as an `ARG` in the builder stage, because Railway only exposes variables to Dockerfile builds through `ARG`. The values come from Railway shared variables, which are referenced from the service.

## Alternatives considered

- **Remove the Dockerfile and use Railpack.** Railpack exposes every variable at build time automatically, so no `ARG` list would be needed. It lost because Railpack starts the app with the `package.json` `start` script (`next start`) and does not special-case standalone output, so it would need a custom start command that copies `public/` and `.next/static` into the standalone directory. The deployment would also depend on Railway-specific auto-detection instead of an image that builds anywhere.

## Consequences

- The image is reproducible locally (`docker build --build-arg-file <env file> .`) and on any container host.
- The `ARG` list in the `Dockerfile` must stay in sync with `env.mjs`. A variable that's missing from the list builds as `undefined`, and the build fails if the schema requires that variable.
- Server-only secrets such as `NEXTAUTH_SECRET` are build args in the builder stage only. They are not copied into the runtime image.
