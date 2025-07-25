import z from "zod";

export const upFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type TupFormSchema = z.infer<typeof upFormSchema>;
