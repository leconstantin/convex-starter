import z from "zod";

export const inFormSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
export type TinFormSchema = z.infer<typeof inFormSchema>;

export const upFormSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.email().min(1, "Email is required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(1, "Password is required"),
});
export type TupFormSchema = z.infer<typeof upFormSchema>;
