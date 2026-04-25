import {
  CalendarBlankIcon,
  CaretDownIcon,
  ForkKnifeIcon,
  IconContext,
  LightningIcon,
  ShoppingBagIcon,
  SquaresFourIcon,
  TrainIcon,
} from "@phosphor-icons/react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Metric = {
  detail: string;
  label: string;
  tone?: "positive";
  value: string;
};

type Category = {
  amount: string;
  change: string;
  color: string;
  direction: "up" | "down";
  icon: ReactNode;
  name: string;
};

type Transaction = {
  amount: string;
  category: string;
  icon: ReactNode;
  merchant: string;
  tone: "income" | "expense";
};

const metrics: Metric[] = [
  {
    detail: "+12% from Apr",
    label: "Available Balance",
    tone: "positive",
    value: "$3,421.00",
  },
  {
    detail: "68% of income",
    label: "Monthly Spending",
    value: "$2,180.40",
  },
  {
    detail: "Target: 30%",
    label: "Savings Rate",
    value: "24%",
  },
  {
    detail: "Stable",
    label: "Hafnum Score",
    tone: "positive",
    value: "78 / 100",
  },
];

const topCategories: Category[] = [
  {
    amount: "$628.40",
    change: "28%",
    color: "#f59e0b",
    direction: "up",
    icon: <ForkKnifeIcon weight="bold" />,
    name: "Food",
  },
  {
    amount: "$180.20",
    change: "5%",
    color: "#22c55e",
    direction: "down",
    icon: <TrainIcon weight="bold" />,
    name: "Transport",
  },
  {
    amount: "$320.00",
    change: "12%",
    color: "#3b82f6",
    direction: "up",
    icon: <ShoppingBagIcon weight="bold" />,
    name: "Shopping",
  },
  {
    amount: "$75.80",
    change: "8%",
    color: "#ec4899",
    direction: "down",
    icon: <SquaresFourIcon weight="bold" />,
    name: "Subscriptions",
  },
];

const transactions: Transaction[] = [
  {
    amount: "-$5.40",
    category: "Food",
    icon: <ForkKnifeIcon weight="bold" />,
    merchant: "Starbucks",
    tone: "expense",
  },
  {
    amount: "-$42.10",
    category: "Groceries",
    icon: <ForkKnifeIcon weight="bold" />,
    merchant: "Whole Foods Market",
    tone: "expense",
  },
  {
    amount: "+$3,200.00",
    category: "Income",
    icon: <LightningIcon weight="bold" />,
    merchant: "Stripe Payout",
    tone: "income",
  },
  {
    amount: "-$14.20",
    category: "Transport",
    icon: <TrainIcon weight="bold" />,
    merchant: "Uber",
    tone: "expense",
  },
  {
    amount: "-$15.99",
    category: "Subscription",
    icon: <SquaresFourIcon weight="bold" />,
    merchant: "Netflix",
    tone: "expense",
  },
];

const spendingTrend = [
  { amount: 1760, month: "Jan" },
  { amount: 1420, month: "Feb" },
  { amount: 2100, month: "Mar" },
  { amount: 1920, month: "Apr" },
  { amount: 2250, month: "May" },
  { amount: 1780, month: "Jun" },
  { amount: 2070, month: "Jul" },
  { amount: 2020, month: "Aug" },
  { amount: 2240, month: "Sep" },
  { amount: 2400, month: "Nov" },
  { amount: 2140, month: "Dec" },
];

const chartConfig = {
  amount: {
    color: "#10b981",
    label: "Spending",
  },
} satisfies ChartConfig;

export function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-7 lg:px-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="grid gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Hafnum v0.1
            </p>
            <h1 className="text-2xl font-medium tracking-normal">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview of your financial health
            </p>
          </div>
          <div className="flex items-center">
            <Button
              className="border-border bg-background text-foreground hover:bg-muted"
              type="button"
              variant="outline"
            >
              May 2026
              <CaretDownIcon className="size-4 text-muted-foreground" />
            </Button>
            <Button
              className="border-border border-l-0 bg-background px-3 text-foreground hover:bg-muted"
              type="button"
              variant="outline"
            >
              <CalendarBlankIcon className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,1fr)]">
          <InsightCard />
          <TopCategoriesCard />
        </section>

        <section className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,1fr)]">
          <SpendingTrendCard />
          <RecentTransactionsCard />
        </section>
      </div>
    </main>
  );
}

function MetricCard({ metric }: Readonly<{ metric: Metric }>) {
  return (
    <Card className="border border-border bg-card py-0 ring-0">
      <CardHeader className="gap-4 px-5 py-5">
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="font-mono text-2xl font-medium">
          {metric.value}
        </CardTitle>
        <p
          className="text-sm text-muted-foreground data-[tone=positive]:font-medium data-[tone=positive]:text-emerald-600"
          data-tone={metric.tone}
        >
          {metric.detail}
        </p>
      </CardHeader>
    </Card>
  );
}

