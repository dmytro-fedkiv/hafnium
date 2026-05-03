import {
  type Transaction,
  type TransactionCategory,
  type TransactionDraft,
} from "./transaction-types";

export const transactionCategories: TransactionCategory[] = [
  { id: "food", name: "Food", emoji: "🍔", color: "#d97706" },
  { id: "coffee", name: "Coffee", emoji: "☕", color: "#92400e" },
  { id: "salary", name: "Salary", emoji: "💼", color: "#15803d" },
  { id: "rent", name: "Rent", emoji: "🏠", color: "#1d4ed8" },
  { id: "travel", name: "Travel", emoji: "✈️", color: "#0891b2" },
  { id: "software", name: "Software", emoji: "🧩", color: "#7c3aed" },
  { id: "health", name: "Health", emoji: "🩺", color: "#dc2626" },
];

export const accountOptions = ["Checking", "Savings", "Credit Card", "Brokerage Cash"];

function categoryById(id: string) {
  const category = transactionCategories.find((entry) => entry.id === id);

  if (!category) {
    throw new Error(`Unknown transaction category: ${id}`);
  }

  return category;
}

function makeTransaction(
  partial: Omit<Transaction, "categories"> & { categories: string[] },
): Transaction {
  return {
    ...partial,
    categories: partial.categories.map(categoryById),
  };
}

export const mockTransactions: Transaction[] = [
  makeTransaction({
    id: "txn_1001",
    date: "2026-04-24",
    description: "April payroll",
    accountName: "Checking",
    amountCents: 485000,
    currency: "USD",
    type: "income",
    status: "completed",
    categories: ["salary"],
    note: "Primary direct deposit",
  }),
  makeTransaction({
    id: "txn_1002",
    date: "2026-04-23",
    description: "Office coffee run",
    accountName: "Credit Card",
    amountCents: 1265,
    currency: "USD",
    type: "expense",
    status: "completed",
    categories: ["coffee", "food"],
    note: "Team sync before planning",
  }),
  makeTransaction({
    id: "txn_1003",
    date: "2026-04-22",
    description: "Rent transfer",
    accountName: "Checking",
    amountCents: 185000,
    currency: "USD",
    type: "expense",
    status: "completed",
    categories: ["rent"],
  }),
  makeTransaction({
    id: "txn_1004",
    date: "2026-04-21",
    description: "Flight to NYC",
    accountName: "Credit Card",
    amountCents: 42800,
    currency: "USD",
    type: "expense",
    status: "pending",
    categories: ["travel"],
    note: "Client workshop next week",
  }),
  makeTransaction({
    id: "txn_1005",
    date: "2026-04-20",
    description: "Gym membership",
    accountName: "Checking",
    amountCents: 5400,
    currency: "USD",
    type: "expense",
    status: "completed",
    categories: ["health"],
  }),
  makeTransaction({
    id: "txn_1006",
    date: "2026-04-19",
    description: "Design software subscription",
    accountName: "Credit Card",
    amountCents: 2900,
    currency: "USD",
    type: "expense",
    status: "failed",
    categories: ["software"],
    note: "Card verification required",
  }),
  makeTransaction({
    id: "txn_1007",
    date: "2026-04-18",
    description: "Dinner with friends",
    accountName: "Checking",
    amountCents: 6840,
    currency: "USD",
    type: "expense",
    status: "completed",
    categories: ["food"],
  }),
  makeTransaction({
    id: "txn_1008",
    date: "2026-04-17",
    description: "Freelance invoice",
    accountName: "Brokerage Cash",
    amountCents: 126000,
    currency: "USD",
    type: "income",
    status: "pending",
    categories: ["salary"],
    note: "Waiting for ACH settlement",
  }),
  makeTransaction({
    id: "txn_1009",
    date: "2026-04-16",
    description: "Weekend groceries",
    accountName: "Checking",
    amountCents: 15840,
    currency: "USD",
    type: "expense",
    status: "completed",
    categories: ["food"],
  }),
  makeTransaction({
    id: "txn_1010",
    date: "2026-04-15",
    description: "Airport espresso",
    accountName: "Credit Card",
    amountCents: 795,
    currency: "USD",
    type: "expense",
    status: "completed",
    categories: ["coffee", "travel"],
  }),
  makeTransaction({
    id: "txn_1011",
    date: "2026-04-14",
    description: "Health reimbursement",
    accountName: "Savings",
    amountCents: 21000,
    currency: "USD",
    type: "income",
    status: "completed",
    categories: ["health"],
  }),
];

export function createMockTransaction(
  input: TransactionDraft,
  id = crypto.randomUUID(),
): Transaction {
  return {
    ...input,
    id,
  };
}
