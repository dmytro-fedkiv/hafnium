import { XIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  accountOptions,
  transactionCategories,
} from "./mock-transactions";
import {
  type Transaction,
  type TransactionCategory,
  type TransactionDraft,
  type TransactionStatus,
} from "./transaction-types";

const emptyDraft: TransactionDraft = {
  accountName: accountOptions[0],
  amountCents: 0,
  currency: "USD",
  categories: [],
  date: new Date().toISOString().slice(0, 10),
  description: "",
  note: "",
  status: "pending",
  type: "expense",
};

export function TransactionForm({
  onOpenChange,
  onSubmit,
  open,
  transaction,
}: Readonly<{
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: TransactionDraft) => void;
  open: boolean;
  transaction?: Transaction | null;
}>) {
  const [draft, setDraft] = useState<TransactionDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    if (transaction) {
      setDraft({
        accountName: transaction.accountName,
        amountCents: transaction.amountCents,
        currency: transaction.currency,
        categories: transaction.categories,
        date: transaction.date,
        description: transaction.description,
        note: transaction.note ?? "",
        status: transaction.status,
        type: transaction.type,
      });
      return;
    }

    setDraft(emptyDraft);
    setErrors({});
  }, [open, transaction]);

  const selectedCategoryIds = useMemo(
    () => new Set(draft.categories.map((category) => category.id)),
    [draft.categories],
  );

  function toggleCategory(category: TransactionCategory) {
    setDraft((current) => {
      const exists = current.categories.some((entry) => entry.id === category.id);

      return {
        ...current,
        categories: exists
          ? current.categories.filter((entry) => entry.id !== category.id)
          : [...current.categories, category],
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (!draft.amountCents || draft.amountCents <= 0) {
      nextErrors.amount = "Amount must be greater than zero.";
    }

    if (!draft.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (draft.categories.length === 0) {
      nextErrors.categories = "Choose at least one category.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      ...draft,
      description: draft.description.trim(),
      note: draft.note.trim(),
    });
    onOpenChange(false);
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className="max-w-xl border-l border-border bg-background"
        side="right"
      >
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>
            {transaction ? "Edit transaction" : "Add transaction"}
          </SheetTitle>
          <SheetDescription>
            Local-only changes for the transactions workspace.
          </SheetDescription>
        </SheetHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid gap-4 overflow-y-auto px-5 py-5">
            <div className="grid gap-2">
              <Label htmlFor="transaction-amount">Amount</Label>
              <Input
                id="transaction-amount"
                min="0.01"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    amountCents: Math.round(Number(event.target.value || 0) * 100),
                  }))
                }
                step="0.01"
                type="number"
                value={draft.amountCents ? draft.amountCents / 100 : ""}
              />
              {errors.amount ? (
                <p className="text-[11px] text-red-700">{errors.amount}</p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      type: value as TransactionDraft["type"],
                    }))
                  }
                  value={draft.type}
                >
                  <SelectTrigger className="w-full justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      status: value as TransactionStatus,
                    }))
                  }
                  value={draft.status}
                >
                  <SelectTrigger className="w-full justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-description">Description</Label>
              <Input
                id="transaction-description"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                value={draft.description}
              />
              {errors.description ? (
                <p className="text-[11px] text-red-700">{errors.description}</p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="transaction-date">Date</Label>
                <Input
                  id="transaction-date"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  type="date"
                  value={draft.date}
                />
              </div>

              <div className="grid gap-2">
                <Label>Account</Label>
                <Select
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      accountName: value ?? current.accountName,
                    }))
                  }
                  value={draft.accountName}
                >
                  <SelectTrigger className="w-full justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountOptions.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="grid gap-2 border border-border p-3">
                {transactionCategories.map((category) => {
                  const checked = selectedCategoryIds.has(category.id);

                  return (
                    <label
                      className="flex cursor-pointer items-center justify-between gap-3 border border-transparent px-2 py-2 hover:border-border"
                      key={category.id}
                    >
                      <span className="flex items-center gap-2">
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleCategory(category)}
                        />
                        <span className="text-sm">
                          {category.emoji} {category.name}
                        </span>
                      </span>
                      <Badge
                        className="normal-case tracking-normal"
                        style={{
                          backgroundColor: `${category.color}14`,
                          borderColor: `${category.color}55`,
                          color: category.color,
                        }}
                        variant="outline"
                      >
                        {category.color}
                      </Badge>
                    </label>
                  );
                })}
              </div>
              {errors.categories ? (
                <p className="text-[11px] text-red-700">{errors.categories}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-note">Note</Label>
              <Textarea
                id="transaction-note"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
                rows={4}
                value={draft.note}
              />
            </div>

            {draft.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {draft.categories.map((category) => (
                  <Badge
                    className="gap-1.5 normal-case tracking-normal"
                    key={category.id}
                    style={{
                      backgroundColor: `${category.color}14`,
                      borderColor: `${category.color}55`,
                      color: category.color,
                    }}
                    variant="outline"
                  >
                    <span>{category.emoji}</span>
                    <span>{category.name}</span>
                    <button
                      className="inline-flex size-3.5 items-center justify-center"
                      onClick={() => toggleCategory(category)}
                      type="button"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <SheetFooter className="border-t border-border px-5 py-4">
            <div className="flex w-full items-center justify-between gap-3">
              <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit">
                {transaction ? "Save changes" : "Create transaction"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
