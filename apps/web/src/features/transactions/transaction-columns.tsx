import {
  AirplaneTiltIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  ClockCountdownIcon,
  CoffeeIcon,
  DotsThreeOutlineVerticalIcon,
  EyeIcon,
  ForkKnifeIcon,
  HeartbeatIcon,
  HouseIcon,
  PencilSimpleIcon,
  ReceiptIcon,
  ShapesIcon,
  TrashIcon,
  WarningOctagonIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  type Transaction,
  type TransactionCategory,
  type TransactionColumnId,
  type TransactionSortKey,
} from "./transaction-types";

type SortState = {
  direction: "asc" | "desc";
  key: TransactionSortKey;
};

export const transactionColumnLabels: Record<TransactionColumnId, string> = {
  date: "Date",
  description: "Description",
  categories: "Categories",
  accountName: "Account",
  amountCents: "Amount",
  status: "Status",
  actions: "Actions",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

const categoryIcons = {
  coffee: CoffeeIcon,
  food: ForkKnifeIcon,
  health: HeartbeatIcon,
  rent: HouseIcon,
  salary: BriefcaseIcon,
  software: ReceiptIcon,
  travel: AirplaneTiltIcon,
} as const;

const statusStyles = {
  completed: {
    background: "#dcfce7",
    color: "#166534",
    icon: CalendarCheckIcon,
    label: "Completed",
  },
  failed: {
    background: "#fee2e2",
    color: "#b91c1c",
    icon: WarningOctagonIcon,
    label: "Failed",
  },
  pending: {
    background: "#fef3c7",
    color: "#b45309",
    icon: ClockCountdownIcon,
    label: "Pending",
  },
} satisfies Record<
  Transaction["status"],
  {
    background: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }
>;

export function renderCategoryBadge(
  category: TransactionCategory,
  options?: Readonly<{ compact?: boolean }>,
) {
  const Icon = resolveCategoryIcon(category.id);
  const isCompact = options?.compact ?? false;

  return (
    <Badge
      className="rounded-none border-0 normal-case tracking-normal shadow-none"
      key={category.id}
      style={{
        backgroundColor: category.color,
        color: "#ffffff",
      }}
      variant="secondary"
    >
      <span aria-hidden="true" className="grid size-4 place-items-center">
        <Icon className="size-3.5" weight="regular" />
      </span>
      {isCompact ? (
        <span className="sr-only">{category.name}</span>
      ) : (
        <span>{category.name}</span>
      )}
    </Badge>
  );
}

function resolveCategoryIcon(categoryId: string) {
  return categoryId in categoryIcons
    ? categoryIcons[categoryId as keyof typeof categoryIcons]
    : ShapesIcon;
}

export function renderStatusBadge(
  transaction: Transaction,
  options?: Readonly<{ compact?: boolean }>,
) {
  const statusStyle = statusStyles[transaction.status];
  const Icon = statusStyle.icon;
  const isCompact = options?.compact ?? false;

  return (
    <Badge
      className="rounded-none border-0 normal-case shadow-none"
      style={{
        backgroundColor: statusStyle.background,
        color: statusStyle.color,
      }}
      variant="secondary"
    >
      <span aria-hidden="true" className="grid size-4 place-items-center">
        <Icon className="size-3.5" weight="regular" />
      </span>
      {isCompact ? (
        <span className="sr-only">{statusStyle.label}</span>
      ) : (
        <span>{statusStyle.label}</span>
      )}
    </Badge>
  );
}

export function renderAmount(transaction: Transaction) {
  return (
    <span
      className={cn(
        "font-mono text-right font-medium",
        transaction.type === "income" ? "text-emerald-700" : "text-red-700",
      )}
    >
      {transaction.type === "income" ? "+" : "-"}
      {currencyFormatter.format(transaction.amountCents / 100)}
    </span>
  );
}

export function SortHeader({
  activeSort,
  children,
  column,
  onToggle,
}: Readonly<{
  activeSort: SortState;
  children: React.ReactNode;
  column: TransactionSortKey;
  onToggle: (column: TransactionSortKey) => void;
}>) {
  const isActive = activeSort.key === column;

  return (
    <button
      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      onClick={() => onToggle(column)}
      type="button"
    >
      <span>{children}</span>
      {isActive ? (
        activeSort.direction === "asc" ? (
          <ArrowUpIcon className="size-3.5" />
        ) : (
          <ArrowDownIcon className="size-3.5" />
        )
      ) : null}
    </button>
  );
}

export function TransactionRowActions({
  onDelete,
  onEdit,
  onView,
}: Readonly<{
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none bg-transparent p-1 hover:bg-muted">
        <DotsThreeOutlineVerticalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onView}>
            <EyeIcon className="size-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <PencilSimpleIcon className="size-4" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-700" onClick={onDelete}>
          <TrashIcon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ToolbarButton({
  children,
  onClick,
}: Readonly<{
  children: React.ReactNode;
  onClick?: () => void;
}>) {
  return (
    <Button onClick={onClick} size="sm" type="button" variant="outline">
      {children}
    </Button>
  );
}
