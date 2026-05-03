import { Events, nanoid, State } from "@livestore/livestore";
import { Schema } from "effect";

export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
}

const schema = Schema.Struct({
  id: Schema.String.pipe(State.SQLite.withPrimaryKey),
  amountCents: Schema.Number,
  description: Schema.String,
  date: Schema.Date,
  type: Schema.Literal(TransactionType.Income, TransactionType.Expense),
  category: Schema.String,
}).annotations({ title: "transactions" });

const table = State.SQLite.table({ schema });

const events = {
  transactionCreated: Events.synced({
    name: "v1.transaction.created",
    schema: Schema.Struct({
      amountCents: Schema.Number,
      description: Schema.String,
      date: Schema.Date,
      type: Schema.Literal(TransactionType.Income, TransactionType.Expense),
      category: Schema.String,
    }),
  }),
  transactionUpdated: Events.synced({
    name: "v1.transaction.updated",
    schema: Schema.Struct({
      id: Schema.String,
      amountCents: Schema.Number,
      description: Schema.String,
      date: Schema.Date,
      type: Schema.Literal(TransactionType.Income, TransactionType.Expense),
      category: Schema.String,
    }),
  }),
} as const;

const materializers = State.SQLite.materializers(events, {
  "v1.transaction.created": (transaction) => table.insert({ id: nanoid(), ...transaction }),
  "v1.transaction.updated": ({ id, ...transaction }) => table.update(transaction).where({ id }),
});

export const transaction = { schema, table, events, materializers };
