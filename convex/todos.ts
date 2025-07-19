import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    status: v.string(),
    label: v.string(),
    priority: v.string(),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("todos", {
      ...args,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("desc").collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    label: v.optional(v.string()),
    priority: v.optional(v.string()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const todo = await ctx.db.get(id);

    if (!todo) {
      throw new Error("Todo not found or not authorized");
    }

    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);

    if (!todo) {
      throw new Error("Todo not found");
    }

    return await ctx.db.delete(args.id);
  },
});
