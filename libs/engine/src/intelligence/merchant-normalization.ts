import { flow, String } from "effect";

export const normalizeMerchantName = flow(
  String.trim,
  String.replace(/\s+/g, " "),
  String.toLowerCase,
);
