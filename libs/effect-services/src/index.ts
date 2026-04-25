import { mockTransactions, type Transaction } from "@hafnium/domain";
import { Context, Effect, Layer } from "effect";

export interface TransactionServiceShape {
  readonly listTransactions: Effect.Effect<readonly Transaction[]>;
  readonly createTransaction: (transaction: Transaction) => Effect.Effect<void>;
}

export class TransactionService extends Context.Tag(
  "@hafnium/effect-services/TransactionService",
)<TransactionService, TransactionServiceShape>() { }

const localTransactions: Transaction[] = [...mockTransactions];

export const TransactionServiceLive = Layer.succeed(TransactionService, {
  listTransactions: Effect.succeed(localTransactions),
  createTransaction: (transaction) =>
    Effect.sync(() => {
      localTransactions.unshift(transaction);
    }),
});

export const listTransactions = Effect.flatMap(
  TransactionService,
  (service) => service.listTransactions,
);
