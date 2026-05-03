import {
  ForkKnifeIcon,
  HouseLineIcon,
  MusicNotesIcon,
  PlusIcon,
  ShoppingBagIcon,
  SquaresFourIcon,
  TrainIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { ComponentType, CSSProperties, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BudgetCategory = {
  color: string;
  icon: ComponentType<{ className?: string; weight?: "bold" }>;
  id: string;
  name: string;
};

type Budget = {
  amountCents: number;
  category: BudgetCategory;
  spentCents: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

const categories: BudgetCategory[] = [
  {
    color: "#f59e0b",
    icon: ForkKnifeIcon,
    id: "food",
    name: "Food",
  },
  {
    color: "#3b82f6",
    icon: TrainIcon,
    id: "transport",
    name: "Transport",
  },
  {
    color: "#ef4444",
    icon: HouseLineIcon,
    id: "rent",
    name: "Rent",
  },
  {
    color: "#7c3aed",
    icon: SquaresFourIcon,
    id: "subscriptions",
    name: "Subscriptions",
  },
  {
    color: "#ec4899",
    icon: ShoppingBagIcon,
    id: "shopping",
    name: "Shopping",
  },
  {
    color: "#10b981",
    icon: MusicNotesIcon,
    id: "entertainment",
    name: "Entertainment",
  },
];

const initialBudgets: Budget[] = [
  makeBudget("food", 32_840, 40_000),
  makeBudget("transport", 8_920, 20_000),
  makeBudget("rent", 120_000, 120_000),
  makeBudget("subscriptions", 5_760, 7_500),
  makeBudget("shopping", 22_450, 20_000),
  makeBudget("entertainment", 4_500, 10_000),
];

export function BudgetsPage() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  const budgetedCategoryIds = new Set(budgets.map((budget) => budget.category.id));
  const availableCategories = categories.filter(
    (category) => !budgetedCategoryIds.has(category.id),
  );
  const totals = useMemo(() => {
    const spentCents = budgets.reduce((total, budget) => total + budget.spentCents, 0);
    const amountCents = budgets.reduce((total, budget) => total + budget.amountCents, 0);

    return {
      amountCents,
      percentage: amountCents === 0 ? 0 : Math.round((spentCents / amountCents) * 100),
      spentCents,
    };
  }, [budgets]);

  function handleCreateBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const category = categories.find((entry) => entry.id === selectedCategoryId);
    const amountCents = Math.round(Number(amount) * 100);

    if (!category || amountCents <= 0) {
      return;
    }

    setBudgets((current) => [
      ...current,
      {
        amountCents,
        category,
        spentCents: 0,
      },
    ]);
    setAmount("");
    setSelectedCategoryId("");
    setIsCreating(false);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-8 py-8">
        <section className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Hafnum v0.1
            </p>
            <h1 className="text-2xl font-medium tracking-normal">Budgets</h1>
            <p className="text-sm text-muted-foreground">Track your budget progress</p>
          </div>
          <Button
            className="border-border bg-background text-foreground hover:bg-muted"
            onClick={() => setIsCreating((current) => !current)}
            type="button"
            variant="outline"
          >
            <PlusIcon className="size-4" />
            New budget
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_17rem]">
          <Card className="border border-border bg-card py-0 ring-0">
            <CardContent className="px-0">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="text-sm font-medium">Active budgets</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {budgets.length} categories
                </div>
              </div>

              {isCreating ? (
                <form
                  className="grid gap-4 border-b border-border bg-muted/40 px-5 py-4 md:grid-cols-[minmax(0,1fr)_10rem_auto]"
                  onSubmit={handleCreateBudget}
                >
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground" htmlFor="budget-category">
                      Category
                    </Label>
                    <Select
                      onValueChange={(value) => setSelectedCategoryId(value ?? "")}
                      value={selectedCategoryId}
                    >
                      <SelectTrigger
                        className="w-full border-border bg-background text-foreground"
                        id="budget-category"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground" htmlFor="budget-amount">
                      Amount
                    </Label>
                    <Input
                      className="border-border bg-background text-foreground"
                      id="budget-amount"
                      inputMode="decimal"
                      min="0"
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={amount}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="border-border bg-foreground text-background hover:bg-foreground/90"
                      disabled={availableCategories.length === 0}
                      type="submit"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              ) : null}

              <div className="divide-y divide-border">
                {budgets.length === 0 ? (
                  <div className="px-5 py-12 text-sm text-muted-foreground">No budgets yet.</div>
                ) : (
                  budgets.map((budget) => <BudgetRow budget={budget} key={budget.category.id} />)
                )}
              </div>
            </CardContent>
          </Card>

          <aside className="border border-border bg-card p-5">
            <div className="grid gap-5">
              <div className="grid gap-1">
                <p className="text-xs text-muted-foreground">Total tracked</p>
                <p className="font-mono text-2xl">
                  {currencyFormatter.format(totals.spentCents / 100)}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {currencyFormatter.format(totals.amountCents / 100)}
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Overall</span>
                  <span className="font-mono">{totals.percentage}%</span>
                </div>
                <Progress
                  className="gap-0 [&_[data-slot=progress-indicator]]:bg-foreground [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-muted"
                  max={100}
                  value={Math.min(totals.percentage, 100)}
                />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function BudgetRow({ budget }: Readonly<{ budget: Budget }>) {
  const percentage =
    budget.amountCents === 0 ? 0 : Math.round((budget.spentCents / budget.amountCents) * 100);
  const isExceeded = budget.spentCents > budget.amountCents;
  const overageCents = Math.max(budget.spentCents - budget.amountCents, 0);
  const Icon = budget.category.icon;

  return (
    <div className="grid gap-3 px-5 py-5 data-[exceeded=true]:bg-red-50" data-exceeded={isExceeded}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:grid-cols-[minmax(0,1fr)_12rem_4rem]">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-6 items-center justify-center border text-white"
            style={{
              backgroundColor: budget.category.color,
              borderColor: budget.category.color,
            }}
          >
            <Icon className="size-3.5" weight="bold" />
          </span>
          <span className="truncate text-sm font-medium">{budget.category.name}</span>
          {isExceeded ? (
            <span className="inline-flex items-center gap-1 border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600 uppercase tracking-normal">
              <WarningCircleIcon className="size-3" />
              Exceeded
            </span>
          ) : null}
        </div>
        <div
          className="hidden text-right font-mono text-sm text-muted-foreground data-[exceeded=true]:text-red-600 md:block"
          data-exceeded={isExceeded}
        >
          {currencyFormatter.format(budget.spentCents / 100)} of{" "}
          {currencyFormatter.format(budget.amountCents / 100)}
        </div>
        <div
          className="text-right font-mono text-sm data-[exceeded=true]:text-red-600"
          data-exceeded={isExceeded}
        >
          {percentage}%
        </div>
      </div>
      <Progress
        className="gap-0 [&_[data-slot=progress-indicator]]:bg-[var(--budget-color)] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-muted"
        max={100}
        style={
          {
            "--budget-color": isExceeded ? "#ef4444" : budget.category.color,
          } as CSSProperties
        }
        value={Math.min(percentage, 100)}
      />
      {isExceeded ? (
        <div className="font-mono text-xs text-red-600">
          Over by {currencyFormatter.format(overageCents / 100)}
        </div>
      ) : null}
      <div className="font-mono text-xs text-muted-foreground md:hidden">
        {currencyFormatter.format(budget.spentCents / 100)} of{" "}
        {currencyFormatter.format(budget.amountCents / 100)}
      </div>
    </div>
  );
}

function makeBudget(categoryId: string, spentCents: number, amountCents: number): Budget {
  const category = categories.find((entry) => entry.id === categoryId);

  if (!category) {
    throw new Error(`Unknown budget category: ${categoryId}`);
  }

  return {
    amountCents,
    category,
    spentCents,
  };
}
