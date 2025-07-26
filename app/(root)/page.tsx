import type { Metadata } from "next";
import { AuthenticatedTodos } from "@/features/tasks/authenticated-todos";
import { TaskForm } from "@/features/tasks/task-form";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.

export default function TaskPage() {
  // i want to select
  return (
    <section className="flex h-full flex-1 flex-col gap-20 md:gap-8">
      <TaskForm />
      <AuthenticatedTodos />
    </section>
  );
}
