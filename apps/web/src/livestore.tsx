import { schema } from "@hafnium/schema";
import { makePersistedAdapter } from "@livestore/adapter-web";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import { LiveStoreProvider } from "@livestore/react";
import type { ReactNode } from "react";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";
import { AppLoadingScreen } from "./components/app-loading-screen";
import LiveStoreWorker from "./livestore.worker?worker";

const adapter = makePersistedAdapter({
  storage: { type: "opfs" },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
});

export function HafniumLiveStoreProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <LiveStoreProvider
      adapter={adapter}
      batchUpdates={batchUpdates}
      renderLoading={({ stage }) => <AppLoadingScreen stage={stage} />}
      schema={schema}
      storeId="hafnium-local-v0-2"
    >
      {children}
    </LiveStoreProvider>
  );
}
