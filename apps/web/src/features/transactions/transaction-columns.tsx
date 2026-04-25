import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsThreeOutlineVerticalIcon,
  EyeIcon,
  PencilSimpleIcon,
  TrashIcon,
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

export function renderCategoryBadge(category: TransactionCategory) {
  return (
    <Badge
      className="gap-1.5 rounded-none normal-case tracking-normal"
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
    </Badge>
  );
}

export function renderStatusBadge(transaction: Transaction) {
  const variant =
    transaction.status === "completed"
      ? "success"
      : transaction.status === "pending"
        ? "warning"
        : "destructive";

  return <Badge variant={variant}>{transaction.status}</Badge>;
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
