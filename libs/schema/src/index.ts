import { Events, makeSchema, Schema, State } from "@livestore/livestore";

export type TransactionType = "Income" | "Expense";
export type BudgetPeriod = "Monthly";

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly color: string;
  readonly isDefault: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;
}

export interface NewCategoryInput {
  readonly name: string;
  readonly emoji: string;
  readonly color: string;
}

export interface Budget {
  readonly categoryId: string;
  readonly amountCents: number;
  readonly currency: "USD";
  readonly period: BudgetPeriod;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;
}

export interface SetBudgetInput {
  readonly categoryId: string;
  readonly amountCents: number;
  readonly currency?: "USD";
  readonly period?: BudgetPeriod;
}

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

export const defaultCategories = [
  { id: "food", name: "Food", emoji: "🍔", color: "#d97706" },
  { id: "coffee", name: "Coffee", emoji: "☕", color: "#92400e" },
  { id: "salary", name: "Salary", emoji: "💼", color: "#15803d" },
  { id: "rent", name: "Rent", emoji: "🏠", color: "#1d4ed8" },
  { id: "travel", name: "Travel", emoji: "✈️", color: "#0891b2" },
  { id: "software", name: "Software", emoji: "🧩", color: "#7c3aed" },
  { id: "health", name: "Health", emoji: "🩺", color: "#dc2626" },
] as const satisfies ReadonlyArray<
  Pick<Category, "id" | "name" | "emoji" | "color">
>;

export function createCategory(
  input: NewCategoryInput,
  now = new Date().toISOString(),
): Category {
  return {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    deletedAt: null,
    isDefault: false,
    updatedAt: now,
  };
}

export function createDefaultCategoryEvents(now = new Date().toISOString()) {
  return defaultCategories.map((category) =>
    events.categoryCreated({
      ...category,
      createdAt: now,
      isDefault: true,
      updatedAt: now,
    }),
  );
}

export function setBudget(input: SetBudgetInput, now = new Date().toISOString()) {
  return {
    amountCents: input.amountCents,
    categoryId: input.categoryId,
    createdAt: now,
    currency: input.currency ?? "USD",
    deletedAt: null,
    period: input.period ?? "Monthly",
    updatedAt: now,
  } satisfies Budget;
}

export const tables = {
  budgets: State.SQLite.table({
    name: "budgets",
    columns: {
      categoryId: State.SQLite.text({ primaryKey: true }),
      amountCents: State.SQLite.integer(),
      currency: State.SQLite.text({ default: "USD" }),
      period: State.SQLite.text({ default: "Monthly" }),
      createdAt: State.SQLite.text(),
      updatedAt: State.SQLite.text(),
      deletedAt: State.SQLite.text({ nullable: true }),
    },
  }),
  categories: State.SQLite.table({
    name: "categories",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      name: State.SQLite.text({ default: "" }),
      emoji: State.SQLite.text({ default: "" }),
      color: State.SQLite.text({ default: "#737373" }),
      isDefault: State.SQLite.boolean({ default: false }),
      createdAt: State.SQLite.text(),
      updatedAt: State.SQLite.text(),
      deletedAt: State.SQLite.text({ nullable: true }),
    },
  }),
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
  budgetDeleted: Events.synced({
    name: "v1.BudgetDeleted",
    schema: Schema.Struct({
      categoryId: Schema.String,
      deletedAt: Schema.String,
    }),
  }),
  budgetSet: Events.synced({
    name: "v1.BudgetSet",
    schema: Schema.Struct({
      categoryId: Schema.String,
      amountCents: Schema.Number,
      currency: Schema.Literal("USD"),
      period: Schema.Literal("Monthly"),
      createdAt: Schema.String,
      updatedAt: Schema.String,
    }),
  }),
  categoryCreated: Events.synced({
    name: "v1.CategoryCreated",
    schema: Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      emoji: Schema.String,
      color: Schema.String,
      isDefault: Schema.Boolean,
      createdAt: Schema.String,
      updatedAt: Schema.String,
    }),
  }),
  categoryDeleted: Events.synced({
    name: "v1.CategoryDeleted",
    schema: Schema.Struct({
      id: Schema.String,
      deletedAt: Schema.String,
    }),
  }),
  categoryUpdated: Events.synced({
    name: "v1.CategoryUpdated",
    schema: Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      emoji: Schema.String,
      color: Schema.String,
      updatedAt: Schema.String,
    }),
  }),
  transactionCreated: Events.synced({
    name: "v1.TransactionCreated",
    schema: Schema.Struct({
      id: Schema.String,
      amountCents: Schema.Number,
      description: Schema.String,
      date: Schema.String,
      type: Schema.Literal("Income", "Expense"),
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
      type: Schema.Literal("Income", "Expense"),
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
  "v1.BudgetDeleted": ({ categoryId, deletedAt }) =>
    tables.budgets.update({ deletedAt }).where({ categoryId }),
  "v1.BudgetSet": (budget) =>
    tables.budgets.insert({
      ...budget,
      deletedAt: null,
    }).onConflict("categoryId", "update", {
      amountCents: budget.amountCents,
      currency: budget.currency,
      deletedAt: null,
      period: budget.period,
      updatedAt: budget.updatedAt,
    }),
  "v1.CategoryCreated": (category) =>
    tables.categories.insert({
      ...category,
      deletedAt: null,
    }),
  "v1.CategoryDeleted": ({ id, deletedAt }) =>
    tables.categories.update({ deletedAt }).where({ id }),
  "v1.CategoryUpdated": ({ id, ...category }) =>
    tables.categories.update(category).where({ id }),
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
