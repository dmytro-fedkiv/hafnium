import { Match, Predicate, String } from "effect";

export const detectCategory = Match.type<string>().pipe(
  Match.when(String.includes("coffee"), () => "coffee"),
  Match.when(
    Predicate.some([
      String.includes("restaurant"),
      String.includes("market"),
      String.includes("grocery"),
    ]),
    () => "food",
  ),
  Match.when(String.includes("payroll"), () => "salary"),
  Match.when(String.includes("rent"), () => "rent"),
  Match.option,
);
