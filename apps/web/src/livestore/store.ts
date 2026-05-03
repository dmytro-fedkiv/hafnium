import { makePersistedAdapter } from "@livestore/adapter-web";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import { StoreRegistry, storeOptions, useStore } from "@livestore/react";
import { schema } from "@hafnium/engine";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";
import LiveStoreWorker from "../livestore.worker.ts?worker";

const adapter = makePersistedAdapter({
  storage: { type: "opfs" },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
});

export const hafniumStoreOptions = storeOptions({
  adapter,
  batchUpdates,
  schema,
  storeId: "hafnium-app",
});

export function createHafniumStoreRegistry() {
  return new StoreRegistry({
    defaultOptions: {
      batchUpdates,
    },
  });
}

export function useHafniumStore() {
  return useStore(hafniumStoreOptions);
}
