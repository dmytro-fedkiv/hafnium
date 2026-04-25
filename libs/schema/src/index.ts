import { Events, makeSchema, Schema, State } from "@livestore/livestore";

export type TransactionType = "income" | "expense";

export interface Transaction {
  readonly id: string;
  readonly amountCents: number;
  readonly description: string;
  readonly date: string;
  readonly type: TransactionType;
  readonly category: string;
}

export interface NewTransactionInput {
  readonly amountCents: number;
  readonly description: string;
  readonly date: string;
  readonly type: TransactionType;
  readonly category: string;
}

export function createTransaction(input: NewTransactionInput): Transaction {
  return {
    id: crypto.randomUUID(),
    ...input,
  };
}

export const tables = {
  transactions: State.SQLite.table({
    name: "transactions",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      amountCents: State.SQLite.integer(),
      description: State.SQLite.text({ default: "" }),
      date: State.SQLite.text(),
      type: State.SQLite.text(),
      category: State.SQLite.text({ default: "" }),
      deletedAt: State.SQLite.text({ nullable: true }),
    },
  }),
};

export const events = {
  transactionCreated: Events.synced({
    name: "v1.TransactionCreated",
    schema: Schema.Struct({
      id: Schema.String,
      amountCents: Schema.Number,
      description: Schema.String,
      date: Schema.String,
      type: Schema.Literal("income", "expense"),
      category: Schema.String,
    }),
  }),
  transactionUpdated: Events.synced({
    name: "v1.TransactionUpdated",
    schema: Schema.Struct({
      id: Schema.String,
      amountCents: Schema.Number,
      description: Schema.String,
      date: Schema.String,
      type: Schema.Literal("income", "expense"),
      category: Schema.String,
    }),
  }),
  transactionDeleted: Events.synced({
    name: "v1.TransactionDeleted",
    schema: Schema.Struct({
      id: Schema.String,
      deletedAt: Schema.String,
    }),
  }),
};

const materializers = State.SQLite.materializers(events, {
  "v1.TransactionCreated": (transaction) =>
    tables.transactions.insert({
      ...transaction,
      deletedAt: null,
    }),
  "v1.TransactionUpdated": ({ id, ...transaction }) =>
    tables.transactions.update(transaction).where({ id }),
  "v1.TransactionDeleted": ({ id, deletedAt }) =>
    tables.transactions.update({ deletedAt }).where({ id }),
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
