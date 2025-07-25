'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DataTable } from '@/features/tasks/components/table/data-table';
import { columns } from './table/columns';

export function TodosTable() {
  const todos = useQuery(api.todos.list) || [];

  return <DataTable columns={columns} data={todos} />;
}
