import { NanoId } from "@/database/utils/nano-id";
import { Schema, State } from "@livestore/livestore";

export const CounterpartySchema = Schema.Struct({
  id: NanoId.pipe(State.SQLite.withPrimaryKey),

  name: Schema.NonEmptyTrimmedString,
});

export const CounterpartyTable = State.SQLite.table({
  name: "counterparties",
  schema: CounterpartySchema,
});
