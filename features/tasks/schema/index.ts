import { z } from "zod";

export const TodosFormSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  dueDate: z.date({
    message: "A due date is required.",
  }),
});
