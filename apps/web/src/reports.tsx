import { CaretDownIcon } from "@phosphor-icons/react";
import {
  Area,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

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

type ReportTab = "Overview" | "Spending" | "Income" | "Cash Flow" | "Net Worth";

type Metric = {
  change: string;
  label: string;
  tone: "positive" | "negative";
  value: string;
};

type ExpenseCategory = {
  amountCents: number;
  color: string;
  name: string;
  percentage: number;
};

const tabs: ReportTab[] = [
  "Overview",
  "Spending",
  "Income",
  "Cash Flow",
  "Net Worth",
];

const metrics: Metric[] = [
  {
    change: "+12% from Apr",
    label: "Total Income",
    tone: "positive",
    value: "$4,200.00",
  },
  {
    change: "+6% from Apr",
    label: "Total Expenses",
    tone: "negative",
    value: "$2,180.40",
  },
  {
    change: "+$55 from Apr",
    label: "Net Savings",
    tone: "positive",
    value: "$2,019.60",
  },
  {
    change: "+4% from Apr",
    label: "Savings Rate",
    tone: "positive",
    value: "48%",
  },
];

const expenseCategories: ExpenseCategory[] = [
  { amountCents: 62840, color: "#22c55e", name: "Food", percentage: 28 },
  { amountCents: 18020, color: "#60a5fa", name: "Transport", percentage: 8 },
  { amountCents: 32000, color: "#3b82f6", name: "Shopping", percentage: 15 },
  { amountCents: 120000, color: "#a855f7", name: "Housing", percentage: 55 },
  { amountCents: 6000, color: "#a3e635", name: "Other", percentage: 6 },
];

const cashFlowData = [
  { expenses: -320, income: 1900, month: "Jan", netWorth: 18800 },
  { expenses: 640, income: 1700, month: "Feb", netWorth: 19860 },
  { expenses: 280, income: 2250, month: "Mar", netWorth: 21830 },
  { expenses: 420, income: 1800, month: "Apr", netWorth: 23210 },
  { expenses: 180, income: 2920, month: "May", netWorth: 25950 },
  { expenses: 910, income: 2650, month: "Jun", netWorth: 27690 },
  { expenses: 940, income: 2840, month: "Jul", netWorth: 29590 },
  { expenses: 760, income: 3060, month: "Aug", netWorth: 31890 },
  { expenses: 1150, income: 2700, month: "Sep", netWorth: 33440 },
  { expenses: 620, income: 2920, month: "Oct", netWorth: 35740 },
  { expenses: 1140, income: 2540, month: "Nov", netWorth: 37140 },
  { expenses: 1480, income: 3150, month: "Dec", netWorth: 38810 },
];

const chartConfig = {
  expenses: {
    color: "#ef4444",
    label: "Expenses",
  },
  income: {
    color: "#10b981",
    label: "Income",
  },
  netWorth: {
    color: "#94a3b8",
    label: "Net Worth",
  },
} satisfies ChartConfig;

const totalExpensesCents = expenseCategories.reduce(
  (total, category) => total + category.amountCents,
  0,
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export function ReportsPage() {
  return (
    <main className="min-h-screen bg-[#0f1011] text-[#EDEDED]">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-8 py-8">
        <section className="flex flex-col gap-4 border-b border-[#26282C] pb-6 md:flex-row md:items-start md:justify-between">
          <div className="grid gap-2">
            <h1 className="text-2xl font-medium tracking-normal text-white">
              Reports
            </h1>
            <p className="text-sm text-[#8D929A]">
              Analyze your financial data
            </p>
          </div>
          <Button
            className="border-[#343840] bg-[#131518] text-[#EDEDED] hover:bg-[#1A1D21]"
            type="button"
            variant="outline"
          >
            May 2026
            <CaretDownIcon className="size-4 text-[#858B94]" />
          </Button>
        </section>

        <nav className="flex flex-wrap gap-8 border-b border-[#26282C]">
          {tabs.map((tab) => (
            <button
              className="relative pb-3 text-sm font-medium text-[#858B94] hover:text-[#EDEDED] data-[active=true]:text-white"
              data-active={tab === "Overview"}
              key={tab}
              type="button"
            >
              {tab}
              {tab === "Overview" ? (
                <span className="absolute right-0 bottom-0 left-0 h-px bg-white" />
              ) : null}
            </button>
          ))}
        </nav>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <Card className="border border-[#26282C] bg-[#141619] py-0 text-[#EDEDED] ring-0">
          <CardHeader className="border-b border-[#26282C] px-5 py-4">
            <CardTitle className="text-sm text-white">
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8 px-5 py-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-center">
            <ChartContainer
              className="mx-auto aspect-square h-[220px] w-[220px]"
              config={{}}
            >
              <PieChart>
                <Pie
                  data={expenseCategories}
                  dataKey="amountCents"
                  innerRadius={58}
                  nameKey="name"
                  outerRadius={92}
                  stroke="none"
                >
                  {expenseCategories.map((category) => (
                    <Cell fill={category.color} key={category.name} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                        return null;
                      }

                      return (
                        <text
                          dominantBaseline="middle"
                          textAnchor="middle"
                          x={viewBox.cx}
                          y={viewBox.cy}
                        >
                          <tspan
                            className="fill-white font-mono text-xl font-medium"
                            x={viewBox.cx}
                            y={viewBox.cy}
                          >
                            {currencyFormatter.format(
                              totalExpensesCents / 100,
                            )}
                          </tspan>
                          <tspan
                            className="fill-[#858B94] text-xs"
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="border-[#343840] bg-[#101214] text-[#EDEDED]"
                      formatter={(value, name) => (
                        <div className="flex min-w-40 items-center justify-between gap-4">
                          <span className="text-[#A6ABB3]">{name}</span>
                          <span className="font-mono text-white">
                            {currencyFormatter.format(Number(value) / 100)}
                          </span>
                        </div>
                      )}
                      hideLabel
                    />
                  }
                />
              </PieChart>
            </ChartContainer>

            <div className="grid gap-4">
              {expenseCategories.map((category) => (
                <div
                  className="grid grid-cols-[minmax(0,1fr)_7rem_3rem] items-center gap-4 text-sm"
                  key={category.name}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="size-2.5 border border-white/10 shadow-[0_0_10px_currentColor]"
                      style={{ backgroundColor: category.color, color: category.color }}
                    />
                    <span className="truncate text-[#EDEDED]">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-right font-mono text-[#A6ABB3]">
                    {currencyFormatter.format(category.amountCents / 100)}
                  </span>
                  <span className="text-right font-mono text-[#A6ABB3]">
                    {category.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#26282C] bg-[#141619] py-0 text-[#EDEDED] ring-0">
          <CardHeader className="grid gap-1 border-b border-[#26282C] px-5 py-4 md:grid-cols-[1fr_auto]">
            <div>
              <CardTitle className="text-sm text-white">Cash Flow</CardTitle>
              <CardDescription className="text-[#858B94]">
                This year
              </CardDescription>
            </div>
            <div className="flex items-center gap-5 text-xs text-[#A6ABB3]">
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#10b981]" />
                Income
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#ef4444]" />
                Expenses
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-5">
            <ChartContainer
              className="h-[300px] w-full"
              config={chartConfig}
              initialDimension={{ height: 300, width: 900 }}
            >
              <LineChart
                accessibilityLayer
                data={cashFlowData}
                margin={{ bottom: 8, left: 0, right: 10, top: 8 }}
              >
                <CartesianGrid
                  stroke="#26282C"
                  strokeDasharray="0"
                  vertical
                />
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tickLine={false}
                  tickMargin={12}
                />
                <YAxis
                  axisLine={false}
                  tickFormatter={(value) =>
                    value === 0 ? "$0" : `$${Number(value) / 1000}k`
                  }
                  tickLine={false}
                  tickMargin={8}
                  width={44}
                />
                <ReferenceLine stroke="#26282C" y={0} />
                <ReferenceLine
                  stroke="#10b981"
                  strokeOpacity={0.35}
                  x="May"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="border-[#343840] bg-[#101214] text-[#EDEDED]"
                      formatter={(value, name) => (
                        <div className="flex min-w-40 items-center justify-between gap-4">
                          <span className="capitalize text-[#A6ABB3]">
                            {name}
                          </span>
                          <span className="font-mono text-white">
                            {currencyFormatter.format(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  dataKey="netWorth"
                  fill="#94a3b8"
                  fillOpacity={0.05}
                  stroke="transparent"
                  type="monotone"
                />
                <Line
                  activeDot={{ r: 4 }}
                  dataKey="income"
                  dot={{ fill: "#10b981", r: 3 }}
                  stroke="#10b981"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  activeDot={{ r: 4 }}
                  dataKey="expenses"
                  dot={{ fill: "#ef4444", r: 3 }}
                  stroke="#ef4444"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function MetricCard({ metric }: Readonly<{ metric: Metric }>) {
  return (
    <Card className="border border-[#26282C] bg-[#141619] py-0 text-[#EDEDED] ring-0">
      <CardHeader className="gap-2 px-5 py-4">
        <CardDescription className="text-[#858B94]">
          {metric.label}
        </CardDescription>
        <CardTitle className="font-mono text-2xl font-medium text-white">
          {metric.value}
        </CardTitle>
        <p
          className="text-xs font-medium data-[tone=negative]:text-[#ef4444] data-[tone=positive]:text-[#10b981]"
          data-tone={metric.tone}
        >
          {metric.change}
        </p>
      </CardHeader>
    </Card>
  );
}
