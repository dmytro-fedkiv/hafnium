import { NanoId } from "@/database/utils/nano-id";
import { Schema, State } from "@livestore/livestore";
import { CategorySchema } from "./categories";
import { CounterpartySchema } from "./counterparties";

export enum TransactionStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
}

export const TransactionSchema = Schema.Struct({
  id: NanoId.pipe(State.SQLite.withPrimaryKey),

  name: Schema.NonEmptyTrimmedString,
  description: Schema.NonEmptyTrimmedString.pipe(Schema.optional),

  categoryId: CategorySchema.fields.id.pipe(Schema.optional),

  counterpartyId: CounterpartySchema.fields.id,
  sourceId: Schema.String,

  status: Schema.Enums(TransactionStatus),

  occurredAt: Schema.Date,
});

export const TransactionTable = State.SQLite.table({
  name: "transactions",
  schema: TransactionSchema,
  indexes: [
    {
      name: "idx_transactions_counterpartyId",
      columns: ["counterpartyId"],
    },
  ],
});
