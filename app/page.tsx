import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { z } from 'zod';
import { ModeSwitcher } from '@/components/ui/mode-switcher';
import { PageContainer } from '@/components/ui/page-container';
import { columns } from '@/features/tasks/components/columns';
import { DataTable } from '@/features/tasks/components/data-table';
import { UserNav } from '@/features/tasks/components/user-nav';
import { taskSchema } from '@/features/tasks/data/schema';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
};

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'features/tasks/data/tasks.json')
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function TaskPage() {
  const tasks = await getTasks();

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
        <DataTable columns={columns} data={tasks} />
      </div>
    </PageContainer>
  );
}
