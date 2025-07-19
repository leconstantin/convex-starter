import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  todos: defineTable({
    task_id: v.number(),
    title: v.string(),
    status: v.string(),
    label: v.string(),
    priority: v.string(),
    dueDate: v.number(), // Store as timestamp
  }),
};

export default defineSchema({
  ...applicationTables,
});
