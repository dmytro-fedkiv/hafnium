import { createFileRoute } from "@tanstack/react-router";
import { TransactionsPage } from "../transactions";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});
