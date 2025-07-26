'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { labels, priorities, statuses } from '@/lib/data';
import type { TableTodoTypes } from '@/lib/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<TableTodoTypes>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        className="translate-y-[2px]"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        className="translate-y-[2px]"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'task_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">TASK-{row.getValue('task_id')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = labels.find(
        (labelValue) => labelValue.value === row.original.label
      );

      return (
        <div className="flex space-x-2">
          {label && (
            <Badge className="bg-blue-500 text-white dark:bg-blue-600">
              {label.label}
            </Badge>
          )}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  // based on due date add like in next two days just when am going to do task
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as number;
      const dateObj = new Date(dueDate);

      // const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
      const relativeTime = Number.isNaN(dateObj.getTime())
        ? 'Invalid date'
        : formatDistanceToNow(dateObj, { addSuffix: true });

      return <div className="flex space-x-2">{relativeTime}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (statusValue) => statusValue.value === row.getValue('status')
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priorityValue) => priorityValue.value === row.getValue('priority')
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
