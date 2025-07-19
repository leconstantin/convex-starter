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
    // i want to add my own id which increment by 1 each time task is created get my id called task_id 1 another 2 ,3 ..
    const task_id = await ctx.db.query("todos").order("desc").take(1);
    const id = task_id.length > 0 ? task_id[0].task_id + 1 : 1;

    return await ctx.db.insert("todos", {
      task_id: id,
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
// update label
export const updateLabel = mutation({
  args: {
    id: v.id("todos"),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, label } = args;
    const todo = await ctx.db.get(id);

    if (!todo) {
      throw new Error("Todo not found or not authorized");
    }

    return await ctx.db.patch(id, { label });
  },
});
// update status
export const updateStatus = mutation({
  args: {
    id: v.id("todos"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, status } = args;
    const todo = await ctx.db.get(id);

    if (!todo) {
      throw new Error("Todo not found or not authorized");
    }

    return await ctx.db.patch(id, { status });
  },
});
// update priority
export const updatePriority = mutation({
  args: {
    id: v.id("todos"),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, priority } = args;
    const todo = await ctx.db.get(id);

    if (!todo) {
      throw new Error("Todo not found or not authorized");
    }

    return await ctx.db.patch(id, { priority });
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
