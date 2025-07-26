import { authTables } from "@convex-dev/auth/server";
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
    userId: v.id("users"), // Store the user ID
  }).index("by_userId", ["userId"]),
};

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Custom field.
    userName: v.optional(v.string()),
    role: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  ...applicationTables,
});
