import { Column, Table } from "effect-qb/postgres";
import { externalConnections } from "./external-connections";

export const syncronizationCursors = Table.make("syncronization-cursors", {
  id: Column.uuid(),
  externalConnectionId: Column.uuid(),
  value: Column.text(),
  lastSyncronizationAt: Column.timestamp(),
}).pipe(
  Table.primaryKey("id"),
  Table.foreignKey("externalConnectionId", () => externalConnections, "id"),
);