function InsightCard() {
  const bars = [42, 58, 92, 48, 68];

  return (
    <Card className="border border-border bg-card py-0 ring-0">
      <CardContent className="grid gap-6 px-5 py-5 md:grid-cols-[minmax(0,1fr)_8rem] md:items-end">
        <div className="grid gap-4">
          <p className="text-sm font-medium text-muted-foreground">AI Insight</p>
          <div className="grid gap-3">
            <h2 className="text-base font-medium">
              Food spending increased
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              You spent 28% more on food this month. Most of the increase came
              from restaurants on weekends.
            </p>
            <p className="text-sm text-foreground">
              <span className="font-medium">Action:</span> limit
              restaurant spending to $80/weekend.
            </p>
            <p className="text-sm font-medium text-emerald-600">
              Estimated saving: -$120/month
            </p>
          </div>
          <Button
            className="w-fit border-border bg-background text-foreground hover:bg-muted"
            type="button"
            variant="outline"
          >
            View insight
          </Button>
        </div>
        <div className="hidden h-32 items-end justify-end gap-3 md:flex">
          {bars.map((height, index) => (
            <span
              className="w-3 bg-linear-to-t from-emerald-500/10 to-emerald-500"
              key={index}
              style={{ height }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopCategoriesCard() {
  return (
    <Card className="border border-border bg-card py-0 ring-0">
      <CardHeader className="grid grid-cols-[1fr_auto] border-b border-border px-5 py-4">
        <div className="grid gap-1">
          <CardTitle className="text-sm">Top Categories</CardTitle>
          <CardDescription>This month</CardDescription>
        </div>
        <button
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          type="button"
        >
          View all
        </button>
      </CardHeader>
      <CardContent className="grid gap-4 px-5 py-5">
        <IconContext.Provider value={{ className: "size-3.5" }}>
          {topCategories.map((category) => (
            <div
              className="grid grid-cols-[minmax(0,1fr)_6rem_3.5rem] items-center gap-4"
              key={category.name}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex size-6 items-center justify-center border text-white"
                  style={{
                    backgroundColor: category.color,
                    borderColor: category.color,
                  }}
                >
                  {category.icon}
                </span>
                <span className="truncate text-sm font-medium">
                  {category.name}
                </span>
              </div>
              <span className="text-right font-mono text-sm">
                {category.amount}
              </span>
              <span
                className="text-right font-mono text-sm font-medium data-[direction=down]:text-emerald-600 data-[direction=up]:text-red-600"
                data-direction={category.direction}
              >
                {category.change} {category.direction === "up" ? "↑" : "↓"}
              </span>
            </div>
          ))}
        </IconContext.Provider>
      </CardContent>
    </Card>
  );
}

function SpendingTrendCard() {
  return (
    <Card className="border border-border bg-card py-0 ring-0">
      <CardHeader className="grid gap-4 border-b border-border px-5 py-4 md:grid-cols-[1fr_auto]">
        <div className="grid gap-1">
          <CardTitle className="text-sm">Spending Trend</CardTitle>
          <CardDescription>This year</CardDescription>
        </div>
        <div className="grid grid-cols-3 border border-border text-xs">
          {["Total", "Categories", "Merchants"].map((item) => (
            <button
              className="px-3 py-2 text-muted-foreground first:bg-muted first:text-foreground hover:bg-muted"
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-5 py-5">
        <ChartContainer
          className="h-[230px] w-full"
          config={chartConfig}
          initialDimension={{ height: 230, width: 660 }}
        >
          <BarChart
            accessibilityLayer
            data={spendingTrend}
            margin={{ bottom: 8, left: 0, right: 10, top: 8 }}
          >
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickLine={false}
              tickMargin={12}
            />
            <YAxis
              axisLine={false}
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
              tickLine={false}
              tickMargin={8}
              width={42}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="border-border bg-background text-foreground"
                  formatter={(value) => (
                    <div className="flex min-w-36 items-center justify-between gap-4">
                      <span className="text-muted-foreground">Spending</span>
                      <span className="font-mono">
                        {currencyFormatter.format(Number(value))}
                      </span>
                    </div>
                  )}
                  hideLabel
                />
              }
            />
            <Bar dataKey="amount" fill="#d4d4d8" radius={0}>
              {spendingTrend.map((entry) => (
                <Cell
                  fill={entry.month === "May" ? "#16a34a" : "#d4d4d8"}
                  key={entry.month}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RecentTransactionsCard() {
  return (
    <Card className="border border-border bg-card py-0 ring-0">
      <CardHeader className="grid grid-cols-[1fr_auto] border-b border-border px-5 py-4">
        <CardTitle className="text-sm">Recent Transactions</CardTitle>
        <button
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          type="button"
        >
          View all
        </button>
      </CardHeader>
      <CardContent className="divide-y divide-border px-5 py-2">
        <IconContext.Provider value={{ className: "size-3.5" }}>
          {transactions.map((transaction) => (
            <div
              className="grid grid-cols-[minmax(0,1fr)_6rem_6rem] items-center gap-4 py-3"
              key={`${transaction.merchant}-${transaction.amount}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-5 items-center justify-center border border-border bg-muted text-muted-foreground">
                  {transaction.icon}
                </span>
                <span className="truncate text-sm font-medium">
                  {transaction.merchant}
                </span>
              </div>
              <span className="truncate text-sm text-muted-foreground">
                {transaction.category}
              </span>
              <span
                className="text-right font-mono text-sm font-medium data-[tone=expense]:text-red-600 data-[tone=income]:text-emerald-600"
                data-tone={transaction.tone}
              >
                {transaction.amount}
              </span>
            </div>
          ))}
        </IconContext.Provider>
      </CardContent>
    </Card>
  );
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});
