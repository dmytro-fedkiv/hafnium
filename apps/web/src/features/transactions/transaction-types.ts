export type TransactionStatus = "pending" | "completed" | "failed";

export type TransactionCategory = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  accountName: string;
  amountCents: number;
  currency: "USD";
  type: "income" | "expense";
  status: TransactionStatus;
  categories: TransactionCategory[];
  note?: string;
};

export type TransactionDraft = {
  accountName: string;
  amountCents: number;
  currency: "USD";
  date: string;
  description: string;
  note: string;
  status: TransactionStatus;
  type: "income" | "expense";
  categories: TransactionCategory[];
};

export type TransactionSortKey = "date" | "amountCents";

export type TransactionColumnId =
  | "date"
  | "description"
  | "categories"
  | "accountName"
  | "amountCents"
  | "status"
  | "actions";
