import {
  createTransaction,
  events,
  tables,
  type TransactionType,
} from "@hafnium/schema";
import { queryDb } from "@livestore/livestore";
import { useStore } from "@livestore/react";
import { type FormEvent, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const transactions$ = queryDb(
  () => tables.transactions.where({ deletedAt: null }).orderBy("date", "desc"),
  { label: "transactions" },
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export function TransactionsPage() {
  const { store } = useStore();
  const transactions = store.useQuery(transactions$);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const amount = Number(formData.get("amount") ?? 0);
    const type = String(formData.get("type") ?? "expense") as TransactionType;

    const transaction = createTransaction({
      amountCents: Math.round(Math.abs(amount) * 100),
      category: String(formData.get("category") ?? "").trim(),
      date: String(formData.get("date") ?? today),
      description: String(formData.get("description") ?? "").trim(),
      type,
    });

    store.commit(events.transactionCreated(transaction));
    form.reset();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16">
      <section className="space-y-3">
        <p className="text-muted-foreground text-sm font-bold tracking-[0.16em] uppercase">
          hafnium v0.1
        </p>
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Transactions
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Create transactions locally with LiveStore and list the current local
          state.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Add transaction</CardTitle>
          <CardDescription>
            Stored locally through a LiveStore transaction event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  min="0.01"
                  name="amount"
                  placeholder="24.50"
                  required
                  step="0.01"
                  type="number"
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Groceries"
                  required
                  type="text"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  defaultValue={today}
                  id="date"
                  name="date"
                  required
                  type="date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Food"
                  required
                  type="text"
                />
              </div>
            </div>
            <div className="grid gap-2 sm:max-w-48">
              <Label htmlFor="type">Type</Label>
              <select
                className="border-input bg-background ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                defaultValue="expense"
                id="type"
                name="type"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <Button className="w-fit" type="submit">
              Add transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle id="transaction-list-heading">Transaction list</CardTitle>
          <CardDescription>
            Current local state from the LiveStore query.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section aria-labelledby="transaction-list-heading">
            {transactions.length === 0 ? (
              <p className="text-muted-foreground">No transactions yet.</p>
            ) : (
              <ul className="grid gap-3">
                {transactions.map((transaction) => (
                  <li
                    className="bg-background flex items-center justify-between rounded-lg border p-4"
                    key={transaction.id}
                  >
                    <div>
                      <strong>{transaction.description}</strong>
                      <div className="text-muted-foreground text-sm">
                        {transaction.date} · {transaction.category} ·{" "}
                        {transaction.type}
                      </div>
                    </div>
                    <strong
                      className={
                        transaction.type === "expense"
                          ? "text-destructive"
                          : "text-emerald-700"
                      }
                    >
                      {transaction.type === "expense" ? "-" : "+"}
                      {currencyFormatter.format(transaction.amountCents / 100)}
                    </strong>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
