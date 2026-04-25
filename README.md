# hafnium

hafnium v0.1 is a local-first web app where you can add and list transactions.

## Scope

This first slice intentionally includes only:

```text
apps/web
libs/schema
```

Mobile, API, worker, sync, bank connections, CSV import, and reports are later steps.

## Current Flow

```text
Create transaction
→ commit TransactionCreated to LiveStore
→ materialize into local SQLite state
→ render transaction list in web UI
```

## Packages

- `apps/web`: TanStack Start web UI with a transaction form and list.
- `libs/schema`: Shared transaction types, factory, LiveStore table, events, materializers, and schema.

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
