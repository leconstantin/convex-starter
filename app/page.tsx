'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const addNewTask = useMutation(api.myFunctions.create);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('text') as string;
    addNewTask({ text });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* to create new task */}
      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          className="rounded-md border border-gray-300 p-2"
          name="text"
          type="text"
        />
        <button className="rounded-md bg-blue-500 p-2 text-white" type="submit">
          Add
        </button>
      </form>
      <h1 className="font-bold text-4xl">Tasks</h1>
      {tasks?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </main>
  );
}
