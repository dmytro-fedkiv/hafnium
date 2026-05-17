import { NanoId } from "@/database/utils/nano-id";
import { Schema, State } from "@livestore/livestore";

export enum LedgerAccountStatus {
  Pending = "pending",
  Active = "active",
  Restricted = "restricted",
  Closed = "closed",
}

export const LedgerAccountSchema = Schema.Struct({
  id: NanoId.pipe(State.SQLite.withPrimaryKey),

  name: Schema.NonEmptyTrimmedString,

  status: Schema.Enums(LedgerAccountStatus),
});

export const LedgerAccountTable = State.SQLite.table({
  name: "ledger_accounts",
  schema: LedgerAccountSchema,
});
