# hafnium

hafnium v0.1 is a local-first personal finance app.

## Scope

This first slice intentionally includes only:

```text
apps/api
apps/desktop
apps/mobile
apps/web
libs/engine
```

The UI surfaces are separated from the local engine and cloud API. Desktop and mobile are scaffolded as workspace apps so they can grow without changing the package map again.

## Current Flow

```text
Create transaction
→ commit TransactionCreated to LiveStore
→ materialize into local SQLite state
→ run local engine calculations
→ render transaction list in web UI
```

## Packages

- `libs/engine`: Local finance logic, shared entity models, statistics calculation, merchant normalization, category detection, and LiveStore schema/events/materializers.
- `apps/web`: TanStack Start web UI.
- `apps/desktop`: Desktop app workspace placeholder.
- `apps/mobile`: Mobile app workspace placeholder.
- `apps/api`: Cloud boundary for accounts, device sync, and bank integrations.

## Scripts

```bash
pnpm install
pnpm dev:web
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

## LiveStore Events

- `TransactionCreated`
- `TransactionUpdated`
- `TransactionDeleted`
