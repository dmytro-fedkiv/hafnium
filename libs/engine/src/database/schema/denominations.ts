import { NanoId } from "@/database/utils/nano-id";
import { Schema, State } from "@livestore/livestore";

export const DENOMINATION_CODE_MIN_LENGTH = 1;
export const DENOMINATION_CODE_MAX_LENGTH = 6;

export const DenominationSchema = Schema.Struct({
  id: NanoId.pipe(State.SQLite.withPrimaryKey),

  name: Schema.NonEmptyTrimmedString,
  code: Schema.NonEmptyTrimmedString.pipe(
    Schema.uppercased(),
    Schema.length({
      min: DENOMINATION_CODE_MIN_LENGTH,
      max: DENOMINATION_CODE_MAX_LENGTH,
    }),
    Schema.brand("DenominationCode"),
  ),

  precision: Schema.Int.pipe(Schema.nonNegative()),
});

export const DenominationTable = State.SQLite.table({
  name: "denominations",
  schema: DenominationSchema,
});
