import { DenominationSchema } from "@/database/schema/denominations";
import { TransactionSchema } from "@/database/schema/transactions";
import { NanoId } from "@/database/utils/nano-id";
import { Schema, State } from "@livestore/livestore";
import { LedgerAccountSchema } from "./ledger-account";

export enum TransactionEntrySide {
  Debit = "debit",
  Credit = "credit",
}

export const TransactionEntrySchema = Schema.Struct({
  id: NanoId.pipe(State.SQLite.withPrimaryKey),

  transactionId: TransactionSchema.fields.id,

  ledgerAccountId: LedgerAccountSchema.fields.id,
  denominationId: DenominationSchema.fields.id,

  side: Schema.Enums(TransactionEntrySide),
  quantity: Schema.BigDecimal.pipe(Schema.nonNegativeBigDecimal()),
});

export const TransactionEntryTable = State.SQLite.table({
  name: "transaction_entries",
  schema: TransactionEntrySchema,
  indexes: [
    {
      name: "idx_transaction_entries_transactionId",
      columns: ["transactionId"],
    },
    {
      name: "idx_transaction_entries_accountId",
      columns: ["ledgerAccountId"],
    },
  ],
});
