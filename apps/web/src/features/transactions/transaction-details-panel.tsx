import {
  CalendarBlankIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderCategoryBadge, renderStatusBadge } from "./transaction-columns";
import { type Transaction } from "./transaction-types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export function TransactionDetailsPanel({
  onDelete,
  onEdit,
  onOpenChange,
  open,
  transaction,
}: Readonly<{
  onDelete: () => void;
  onEdit: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  transaction: Transaction | null;
}>) {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className="max-w-lg border-l border-border bg-background"
        side="right"
      >
        {transaction ? (
          <>
            <SheetHeader className="border-b border-border px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-1">
                  <SheetTitle>{transaction.description}</SheetTitle>
                  <SheetDescription>
                    Inspect and manage this local transaction record.
                  </SheetDescription>
                </div>
                {renderStatusBadge(transaction)}
              </div>
            </SheetHeader>

            <div className="grid gap-5 px-5 py-5 text-xs">
              <section className="grid gap-2 border border-border p-4">
                <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Transaction Id
                </div>
                <div className="font-mono text-foreground">{transaction.id}</div>
              </section>

              <section className="grid gap-4 border border-border p-4">
                <div className="grid gap-1">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    Amount
                  </div>
                  <div className="font-mono text-2xl font-medium">
                    {transaction.type === "income" ? "+" : "-"}
                    {currencyFormatter.format(transaction.amountCents / 100)}
                  </div>
                </div>

                <div className="grid gap-3 text-muted-foreground">
                  <div className="flex items-center justify-between gap-3">
                    <span>Account</span>
                    <span className="text-foreground">{transaction.accountName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Date</span>
                    <span className="flex items-center gap-2 text-foreground">
                      <CalendarBlankIcon className="size-4" />
                      {transaction.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Direction</span>
                    <Badge variant="secondary">{transaction.type}</Badge>
                  </div>
                </div>
              </section>

              <section className="grid gap-2 border border-border p-4">
                <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {transaction.categories.map((category) =>
                    renderCategoryBadge(category),
                  )}
                </div>
              </section>

              <section className="grid gap-2 border border-border p-4">
                <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Note
                </div>
                <p className="text-foreground">
                  {transaction.note?.trim() || "No note added."}
                </p>
              </section>
            </div>

            <SheetFooter className="border-t border-border px-5 py-4">
              <div className="flex w-full items-center justify-between gap-3">
                <Button onClick={onDelete} type="button" variant="destructive">
                  <TrashIcon className="size-4" />
                  Delete
                </Button>
                <Button onClick={onEdit} type="button" variant="outline">
                  <PencilSimpleIcon className="size-4" />
                  Edit
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
