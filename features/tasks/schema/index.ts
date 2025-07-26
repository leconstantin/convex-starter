import { zid } from "convex-helpers/server/zod";
import { z } from "zod";

export const TodosFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .refine((val) => val.trim().length >= 3, {
      message: "Title must include at least 3 non-space characters.",
    }),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  dueDate: z.date({
    message: "A due date is required.",
  }),
});
export type TodosFormTypes = z.infer<typeof TodosFormSchema>;

export const UpdateTodoSchema = z.object({
  _id: zid("todos"),
  title: z.string().min(3, {
    message: "Username must be at least 2 characters.",
  }),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  dueDate: z.number(),
});

export const RemoveTodoSchema = z.object({
  id: zid("todos"),
});
export const UpadteTodosLabelSchema = z.object({
  id: zid("todos"),
  label: z.string(),
});
export const UpadteTodosStatusSchema = z.object({
  id: zid("todos"),
  status: z.string(),
});
export const UpadteTodosPrioritySchema = z.object({
  id: zid("todos"),
  priority: z.string(),
});
