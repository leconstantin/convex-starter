import type z from "zod";
import type { TodosFormSchema } from "../schema";

export type TodosFormValuesType = z.infer<typeof TodosFormSchema>;
