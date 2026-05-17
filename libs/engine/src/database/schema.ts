import { CategoryTable } from "@/database/schema/categories";
import { CounterpartyTable } from "@/database/schema/counterparties";
import { DenominationTable } from "@/database/schema/denominations";
import { InstrumentTable } from "@/database/schema/instruments";
import { LedgerAccountTable } from "@/database/schema/ledger-account";
import {
  TransactionEntrySchema,
  TransactionEntryTable,
} from "@/database/schema/transaction-entries";
import { TransactionSchema, TransactionTable } from "@/database/schema/transactions";
import {
  defineMaterializer,
  Events,
  makeSchema,
  nanoid,
  Schema,
  State,
} from "@livestore/livestore";
import { NanoId } from "./utils/nano-id";

export const events = {
  CreateTransaction: Events.synced({
    name: "v0.Transaction.CreateTransaction",
    schema: TransactionSchema.pipe(
      Schema.omit("id"),
      Schema.extend(
        Schema.Struct({
          entries: Schema.NonEmptyArray(
            TransactionEntrySchema.pipe(Schema.omit("id", "transactionId")),
          ),
        }),
      ),
    ),
  }),
  SetTransactionCategory: Events.synced({
    name: "v0.Transaction.SetTransactionCategory",
    schema: Schema.Struct({
      transactionId: TransactionSchema.fields.id,
      categoryId: TransactionSchema.fields.categoryId,
    }),
  }),
} as const;

export const schema = makeSchema({
  events,
  state: State.SQLite.makeState({
    tables: {
      categories: CategoryTable,
      counterparties: CounterpartyTable,
      denominations: DenominationTable,
      instruments: InstrumentTable,
      ledgerAccounts: LedgerAccountTable,
      transactionEntries: TransactionEntryTable,
      transactions: TransactionTable,
    },
    materializers: State.SQLite.materializers(events, {
      [events.CreateTransaction.name]: defineMaterializer(
        events.CreateTransaction,
        (transaction) => {
          const transactionId = nanoid<NanoId>();

          return [
            TransactionTable.insert({
              id: transactionId,
              name: transaction.name,
              description: transaction.description,
              categoryId: transaction.categoryId,
              counterpartyId: transaction.counterpartyId,
              sourceId: transaction.sourceId,
              status: transaction.status,
              occurredAt: transaction.occurredAt,
            }),
            ...transaction.entries.map((entry) =>
              TransactionEntryTable.insert({
                id: nanoid(),
                transactionId,
                ledgerAccountId: entry.ledgerAccountId,
                denominationId: entry.denominationId,
                side: entry.side,
                quantity: entry.quantity,
              }),
            ),
          ];
        },
      ),
      [events.SetTransactionCategory.name]: defineMaterializer(
        events.SetTransactionCategory,
        ({ transactionId, categoryId }) =>
          TransactionTable.update({ categoryId }).where({ id: transactionId }),
      ),
    }),
  }),
});
