import { v } from "convex/values";
// Helper: Ensure the todo belongs to the user
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

async function assertTodoOwner({
  ctx,
  id,
  userId,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<"todos">;
  userId: string;
}) {
  const todo = await ctx.db.get(id);
  if (!todo) {
    throw new Error("Todo not found");
  }
  if (todo.userId !== userId) {
    throw new Error("Unauthorized - this todo belongs to another user");
  }
  return todo;
}

export const create = mutation({
  args: {
    title: v.string(),
    status: v.string(),
    label: v.string(),
    priority: v.string(),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const task_id = await ctx.db.query("todos").order("desc").take(1);
    const id = task_id.length > 0 ? task_id[0].task_id + 1 : 1;

    return await ctx.db.insert("todos", {
      task_id: id,
      ...args,
      userId,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
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
    const userId = await requireUser(ctx);
    const { id, ...updates } = args;

    // Verify the todo belongs to the user before updating
    await assertTodoOwner({ ctx, id, userId });

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
    const userId = await requireUser(ctx);
    await assertTodoOwner({ ctx, id, userId });

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
    const userId = await requireUser(ctx);
    await assertTodoOwner({ ctx, id, userId });

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
    const userId = await requireUser(ctx);
    await assertTodoOwner({ ctx, id, userId });

    return await ctx.db.patch(id, { priority });
  },
});
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    await assertTodoOwner({ ctx, id: args.id, userId });

    return await ctx.db.delete(args.id);
  },
});
