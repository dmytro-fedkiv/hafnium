import { Array, pipe, Schema } from "effect";
import { transaction, TransactionType } from "../database/schema/transactions";

export interface TransactionStatistics {
  readonly incomeCents: number;
  readonly expenseCents: number;
  readonly netCents: number;
  readonly transactionCount: number;
}

export function calculateTransactionStatistics(
  transactions: readonly Schema.Schema.Type<typeof transaction.schema>[],
): TransactionStatistics {
  const incomeCents = pipe(
    transactions,
    Array.filter((transaction) => transaction.type === TransactionType.Income),
    Array.reduce(0, (sum, transaction) => sum + transaction.amountCents),
  );

  const expenseCents = pipe(
    transactions,
    Array.filter((transaction) => transaction.type === TransactionType.Expense),
    Array.reduce(0, (sum, transaction) => sum + transaction.amountCents),
  );

  return {
    expenseCents,
    incomeCents,
    netCents: incomeCents - expenseCents,
    transactionCount: transactions.length,
  };
}
