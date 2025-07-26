import z from "zod";

export const tableTodoSchema = z.object({
  _id: z.string(),
  task_id: z.number(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  dueDate: z.number(),
});

export type TableTodoTypes = z.infer<typeof tableTodoSchema>;

export const inFormSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
export type TinFormSchema = z.infer<typeof inFormSchema>;

export const upFormSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
export type TupFormSchema = z.infer<typeof upFormSchema>;

export const deleteUserFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Please type 'delete my account' to confirm." })
    .refine((val) => val.trim().toLowerCase() === "delete my account", {
      message: "You must type exactly: delete my account",
    }),
});
export type TDeleteUserFormValues = z.infer<typeof deleteUserFormSchema>;

// schema for username and role
export const userOnboardingSchema = z.object({
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  role: z.string().min(1, {
    message: "Role is required.",
  }),
});
export type TUserOnboardingFormValues = z.infer<typeof userOnboardingSchema>;
