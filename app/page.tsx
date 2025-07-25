import { PageContainer } from "@/components/ui/page-container";
import { AuthenticatedTodos } from "@/features/tasks/authenticated-todos";
import { UserNav } from "@/features/tasks/components/user-nav";
import { TaskForm } from "@/features/tasks/task-form";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.

export default async function TaskPage() {
  // i want to select
  return (
    <PageContainer className="py-8">
      <div className="flex h-full flex-1 flex-col gap-20 md:gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-2xl tracking-tight">
                Welcome back!
              </h2>
              <p className="hidden text-muted-foreground md:block">
                Here&apos;s a list of your tasks for this month!
              </p>
            </div>
            <div className="flex items-center">
              {(await isAuthenticatedNextjs()) && <UserNav />}
            </div>
          </div>
          <TaskForm />
        </div>
        <AuthenticatedTodos />
      </div>
    </PageContainer>
  );
}
