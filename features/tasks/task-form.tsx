'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircleIcon, PlusCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { labels, priorities, statuses } from './data/data';
import { TodosFormSchema } from './schema';
import type { TodosFormValuesType } from './types';

export function TaskForm() {
  // open and set
  const [open, setOpen] = React.useState(false);
  // isLoading
  const [isLoading, setIsLoading] = React.useState(false);
  const createTodo = useMutation(api.todos.create);
  const form = useForm<TodosFormValuesType>({
    resolver: zodResolver(TodosFormSchema),
    defaultValues: {
      title: '',
      status: '',
      label: '',
      priority: '',
      dueDate: undefined,
    },
  });
  async function onSubmit(data: TodosFormValuesType) {
    setIsLoading(true);
    try {
      await createTodo({
        title: data.title,
        status: data.status,
        label: data.label,
        priority: data.priority,
        dueDate: data.dueDate.getTime(),
      });

      toast.success('Todo created successfully!');
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create todo');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Add a new task to your list.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Task title"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the title of your task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center gap-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              className="w-full"
                              placeholder="Select a status"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <status.icon className="mr-2 size-4 text-muted-foreground" />
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the status of your task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Label</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              className="w-full"
                              placeholder="Select a label"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          {labels.map((label) => (
                            <SelectItem key={label.value} value={label.value}>
                              {label.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the label of your task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              <priority.icon className="mr-2 size-4 text-muted-foreground" />
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the priority of your task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel> Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              variant={'outline'}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            captionLayout="dropdown"
                            disabled={(selectedDate) =>
                              selectedDate < new Date() ||
                              selectedDate < new Date('1900-01-01')
                            }
                            mode="single"
                            onSelect={field.onChange}
                            selected={field.value}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        This is the due date of your task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={isLoading} type="submit">
                  {' '}
                  {isLoading ? (
                    <>
                      <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
                      Adding Task...
                    </>
                  ) : (
                    'Add Task'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
