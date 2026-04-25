import { createFileRoute } from "@tanstack/react-router";
import { BudgetsPage } from "../budgets";

export const Route = createFileRoute("/budgets")({
  component: BudgetsPage,
});
