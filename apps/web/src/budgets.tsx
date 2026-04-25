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

  const budgetedCategoryIds = new Set(
    budgets.map((budget) => budget.category.id),
  );
  const availableCategories = categories.filter(
    (category) => !budgetedCategoryIds.has(category.id),
  );
  const totals = useMemo(() => {
    const spentCents = budgets.reduce(
      (total, budget) => total + budget.spentCents,
      0,
    );
    const amountCents = budgets.reduce(
      (total, budget) => total + budget.amountCents,
      0,
    );

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
    <main className="min-h-screen bg-[#0f1011] text-[#EDEDED]">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-8 py-8">
        <section className="flex flex-col gap-4 border-b border-[#26282C] pb-6 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <h1 className="text-2xl font-medium tracking-normal text-white">
              Budgets
            </h1>
            <p className="text-sm text-[#8D929A]">Track your budget progress</p>
          </div>
          <Button
            className="border-[#343840] bg-[#131518] text-[#EDEDED] hover:bg-[#1A1D21]"
            onClick={() => setIsCreating((current) => !current)}
            type="button"
            variant="outline"
          >
            <PlusIcon className="size-4" />
            New budget
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_17rem]">
          <Card className="border border-[#26282C] bg-[#141619] py-0 text-[#EDEDED] ring-0">
            <CardContent className="px-0">
              <div className="flex items-center justify-between border-b border-[#26282C] px-5 py-4">
                <div className="text-sm font-medium text-white">Active budgets</div>
                <div className="font-mono text-xs text-[#858B94]">
                  {budgets.length} categories
                </div>
              </div>

              {isCreating ? (
                <form
                  className="grid gap-4 border-b border-[#26282C] bg-[#101214] px-5 py-4 md:grid-cols-[minmax(0,1fr)_10rem_auto]"
                  onSubmit={handleCreateBudget}
                >
                  <div className="grid gap-2">
                    <Label className="text-[#8D929A]" htmlFor="budget-category">
                      Category
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setSelectedCategoryId(value ?? "")
                      }
                      value={selectedCategoryId}
                    >
                      <SelectTrigger
                        className="w-full border-[#343840] bg-[#141619] text-[#EDEDED]"
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
                    <Label className="text-[#8D929A]" htmlFor="budget-amount">
                      Amount
                    </Label>
                    <Input
                      className="border-[#343840] bg-[#141619] text-[#EDEDED]"
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
                      className="border-[#343840] bg-[#EDEDED] text-[#0B0B0C] hover:bg-white"
                      disabled={availableCategories.length === 0}
                      type="submit"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              ) : null}

              <div className="divide-y divide-[#26282C]">
                {budgets.length === 0 ? (
                  <div className="px-5 py-12 text-sm text-[#858B94]">
                    No budgets yet.
                  </div>
                ) : (
                  budgets.map((budget) => (
                    <BudgetRow budget={budget} key={budget.category.id} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <aside className="border border-[#26282C] bg-[#141619] p-5">
            <div className="grid gap-5">
              <div className="grid gap-1">
                <p className="text-xs text-[#858B94]">Total tracked</p>
                <p className="font-mono text-2xl text-white">
                  {currencyFormatter.format(totals.spentCents / 100)}
                </p>
                <p className="text-xs text-[#858B94]">
                  of {currencyFormatter.format(totals.amountCents / 100)}
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-xs text-[#858B94]">
                  <span>Overall</span>
                  <span className="font-mono">{totals.percentage}%</span>
                </div>
                <Progress
                  className="gap-0 [&_[data-slot=progress-indicator]]:bg-[#EDEDED] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-[#25282D]"
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
    budget.amountCents === 0
      ? 0
      : Math.round((budget.spentCents / budget.amountCents) * 100);
  const isExceeded = budget.spentCents > budget.amountCents;
  const overageCents = Math.max(budget.spentCents - budget.amountCents, 0);
  const Icon = budget.category.icon;

  return (
    <div
      className="grid gap-3 px-5 py-5 data-[exceeded=true]:bg-[#2A1414]/40"
      data-exceeded={isExceeded}
    >
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
          <span className="truncate text-sm font-medium text-white">
            {budget.category.name}
          </span>
          {isExceeded ? (
            <span className="inline-flex items-center gap-1 border border-[#ef4444]/50 bg-[#ef4444]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#fca5a5] uppercase tracking-normal">
              <WarningCircleIcon className="size-3" />
              Exceeded
            </span>
          ) : null}
        </div>
        <div
          className="hidden text-right font-mono text-sm text-[#A6ABB3] data-[exceeded=true]:text-[#fca5a5] md:block"
          data-exceeded={isExceeded}
        >
          {currencyFormatter.format(budget.spentCents / 100)} of{" "}
          {currencyFormatter.format(budget.amountCents / 100)}
        </div>
        <div
          className="text-right font-mono text-sm text-white data-[exceeded=true]:text-[#fca5a5]"
          data-exceeded={isExceeded}
        >
          {percentage}%
        </div>
      </div>
      <Progress
        className="gap-0 [&_[data-slot=progress-indicator]]:bg-[var(--budget-color)] [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--budget-color)] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-[#25282D]"
        max={100}
        style={
          {
            "--budget-color": isExceeded ? "#ef4444" : budget.category.color,
          } as CSSProperties
        }
        value={Math.min(percentage, 100)}
      />
      {isExceeded ? (
        <div className="font-mono text-xs text-[#fca5a5]">
          Over by {currencyFormatter.format(overageCents / 100)}
        </div>
      ) : null}
      <div className="font-mono text-xs text-[#858B94] md:hidden">
        {currencyFormatter.format(budget.spentCents / 100)} of{" "}
        {currencyFormatter.format(budget.amountCents / 100)}
      </div>
    </div>
  );
}

function makeBudget(
  categoryId: string,
  spentCents: number,
  amountCents: number,
): Budget {
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
