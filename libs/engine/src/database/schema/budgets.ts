import { Events, nanoid, State } from "@livestore/livestore";
import { Schema } from "effect";

export enum BudgetPeriod {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly",
}

const schema = Schema.Struct({
  id: Schema.String.pipe(State.SQLite.withPrimaryKey),
  categoryId: Schema.String.pipe(State.SQLite.withPrimaryKey),
  amountCents: Schema.Int,
  currency: Schema.String.pipe(State.SQLite.withDefault("USD")),
  period: Schema.String.pipe(State.SQLite.withDefault(BudgetPeriod.Monthly)),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}).annotations({ title: "budgets" });

const table = State.SQLite.table({ schema });

const events = {
  created: Events.synced({
    name: "v1.budget.created",
    schema: Schema.Struct({
      categoryId: Schema.String,
      amountCents: Schema.Number,
      currency: Schema.String,
      period: Schema.String,
      createdAt: Schema.Date,
      updatedAt: Schema.Date,
    }),
  }),
} as const;

const materializers = State.SQLite.materializers(events, {
  "v1.budget.created": (budget) =>
    table.insert({ id: nanoid(), ...budget }).onConflict("categoryId", "update", {
      amountCents: budget.amountCents,
      currency: budget.currency,
      period: budget.period,
      updatedAt: budget.updatedAt,
    }),
});

export const budget = { schema, table, events, materializers };
