/// <reference types="vite/client" />

import { WarningCircleIcon } from "@phosphor-icons/react";
import {
  ClientOnly,
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useLocation,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { Suspense, type ReactNode } from "react";
import { AppLoadingScreen } from "../components/app-loading-screen";
import { AppShell } from "../components/app-sidebar";
import { Button } from "../components/ui/button";
import { HafniumLiveStoreProvider } from "../livestore/provider";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "hafnium" },
    ],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ClientOnly fallback={<LoadingShell />}>
        <Suspense fallback={<LoadingShell />}>
          <AppShell>
            <HafniumLiveStoreProvider>
              <Outlet />
            </HafniumLiveStoreProvider>
          </AppShell>
        </Suspense>
      </ClientOnly>
    </RootDocument>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <RootDocument>
      <ClientOnly fallback={<LoadingShell />}>
        <AppShell>
          <ErrorScreen error={error} onRetry={reset} />
        </AppShell>
      </ClientOnly>
    </RootDocument>
  );
}

function RootNotFoundComponent() {
  return (
    <RootDocument>
      <ClientOnly fallback={<LoadingShell />}>
        <AppShell>
          <NotFoundScreen />
        </AppShell>
      </ClientOnly>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LoadingShell() {
  return (
    <AppShell>
      <AppLoadingScreen />
    </AppShell>
  );
}

function ErrorScreen({
  error,
  onRetry,
}: Readonly<{ error: unknown; onRetry: () => void }>) {
  const timestamp = formatTimestamp(new Date());
  const diagnostics = getErrorDiagnostics(error);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-8 py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Hafnum v0.1
        </p>

        <section className="border border-border bg-card px-8 py-12">
          <div className="mx-auto flex max-w-[40rem] flex-col items-center gap-6 text-center">
            <div className="flex size-20 items-center justify-center border border-red-200 text-red-600">
              <WarningCircleIcon className="size-10" weight="duotone" />
            </div>

            <div className="grid gap-3">
              <h1 className="font-mono text-4xl font-medium uppercase tracking-tight">
                Something went wrong
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                We couldn&apos;t load your financial workspace.
                <br />
                Your local data is still safe on this device.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={onRetry} type="button">
                Try again
              </Button>
              <Button
                onClick={() => {
                  console.error(error);
                }}
                type="button"
                variant="outline"
              >
                Open diagnostics
              </Button>
            </div>

            <div className="w-full border border-border px-5 py-4 text-left">
              <div className="grid gap-2 font-mono text-sm">
                <p>
                  <span className="text-muted-foreground">Error code:</span>{" "}
                  {diagnostics.code}
                </p>
                <p>
                  <span className="text-muted-foreground">Time:</span>{" "}
                  {timestamp}
                </p>
                <p className="leading-6">
                  <span className="text-muted-foreground">Details:</span>{" "}
                  {diagnostics.details}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function NotFoundScreen() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const timestamp = formatTimestamp(new Date());

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-8 py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Hafnum v0.1
        </p>

        <section className="border border-border bg-card px-8 py-12">
          <div className="mx-auto flex max-w-[40rem] flex-col items-center gap-6 text-center">
            <div className="grid place-items-center gap-2 font-mono text-foreground">
              <div className="border border-foreground px-6 py-4 text-5xl font-medium">
                404
              </div>
            </div>

            <div className="grid gap-3">
              <h1 className="font-mono text-4xl font-medium uppercase tracking-tight">
                Page not found
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                This page does not exist or was moved.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button render={<Link to="/dashboard" />} type="button">
                Go to dashboard
              </Button>
              <Button
                render={<Link to="/transactions" />}
                type="button"
                variant="outline"
              >
                View transactions
              </Button>
            </div>

            <div className="w-full border border-border px-5 py-4 text-left">
              <div className="grid gap-2 font-mono text-sm">
                <p>
                  <span className="text-muted-foreground">
                    Requested route:
                  </span>{" "}
                  {pathname}
                </p>
                <p>
                  <span className="text-muted-foreground">Time:</span>{" "}
                  {timestamp}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    year: "numeric",
  }).format(date);
}

function getErrorDiagnostics(error: unknown) {
  if (error instanceof Error) {
    const code =
      "routeError" in error && typeof error.routeError === "string"
        ? error.routeError
        : error.name || "APP_ERROR";

    return {
      code: code.toUpperCase(),
      details: error.message || "Unknown application error.",
    };
  }

  return {
    code: "APP_ERROR",
    details: "Unknown application error.",
  };
}
