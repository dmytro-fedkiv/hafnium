import {
  ChartBarIcon,
  ChartLineUpIcon,
  CreditCardIcon,
  CubeIcon,
  GearSixIcon,
  HouseIcon,
  type Icon,
  LightbulbIcon,
  MagnifyingGlassIcon,
  TargetIcon,
  UserCircleIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "@tanstack/react-router";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  icon: Icon;
  label: string;
  marker?: ReactNode;
};

type AccountItem = {
  balance: number;
  label: string;
};

type CommandGroupData = {
  heading: string;
  items: Array<{
    icon: Icon;
    label: string;
    shortcut?: string;
  }>;
};

const primaryNavItems: NavItem[] = [
  { href: "/dashboard", icon: HouseIcon, label: "Dashboard" },
  { href: "/transactions", icon: CreditCardIcon, label: "Transactions" },
  {
    href: "/insights",
    icon: LightbulbIcon,
    label: "Insights",
    marker: (
      <span
        aria-label="New recommendation"
        className="size-1.5 rounded-full bg-emerald-400"
      />
    ),
  },
  {
    href: "/budgets",
    icon: TargetIcon,
    label: "Budgets",
    marker: <WarningIcon aria-label="Budget warning" className="size-3.5" />,
  },
  { href: "/reports", icon: ChartLineUpIcon, label: "Reports" },
];

const accountItems: AccountItem[] = [
  { balance: 3420.5, label: "Checking" },
  { balance: -820, label: "Credit Card" },
  { balance: 12450, label: "Savings" },
];

const commandGroups: CommandGroupData[] = [
  {
    heading: "Navigation",
    items: [
      { icon: CreditCardIcon, label: "Transactions", shortcut: "T" },
      { icon: LightbulbIcon, label: "Insights", shortcut: "I" },
      { icon: TargetIcon, label: "Budgets", shortcut: "B" },
      { icon: ChartLineUpIcon, label: "Reports", shortcut: "R" },
    ],
  },
  {
    heading: "Search",
    items: [
      { icon: MagnifyingGlassIcon, label: "Merchants" },
      { icon: ChartBarIcon, label: "Categories" },
      { icon: LightbulbIcon, label: "Recommendations" },
    ],
  },
  {
    heading: "Accounts",
    items: [
      { icon: CreditCardIcon, label: "Checking" },
      { icon: CreditCardIcon, label: "Credit Card" },
      { icon: CreditCardIcon, label: "Savings" },
    ],
  },
];

const compactFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar": "#0B0B0C",
          "--sidebar-accent": "#17171A",
          "--sidebar-accent-foreground": "#EDEDED",
          "--sidebar-border": "#1F1F23",
          "--sidebar-foreground": "#9A9AA0",
          "--sidebar-ring": "#34343A",
          "--sidebar-width": "15.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar onOpenSearch={() => setIsSearchOpen(true)} />
      <SidebarInset>{children}</SidebarInset>
      <GlobalSearch isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </SidebarProvider>
  );
}

