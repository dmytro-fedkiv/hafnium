import { DenominationSchema } from "@/database/schema/denominations";
import { Data, Effect, Schema } from "effect";
import { createFrankfurterClient, FrankfurterError } from "frankfurter-js";

export const ExchangeRateSchema = Schema.Positive.pipe(Schema.brand("ExchangeRate"));

export type DenominationCode = typeof DenominationSchema.fields.code.Type;

/**
 * Schema for converting between Date and a string in "YYYY-MM-DD" format,
 * which is commonly used for frankfurter exchange rate APIs
 */
export const CalendarDateFromDateSchema = Schema.transform(
  Schema.DateFromSelf,
  Schema.NonEmptyTrimmedString.pipe(
    Schema.pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
    Schema.brand("CalendarDate"),
  ).annotations({ format: "YYYY-MM-DD" }),
  {
    strict: true,
    decode: (date) => date.toISOString().slice(0, 10),
    encode: (value) => new Date(value),
  },
).annotations({ identifier: "CalendarDateFromDateSchema" });

export class ExchangeRateFetchError extends Data.TaggedError("ExchangeRateFetchError")<{
  message: string;
}> {}

const frankfurterClient = createFrankfurterClient();

export const exchange = Effect.fn("exchange")(function* (
  base: DenominationCode,
  quote: DenominationCode,
  date: Date = new Date(),
) {
  const calendarDate = yield* Schema.decode(CalendarDateFromDateSchema)(date);

  const [exchangeRate] = yield* Effect.tryPromise({
    try: (signal) =>
      frankfurterClient.historical(calendarDate, { base, quotes: [quote] }, { signal }),
    catch: (error) =>
      new ExchangeRateFetchError({
        message:
          error instanceof FrankfurterError
            ? error.message
            : "Unknown error occurred while fetching exchange rate",
      }),
  });

  if (!exchangeRate) {
    throw new ExchangeRateFetchError({
      message: `No exchange rate found for ${base} to ${quote} on ${calendarDate}`,
    });
  }

  return ExchangeRateSchema.make(exchangeRate.rate);
});
