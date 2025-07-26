'use client';

import type { Row } from '@tanstack/react-table';
import { useMutation } from 'convex/react';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { labels, priorities, statuses } from '@/lib/data';
import { tableTodoSchema } from '@/lib/schema';
import { TodoForm } from '../todo-form';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = tableTodoSchema.parse(row.original);
  const deleteTodo = useMutation(api.todos.remove);
  const updateLabel = useMutation(api.todos.updateLabel);
  const updateStatus = useMutation(api.todos.updateStatus);
  const updatePriority = useMutation(api.todos.updatePriority);

  const [edit, setEdit] = React.useState(false);
  const handleDelete = async (id: Id<'todos'>) => {
    try {
      await deleteTodo({ id });
      toast.success('Todo deleted!');
    } catch {
      toast.error('Failed to delete todo');
    }
  };
  const handleUpdateLabel = async (id: Id<'todos'>, label: string) => {
    try {
      await updateLabel({ id, label });
      toast.success('Todo updated!');
    } catch {
      toast.error('Failed to update todo');
    }
  };
  const handleUpdateStatus = async (id: Id<'todos'>, status: string) => {
    try {
      await updateStatus({ id, status });
      toast.success('Todo updated!');
    } catch {
      toast.error('Failed to update todo');
    }
  };
  const handleUpdatePriority = async (id: Id<'todos'>, priority: string) => {
    try {
      await updatePriority({ id, priority });
      toast.success('Todo updated!');
    } catch {
      toast.error('Failed to update todo');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            variant="ghost"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setEdit(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                onValueChange={(value) =>
                  handleUpdateLabel(task._id as Id<'todos'>, value)
                }
                value={task.label}
              >
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                onValueChange={(value) =>
                  handleUpdateStatus(task._id as Id<'todos'>, value)
                }
                value={task.status}
              >
                {statuses.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                onValueChange={(value) =>
                  handleUpdatePriority(task._id as Id<'todos'>, value)
                }
                value={task.priority}
              >
                {priorities.map((priority) => (
                  <DropdownMenuRadioItem
                    key={priority.value}
                    value={priority.value}
                  >
                    {priority.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleDelete(task._id as Id<'todos'>)}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TodoForm editing onOpenChange={setEdit} open={edit} todo={task} />
    </>
  );
}
