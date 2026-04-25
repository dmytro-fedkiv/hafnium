import {
  createTransaction,
  events,
  tables,
  type TransactionType,
} from "@hafnium/schema";
import { queryDb } from "@livestore/livestore";
import { useStore } from "@livestore/react";
import { type FormEvent, useMemo } from "react";

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
    <main className="shell">
      <p className="eyebrow">hafnium v0.1</p>
      <h1>Transactions</h1>
      <p>
        Create transactions locally with LiveStore and list the current local
        state.
      </p>

      <form className="transaction-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label>
            Amount
            <input
              min="0.01"
              name="amount"
              placeholder="24.50"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label>
            Description
            <input
              name="description"
              placeholder="Groceries"
              required
              type="text"
            />
          </label>
          <label>
            Date
            <input defaultValue={today} name="date" required type="date" />
          </label>
          <label>
            Type
            <select defaultValue="expense" name="type">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label>
            Category
            <input name="category" placeholder="Food" required type="text" />
          </label>
        </div>
        <button type="submit">Add transaction</button>
      </form>

      <section aria-labelledby="transaction-list-heading">
        <h2 id="transaction-list-heading">Transaction list</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className="transactions">
            {transactions.map((transaction) => (
              <li className="transaction-row" key={transaction.id}>
                <div>
                  <strong>{transaction.description}</strong>
                  <div className="transaction-meta">
                    {transaction.date} · {transaction.category} ·{" "}
                    {transaction.type}
                  </div>
                </div>
                <strong className={transaction.type}>
                  {transaction.type === "expense" ? "-" : "+"}
                  {currencyFormatter.format(transaction.amountCents / 100)}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
