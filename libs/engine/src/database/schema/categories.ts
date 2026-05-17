import { NanoId } from "@/database/utils/nano-id";
import { Schema, State } from "@livestore/livestore";

export enum CategoryColor {
  Red = "red",
  Orange = "orange",
  Yellow = "yellow",
  Green = "green",
  Blue = "blue",
  Purple = "purple",
  Gray = "gray",
}

export const CategorySchema = Schema.Struct({
  id: NanoId.pipe(State.SQLite.withPrimaryKey),

  name: Schema.NonEmptyTrimmedString,
  color: Schema.Enums(CategoryColor),
});

export const CategoryTable = State.SQLite.table({
  name: "categories",
  schema: CategorySchema,
});
