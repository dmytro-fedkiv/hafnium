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
