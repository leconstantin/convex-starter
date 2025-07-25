"use client";

import { Authenticated } from "convex/react";
import { TodosTable } from "@/features/tasks/todos-table";

export function AuthenticatedTodos() {
  return (
    <Authenticated>
      <TodosTable />
    </Authenticated>
  );
}
