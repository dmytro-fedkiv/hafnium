import { NanoId } from "@/database/utils/nano-id";
import { Schema, State } from "@livestore/livestore";

export const InstrumentSchema = Schema.Struct({
  id: NanoId.pipe(State.SQLite.withPrimaryKey),

  name: Schema.NonEmptyTrimmedString,
});

export const InstrumentTable = State.SQLite.table({
  name: "instruments",
  schema: InstrumentSchema,
});
