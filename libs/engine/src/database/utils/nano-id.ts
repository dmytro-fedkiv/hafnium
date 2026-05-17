import { Schema } from "effect";

export type NanoId = Schema.Schema.Type<typeof NanoId>;
export const NanoId = Schema.String.pipe(
  Schema.length(21),
  Schema.pattern(/^[A-Za-z0-9_-]+$/),
  Schema.brand("NanoId"),
);
