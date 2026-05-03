import { makeSchema, State } from "@livestore/livestore";
import { budget } from "./schema/budgets";
import { category, defaultCategories } from "./schema/categories";
import { transaction } from "./schema/transactions";

export const tables = {
  budget: budget.table,
  category: category.table,
  transaction: transaction.table,
} as const;

export const events = {
  ...budget.events,
  ...category.events,
  ...transaction.events,
} as const;

const materializers = {
  ...budget.materializers,
  ...category.materializers,
  ...transaction.materializers,
} as const;

const state = State.SQLite.makeState({
  tables,
  materializers,
});

export const schema = makeSchema({
  events,
  state,
});

export { budget, category, defaultCategories, transaction };
