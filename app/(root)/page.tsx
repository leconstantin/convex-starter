import type { Metadata } from 'next';
import { AuthenticatedTodos } from '@/features/tasks/components/authenticated-todos';
import { TodoForm } from '@/features/tasks/components/todo-form';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
};

export default function TodosPage() {
  return (
    <section className="flex h-full flex-1 flex-col gap-10 md:gap-8">
      <TodoForm />
      <AuthenticatedTodos />
    </section>
  );
}
