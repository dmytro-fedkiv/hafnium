import { Column, enum as enumType, Table } from "effect-qb/postgres";
import { accountHolders } from "./account-holders";

export enum ExternalConnectionProvider {
  Plaid = "plaid",
}

export const externalConnectionProvider = enumType("external_connection_provider", [
  ExternalConnectionProvider.Plaid,
]);

export const externalConnections = Table.make("external_connections", {
  id: Column.uuid(),
  accountHolderId: Column.uuid(),
  externalId: Column.text(),
  provider: externalConnectionProvider.column(),
}).pipe(
  Table.primaryKey("id"),
  Table.foreignKey("accountHolderId", () => accountHolders, "id"),
  Table.unique(["externalId", "provider"]),
);
