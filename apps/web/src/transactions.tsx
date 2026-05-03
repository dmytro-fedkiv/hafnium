import { DownloadSimpleIcon, PlusIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createMockTransaction, mockTransactions } from "./features/transactions/mock-transactions";
import { TransactionDataTable } from "./features/transactions/transaction-data-table";
import { TransactionDetailsPanel } from "./features/transactions/transaction-details-panel";
import { TransactionForm } from "./features/transactions/transaction-form";
import { type Transaction, type TransactionDraft } from "./features/transactions/transaction-types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amountCents, 0);
    const totalExpenses = filteredTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amountCents, 0);
    const pendingAmount = filteredTransactions
      .filter((transaction) => transaction.status === "pending")
      .reduce(
        (sum, transaction) =>
          sum +
          (transaction.type === "income" ? transaction.amountCents : -transaction.amountCents),
        0,
      );
    const netAmount = totalIncome - totalExpenses;

    return {
      netAmount,
      pendingAmount,
      totalExpenses,
      totalIncome,
    };
  }, [filteredTransactions]);

  function openAddTransaction() {
    setEditingTransaction(null);
    setIsFormOpen(true);
  }

  function handleSubmitTransaction(draft: TransactionDraft) {
    if (editingTransaction) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === editingTransaction.id
            ? { ...transaction, ...draft, note: draft.note || undefined }
            : transaction,
        ),
      );
      setSelectedTransaction((current) =>
        current?.id === editingTransaction.id
          ? { ...editingTransaction, ...draft, note: draft.note || undefined }
          : current,
      );
      setEditingTransaction(null);
      return;
    }

    setTransactions((current) => [createMockTransaction(draft), ...current]);
  }

  function handleEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsDetailsOpen(false);
    setIsFormOpen(true);
  }

  function handleDeleteTransaction(transaction: Transaction) {
    setTransactions((current) => current.filter((entry) => entry.id !== transaction.id));
    setSelectedTransaction((current) => (current?.id === transaction.id ? null : current));
    setIsDetailsOpen(false);
    if (editingTransaction?.id === transaction.id) {
      setEditingTransaction(null);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-8 py-8">
        <section className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-2">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Hafnium v0.1
            </p>
            <h1 className="text-4xl font-medium tracking-tight text-foreground">Transactions</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Create, filter, and inspect your local transaction history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline">
              <DownloadSimpleIcon className="size-4" />
              Import CSV
            </Button>
            <Button onClick={openAddTransaction} type="button">
              <PlusIcon className="size-4" />
              Add transaction
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total income"
            tone="income"
            value={formatSignedCurrency(summary.totalIncome)}
          />
          <SummaryCard
            label="Total expenses"
            tone="expense"
            value={formatSignedCurrency(-summary.totalExpenses)}
          />
          <SummaryCard
            label="Pending amount"
            tone="pending"
            value={formatSignedCurrency(summary.pendingAmount)}
          />
          <SummaryCard
            label="Net amount"
            tone="net"
            value={formatSignedCurrency(summary.netAmount)}
          />
        </section>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            <TransactionDataTable
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleEditTransaction}
              onFilteredTransactionsChange={setFilteredTransactions}
              onViewTransaction={(transaction) => {
                setSelectedTransaction(transaction);
                setIsDetailsOpen(true);
              }}
              transactions={transactions}
            />
          </CardContent>
        </Card>
      </div>

      <TransactionForm
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitTransaction}
        open={isFormOpen}
        transaction={editingTransaction}
      />

      <TransactionDetailsPanel
        onDelete={() =>
          selectedTransaction ? handleDeleteTransaction(selectedTransaction) : undefined
        }
        onEdit={() =>
          selectedTransaction ? handleEditTransaction(selectedTransaction) : undefined
        }
        onOpenChange={setIsDetailsOpen}
        open={isDetailsOpen}
        transaction={selectedTransaction}
      />
    </main>
  );
}

function SummaryCard({
  label,
  tone,
  value,
}: Readonly<{
  label: string;
  tone: "income" | "expense" | "pending" | "net";
  value: string;
}>) {
  const toneClassName =
    tone === "income"
      ? "text-emerald-700"
      : tone === "expense"
        ? "text-red-700"
        : tone === "net" || tone === "pending"
          ? value.startsWith("-")
            ? "text-red-700"
            : "text-emerald-700"
          : "text-foreground";

  return (
    <Card size="sm">
      <CardHeader className="gap-2 py-3">
        <CardDescription>{label}</CardDescription>
        <CardTitle className={toneClassName}>
          <span className="font-mono text-2xl">{value}</span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

function formatSignedCurrency(amountCents: number) {
  const absoluteValue = currencyFormatter.format(Math.abs(amountCents) / 100);

  if (amountCents === 0) {
    return absoluteValue;
  }

  return `${amountCents > 0 ? "+" : "-"}${absoluteValue}`;
}
