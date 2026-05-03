import {
  ArrowsDownUpIcon,
  BankIcon,
  CalendarBlankIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  TagIcon,
  TextTIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { accountOptions, transactionCategories } from "./mock-transactions";
import {
  renderAmount,
  renderCategoryBadge,
  renderStatusBadge,
  TransactionRowActions,
} from "./transaction-columns";
import { type Transaction } from "./transaction-types";

const INITIAL_ROWS = 16;
const ROW_INCREMENT = 12;

const typeOptions: Array<{
  icon: React.ReactNode;
  label: string;
  value: Transaction["type"];
}> = [
  { icon: <TextTIcon className="size-4" />, label: "Income", value: "income" },
  { icon: <BankIcon className="size-4" />, label: "Expense", value: "expense" },
];

export function TransactionDataTable({
  onDeleteTransaction,
  onEditTransaction,
  onFilteredTransactionsChange,
  onViewTransaction,
  transactions,
}: Readonly<{
  onDeleteTransaction: (transaction: Transaction) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onFilteredTransactionsChange?: (transactions: Transaction[]) => void;
  onViewTransaction: (transaction: Transaction) => void;
  transactions: Transaction[];
}>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Transaction["status"][]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [accountFilter, setAccountFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<Transaction["type"][]>([]);
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: "date" }]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS);
  const [accountSearch, setAccountSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];

    if (statusFilter.length > 0) {
      filters.push({ id: "status", value: statusFilter });
    }

    if (categoryFilter.length > 0) {
      filters.push({ id: "categories", value: categoryFilter });
    }

    if (accountFilter.length > 0) {
      filters.push({ id: "accountName", value: accountFilter });
    }

    if (typeFilter.length > 0) {
      filters.push({ id: "type", value: typeFilter });
    }

    return filters;
  }, [accountFilter, categoryFilter, statusFilter, typeFilter]);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="font-mono text-muted-foreground">{row.original.date}</span>
        ),
      },
      {
        id: "description",
        accessorFn: (row) =>
          [
            row.description,
            row.accountName,
            ...row.categories.map((category) => category.name),
          ].join(" "),
        header: "Description",
        cell: ({ row }) => (
          <div className="grid gap-1">
            <div className="font-medium text-foreground">{row.original.description}</div>
            {row.original.note ? (
              <div className="line-clamp-1 text-muted-foreground">{row.original.note}</div>
            ) : null}
          </div>
        ),
      },
      {
        id: "categories",
        accessorFn: (row) => row.categories.map((category) => category.id),
        header: "Categories",
        filterFn: (row, columnId, value) => {
          if (!Array.isArray(value) || value.length === 0) {
            return true;
          }

          const categoryIds = row.getValue(columnId) as string[];
          return value.some((categoryId) => categoryIds.includes(categoryId));
        },
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1.5">
            {row.original.categories.map((category) =>
              renderCategoryBadge(category, { compact: false }),
            )}
          </div>
        ),
      },
      {
        accessorKey: "accountName",
        header: "Account",
        filterFn: (row, columnId, value) => {
          if (!Array.isArray(value) || value.length === 0) {
            return true;
          }

          return value.includes(String(row.getValue(columnId)));
        },
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.accountName}</span>
        ),
      },
      {
        accessorKey: "amountCents",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => <div className="text-right">{renderAmount(row.original)}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, columnId, value) => {
          if (!Array.isArray(value) || value.length === 0) {
            return true;
          }

          return value.includes(row.getValue(columnId) as Transaction["status"]);
        },
        cell: ({ row }) => renderStatusBadge(row.original, { compact: false }),
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right" onClick={(event) => event.stopPropagation()}>
            <TransactionRowActions
              onDelete={() => onDeleteTransaction(row.original)}
              onEdit={() => onEditTransaction(row.original)}
              onView={() => onViewTransaction(row.original)}
            />
          </div>
        ),
      },
    ],
    [onDeleteTransaction, onEditTransaction, onViewTransaction],
  );

  const table = useReactTable({
    columns,
    data: transactions,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, value) => {
      const search = String(value ?? "")
        .trim()
        .toLowerCase();
      if (!search) {
        return true;
      }

      return [
        row.original.description,
        row.original.accountName,
        ...row.original.categories.map((category) => category.name),
      ].some((entry) => entry.toLowerCase().includes(search));
    },
    onColumnFiltersChange: () => undefined,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
  });

  const filteredRows = table.getRowModel().rows;
  const filteredTransactions = useMemo(
    () => filteredRows.map((row) => row.original),
    [filteredRows],
  );
  const visibleRows = filteredRows.slice(0, visibleCount);
  const hasMoreRows = visibleRows.length < filteredRows.length;
  const filteredAccountOptions = accountOptions.filter((account) =>
    account.toLowerCase().includes(accountSearch.toLowerCase()),
  );
  const filteredCategoryOptions = transactionCategories.filter((category) =>
    `${category.name} ${category.emoji}`.toLowerCase().includes(categorySearch.toLowerCase()),
  );
  const hasStatusFilter = statusFilter.length > 0;
  const hasCategoryFilter = categoryFilter.length > 0;
  const hasAccountFilter = accountFilter.length > 0;
  const hasTypeFilter = typeFilter.length > 0;
  const activeFilterCount = [
    hasStatusFilter,
    hasCategoryFilter,
    hasAccountFilter,
    hasTypeFilter,
  ].filter(Boolean).length;
  const appliedFilters = [
    ...(hasStatusFilter
      ? [
          {
            key: "status",
            label: `Status: ${statusFilter.join(", ")}`,
            onRemove: () => setStatusFilter([]),
          },
        ]
      : []),
    ...(hasAccountFilter
      ? [
          {
            key: "account",
            label: `Account: ${accountFilter.join(", ")}`,
            onRemove: () => setAccountFilter([]),
          },
        ]
      : []),
    ...(hasTypeFilter
      ? [
          {
            key: "type",
            label: `Type: ${typeFilter.join(", ")}`,
            onRemove: () => setTypeFilter([]),
          },
        ]
      : []),
    ...(hasCategoryFilter
      ? [
          {
            key: "category",
            label: `Category: ${categoryFilter
              .map(
                (categoryId) =>
                  transactionCategories.find((entry) => entry.id === categoryId)?.name,
              )
              .filter((name): name is string => !!name)
              .join(", ")}`,
            onRemove: () => setCategoryFilter([]),
          },
        ]
      : []),
  ];

  useEffect(() => {
    setVisibleCount(INITIAL_ROWS);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [
    globalFilter,
    statusFilter,
    categoryFilter,
    accountFilter,
    typeFilter,
    sorting,
    transactions,
  ]);

  useEffect(() => {
    onFilteredTransactionsChange?.(filteredTransactions);
  }, [filteredTransactions, onFilteredTransactionsChange]);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;

    if (hasMoreRows && element.scrollHeight - element.scrollTop - element.clientHeight < 160) {
      setVisibleCount((current) => Math.min(filteredRows.length, current + ROW_INCREMENT));
    }
  }

  function resetFilters() {
    setStatusFilter([]);
    setCategoryFilter([]);
    setAccountFilter([]);
    setTypeFilter([]);
    setAccountSearch("");
    setCategorySearch("");
  }

  function toggleValue<T>(current: T[], value: T) {
    return current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value];
  }

  function renderFilterCount(count: number) {
    return count > 0 ? (
      <span className="ml-auto inline-flex min-w-4 items-center justify-center border border-border px-1 font-mono text-[10px] leading-4 text-foreground">
        {count}
      </span>
    ) : null;
  }

  return (
    <div className="grid gap-0">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="relative min-w-0">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 max-w-sm pl-9 text-xs"
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search description, account, category..."
              value={globalFilter}
            />
          </div>
          {appliedFilters.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {appliedFilters.map((filter) => (
                <Badge
                  className="gap-2 border-border bg-background px-2 py-1 font-normal normal-case tracking-normal text-foreground"
                  key={filter.key}
                  variant="secondary"
                >
                  <span>{filter.label}</span>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    onClick={filter.onRemove}
                    type="button"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <button
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
                type="button"
              >
                Reset all
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-none border border-input bg-background px-3 py-2 text-xs text-foreground hover:bg-muted">
              <FunnelSimpleIcon className="size-4" />
              <span>Filter</span>
              {activeFilterCount > 0 ? (
                <span className="font-mono text-muted-foreground">{activeFilterCount}</span>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-64 p-0">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-4 pt-4 pb-2 text-sm font-medium text-foreground">
                  Filter by
                </DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="px-4 py-3 text-sm">
                    <BankIcon className="size-4 text-muted-foreground" />
                    Account
                    {renderFilterCount(accountFilter.length)}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-64 p-3">
                    <div className="grid gap-2">
                      <Input
                        onChange={(event) => setAccountSearch(event.target.value)}
                        placeholder="Search"
                        value={accountSearch}
                      />
                      {filteredAccountOptions.map((account) => (
                        <button
                          className="flex items-center gap-3 px-2 py-2 text-left text-sm hover:bg-muted"
                          key={account}
                          onClick={() =>
                            setAccountFilter((current) => toggleValue(current, account))
                          }
                          type="button"
                        >
                          <Checkbox checked={accountFilter.includes(account)} readOnly />
                          <span>{account}</span>
                        </button>
                      ))}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="px-4 py-3 text-sm">
                    <TagIcon className="size-4 text-muted-foreground" />
                    Category
                    {renderFilterCount(categoryFilter.length)}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-72 p-3">
                    <div className="grid gap-2">
                      <Input
                        onChange={(event) => setCategorySearch(event.target.value)}
                        placeholder="Search"
                        value={categorySearch}
                      />
                      {filteredCategoryOptions.map((category) => (
                        <button
                          className="flex items-center gap-3 px-2 py-2 text-left text-sm hover:bg-muted"
                          key={category.id}
                          onClick={() =>
                            setCategoryFilter((current) => toggleValue(current, category.id))
                          }
                          type="button"
                        >
                          <Checkbox checked={categoryFilter.includes(category.id)} readOnly />
                          <span>
                            {category.emoji} {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="px-4 py-3 text-sm">
                    <WarningCircleIcon className="size-4 text-muted-foreground" />
                    Status
                    {renderFilterCount(statusFilter.length)}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-56 p-3">
                    <div className="grid gap-2">
                      {(["pending", "completed", "failed"] as const).map((status) => (
                        <button
                          className="flex items-center gap-3 px-2 py-2 text-left text-sm hover:bg-muted"
                          key={status}
                          onClick={() => setStatusFilter((current) => toggleValue(current, status))}
                          type="button"
                        >
                          <Checkbox checked={statusFilter.includes(status)} readOnly />
                          <span className="capitalize">{status}</span>
                        </button>
                      ))}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="px-4 py-3 text-sm">
                    <TextTIcon className="size-4 text-muted-foreground" />
                    Type
                    {renderFilterCount(typeFilter.length)}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-56 p-3">
                    <div className="grid gap-2">
                      {typeOptions.map((typeOption) => (
                        <button
                          className="flex items-center gap-3 px-2 py-2 text-left text-sm hover:bg-muted"
                          key={typeOption.value}
                          onClick={() =>
                            setTypeFilter((current) => toggleValue(current, typeOption.value))
                          }
                          type="button"
                        >
                          <Checkbox checked={typeFilter.includes(typeOption.value)} readOnly />
                          {typeOption.icon}
                          <span>{typeOption.label}</span>
                        </button>
                      ))}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <button
                className="w-full px-4 py-3 text-left text-sm text-muted-foreground hover:bg-muted"
                onClick={resetFilters}
                type="button"
              >
                Reset all
              </button>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-none border border-input bg-background px-3 py-2 text-xs text-foreground hover:bg-muted">
              <ArrowsDownUpIcon className="size-4" />
              <span>Sort</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56 p-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-2 text-sm font-medium text-foreground">
                  Sort by
                </DropdownMenuLabel>
                <button
                  className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => setSorting([{ desc: true, id: "date" }])}
                  type="button"
                >
                  <CalendarBlankIcon className="size-4" />
                  Date
                  {sorting[0]?.id === "date" ? <span className="ml-auto">✓</span> : null}
                </button>
                <button
                  className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => setSorting([{ desc: true, id: "amountCents" }])}
                  type="button"
                >
                  <BankIcon className="size-4" />
                  Amount
                  {sorting[0]?.id === "amountCents" ? <span className="ml-auto">✓</span> : null}
                </button>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-h-[62vh] overflow-auto" onScroll={handleScroll} ref={scrollRef}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-background" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <TableHead
                      className={
                        header.column.id === "amountCents" || header.column.id === "actions"
                          ? "text-right"
                          : undefined
                      }
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {sortDirection === "asc" ? "↑" : null}
                          {sortDirection === "desc" ? "↓" : null}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-10 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  No matching transactions.
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  onClick={() => onViewTransaction(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-5 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          Showing {visibleRows.length} of {filteredRows.length} matching transactions
        </div>
        <div>{hasMoreRows ? "Scroll to load more" : "End of results"}</div>
      </div>
    </div>
  );
}
