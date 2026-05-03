# Repository Guidelines

## Project Structure & Module Organization

This is a Bun + Nx TypeScript workspace. Workspace packages live under `apps/*` and `libs/*`.

- `apps/web`: TanStack Start web application. Source lives in `apps/web/src`.
- `apps/api`: Node API package if present; keep API source under `apps/api/src`.
- `libs/engine`: Shared finance types, pure helpers, LiveStore tables, events, materializers, and exported schema.
- Root config: `bun.lock`, `nx.json`, `tsconfig.base.json`, and `eslint.config.js`.

Keep transaction types and LiveStore definitions in `libs/engine`; do not duplicate them inside app packages.

## Build, Test, and Development Commands

Run commands from the repository root:

- `bun install`: install workspace dependencies and refresh `bun.lock`.
- `bun run dev:web`: run the web app through Nx.
- `bun run build`: run all project `build` targets.
- `bun run typecheck`: run TypeScript checks for all projects.
- `bun run lint`: run ESLint for all projects.
- `bun run test`: run Vitest targets; current packages may use `--passWithNoTests`.

Prefer targeted Nx commands while iterating, for example `bunx nx run web:typecheck`.

## Coding Style & Naming Conventions

Use TypeScript with strict settings from `tsconfig.base.json`. Follow the existing style: two-space indentation in JSON, semicolons in TypeScript, double quotes, and named exports for shared modules. Use package names and path aliases under `@hafnium/*` as defined in package metadata and `tsconfig.base.json`.

Keep functions small and domain-focused. Avoid app framework imports in `libs/engine`.

When you need to look up information about LiveStore, always use the `docs` directory that's shipped as part of the `@livestore/livestore` package in `node_modules/@livestore/livestore/docs`.

## Testing Guidelines

Use Vitest for unit tests. Place tests beside implementation files as `*.test.ts` or `*.test.tsx`. Focus tests on pure domain behavior and schema/event behavior before adding broad UI tests. Always run `bun run typecheck` and the relevant `bunx nx run <project>:test` target before handoff.

## Commit & Pull Request Guidelines

The existing history uses Conventional Commit style, for example `chore: Initialize Hafnium project`. Continue with short, imperative messages such as `feat: add transaction form` or `fix: validate transaction amount`.

Pull requests should include a concise summary, validation commands run, linked issues if applicable, and screenshots for UI changes. Keep PRs scoped to one vertical slice.

## Agent-Specific Instructions

Make minimal, focused changes. Do not add mobile, worker, sync, bank integration, CSV import, or reporting code unless explicitly requested. Do not commit changes unless asked.
