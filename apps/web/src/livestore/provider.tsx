import { StoreRegistryProvider } from "@livestore/react";
import { useState, type ReactNode } from "react";
import { createHafniumStoreRegistry } from "./store";

export function HafniumLiveStoreProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [storeRegistry] = useState(createHafniumStoreRegistry);

  return (
    <StoreRegistryProvider storeRegistry={storeRegistry}>
      {children}
    </StoreRegistryProvider>
  );
}