function AppSidebar({ onOpenSearch }: Readonly<{ onOpenSearch: () => void }>) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <Sidebar className="border-[#1F1F23] text-[#9A9AA0]" collapsible="icon">
      <SidebarHeader className="gap-3 px-2 py-3">
        <div className="grid h-8 grid-cols-[minmax(0,1fr)_2rem] items-center gap-2 group-data-[collapsible=icon]:grid-cols-1">
          <a
            aria-label="hafnium home"
            className="flex h-8 min-w-0 items-center gap-2 px-2 text-sm font-medium leading-none text-white outline-none transition-colors hover:bg-[#17171A] focus-visible:ring-2 focus-visible:ring-[#34343A] group-data-[collapsible=icon]:hidden"
            href="/"
            title="hafnium"
          >
            <CubeIcon className="size-4 shrink-0 opacity-70" />
            <span className="min-w-0 truncate group-data-[collapsible=icon]:sr-only">
              hafnium
            </span>
          </a>
          <SidebarTrigger className="size-8 text-[#9A9AA0] hover:bg-[#17171A] hover:text-[#EDEDED] group-data-[collapsible=icon]:mx-auto" />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-9 px-3 text-[13px] text-[#9A9AA0] hover:bg-[#17171A] hover:text-[#EDEDED] data-[active=true]:bg-[#1F1F23] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-9! group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
              onClick={onOpenSearch}
              title="Search"
            >
              <MagnifyingGlassIcon className="size-4 shrink-0 opacity-70" />
              <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:sr-only">
                Search...
              </span>
              <Kbd className="ml-auto border-[#2A2A30] bg-transparent font-mono text-[10px] text-[#6F6F76] group-data-[collapsible=icon]:hidden">
                Cmd K
              </Kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2">
        <SidebarGroup className="border-t border-[#1F1F23] px-0 py-3">
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map((item) => (
                <PrimaryNavItem
                  isActive={isNavItemActive(pathname, item.href)}
                  item={item}
                  key={item.label}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-t border-[#1F1F23] px-0 py-3">
          <SidebarGroupLabel className="h-6 px-3 text-[11px] font-medium text-[#6F6F76]">
            Accounts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuSub className="mx-0 border-l-0 px-0 py-0">
              {accountItems.map((account) => (
                <AccountNavItem account={account} key={account.label} />
              ))}
            </SidebarMenuSub>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-[#1F1F23] px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={sidebarButtonClassName}
              render={
                <a href="/settings">
                  <GearSixIcon className="size-4 shrink-0 opacity-70" />
                  <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:sr-only">
                    Settings
                  </span>
                </a>
              }
              title="Settings"
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={sidebarButtonClassName}
              render={
                <a href="/profile">
                  <UserCircleIcon className="size-4 shrink-0 opacity-70" />
                  <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:sr-only">
                    Profile
                  </span>
                </a>
              }
              title="Profile"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function PrimaryNavItem({
  isActive,
  item,
}: Readonly<{ isActive: boolean; item: NavItem }>) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={sidebarButtonClassName}
        isActive={isActive}
        render={
          <a href={item.href}>
            <Icon className="size-4 shrink-0 opacity-70" />
            <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:sr-only">
              {item.label}
            </span>
          </a>
        }
        title={item.label}
        tooltip={item.label}
      />
      {item.marker ? (
        <SidebarMenuBadge className="right-2 text-amber-300">
          {item.marker}
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/" || pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function AccountNavItem({ account }: Readonly<{ account: AccountItem }>) {
  const href = `/accounts/${account.label.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        className="h-9 px-3 text-[13px] text-[#9A9AA0] hover:bg-[#17171A] hover:text-[#EDEDED] group-data-[collapsible=icon]:hidden"
        render={
          <a href={href}>
            <span className="size-1.5 shrink-0 rounded-full bg-[#6F6F76]" />
            <span className="min-w-0 flex-1 truncate">{account.label}</span>
            <span
              className={cn(
                "ml-auto font-mono text-[12px] text-[#C9C9CE]",
                account.balance < 0 && "text-[#F2A6A6]",
              )}
            >
              {compactFormatter.format(account.balance)}
            </span>
          </a>
        }
        title={account.label}
      />
    </SidebarMenuSubItem>
  );
}

const sidebarButtonClassName =
  "h-9 px-3 text-[13px] text-[#9A9AA0] hover:bg-[#17171A] hover:text-[#EDEDED] data-[active=true]:bg-[#1F1F23] data-[active=true]:text-white data-[active=true]:font-medium group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-9! group-data-[collapsible=icon]:w-8!";

function GlobalSearch({
  isOpen,
  onOpenChange,
}: Readonly<{ isOpen: boolean; onOpenChange: (open: boolean) => void }>) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return commandGroups
      .map((group) => ({
        ...group,
        items: normalizedQuery
          ? group.items.filter((item) =>
              item.label.toLowerCase().includes(normalizedQuery),
            )
          : group.items,
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onOpenChange]);

  return (
    <CommandDialog onOpenChange={onOpenChange} open={isOpen}>
      <Command>
        <CommandInput
          autoFocus
          onValueChange={setQuery}
          placeholder="Search transactions, merchants, categories, insights..."
          value={query}
        />
        <CommandList>
          {groups.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            groups.map((group, index) => (
              <CommandGroup heading={group.heading} key={group.heading}>
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <CommandItem
                      key={item.label}
                      onSelect={() => onOpenChange(false)}
                    >
                      <Icon className="size-4 opacity-70" />
                      <span>{item.label}</span>
                      {item.shortcut ? (
                        <CommandShortcut>Cmd {item.shortcut}</CommandShortcut>
                      ) : null}
                    </CommandItem>
                  );
                })}
                {index < groups.length - 1 ? <CommandSeparator /> : null}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
