/// <reference types="vite/client" />

import {
  ClientOnly,
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, type ReactNode } from "react";
import "../styles.css";

const HafniumLiveStoreProvider = lazy(() =>
  import("../livestore").then((module) => ({
    default: module.HafniumLiveStoreProvider,
  })),
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "hafnium" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ClientOnly
        fallback={<main className="shell">Loading local store...</main>}
      >
        <Suspense
          fallback={<main className="shell">Loading local store...</main>}
        >
          <HafniumLiveStoreProvider>
            <Outlet />
          </HafniumLiveStoreProvider>
        </Suspense>
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
