import { Column, Table } from "effect-qb/postgres";

export const accountHolders = Table.make("account_holders", {
  id: Column.uuid(),
}).pipe(Table.primaryKey("id"));
