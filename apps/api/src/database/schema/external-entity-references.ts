import { Column, Table } from "effect-qb/postgres";
import { externalConnections } from "./external-connections";

export const externalEntityReferences = Table.make("external_entity_references", {
  localEntityId: Column.text(),
  localEntityType: Column.text(),

  externalEntityId: Column.text(),
  externalConnectionId: Column.uuid(),
}).pipe(
  Table.primaryKey(["localEntityId", "localEntityType", "externalEntityId"]),
  Table.foreignKey("externalConnectionId", () => externalConnections, "id"),
);
