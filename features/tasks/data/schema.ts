import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const tableTasksSchema = z.object({
  _id: z.string(),
  task_id: z.number(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  dueDate: z.number(),
});

export type TableTasksTypes = z.infer<typeof tableTasksSchema>;
