import { Events, nanoid, State } from "@livestore/livestore";
import { Schema } from "effect";

export const defaultCategories = [
  { id: "food", name: "Food", emoji: "🍔", color: "#d97706" },
  { id: "coffee", name: "Coffee", emoji: "☕", color: "#92400e" },
  { id: "salary", name: "Salary", emoji: "💼", color: "#15803d" },
  { id: "rent", name: "Rent", emoji: "🏠", color: "#1d4ed8" },
  { id: "travel", name: "Travel", emoji: "✈️", color: "#0891b2" },
  { id: "software", name: "Software", emoji: "🧩", color: "#7c3aed" },
  { id: "health", name: "Health", emoji: "🩺", color: "#dc2626" },
] as const

const schema = Schema.Struct({
  id: Schema.String.pipe(State.SQLite.withPrimaryKey),
  name: Schema.String,
  emoji: Schema.String.pipe(State.SQLite.withDefault("🗄️")),
  color: Schema.String.pipe(State.SQLite.withDefault("#737373")),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}).annotations({ title: 'categories' })


const table = State.SQLite.table({ schema })

const events = {
  created: Events.synced({
    name: "v1.category.created",
    schema: Schema.Struct({
      name: Schema.String,
      emoji: Schema.String,
      color: Schema.String,
      createdAt: Schema.Date,
      updatedAt: Schema.Date,
    }),
  }),
  updated: Events.synced({
    name: "v1.category.updated",
    schema: Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      emoji: Schema.String,
      color: Schema.String,
      updatedAt: Schema.Date,
    }),
  }),
} as const

const materializers = State.SQLite.materializers(events, {
  "v1.category.created": (category) =>
    table.insert({ id: nanoid(), ...category }),
  "v1.category.updated": ({ id, ...category }) =>
    table.update(category).where({ id }),
})

export const category = { schema, table, events, materializers }
