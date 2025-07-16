"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const  addNewTask = useMutation(api.myFunctions.create);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    addNewTask({ text });
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* to create new task */}
      <form
         onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4"
      >
        <input
          type="text"
          name="text"
          className="border border-gray-300 rounded-md p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2"
        >
          Add
        </button>
      </form>
      <h1 className="text-4xl font-bold">Tasks</h1>
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
    </main>
  );
}