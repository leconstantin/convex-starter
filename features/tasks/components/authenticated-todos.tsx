'use client';

import { Authenticated } from 'convex/react';
import { TodosTable } from '@/features/tasks/components/todos-table';

export function AuthenticatedTodos() {
  return (
    <Authenticated>
      <TodosTable />
    </Authenticated>
  );
}
