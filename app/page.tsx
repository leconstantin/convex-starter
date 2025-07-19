import type { Metadata } from 'next';
import { ModeSwitcher } from '@/components/ui/mode-switcher';
import { PageContainer } from '@/components/ui/page-container';
import { UserNav } from '@/features/tasks/components/user-nav';
import { TaskForm } from '@/features/tasks/task-form';
import { TodosTable } from '@/features/tasks/todos-table';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
};

// Simulate a database read for tasks.

export default function TaskPage() {
  // i want to select
  return (
    <PageContainer className="py-8">
      <div className="flex h-full flex-1 flex-col gap-8">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <UserNav />
            <ModeSwitcher />
          </div>
        </div>
        <TaskForm />
        <TodosTable />
      </div>
    </PageContainer>
  );
}
