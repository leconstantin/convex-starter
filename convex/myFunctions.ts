import { v } from 'convex/values';
import { mutation } from './_generated/server';

// to create new task
export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('tasks', {
      text: args.text,
      isCompleted: false,
    });
  },
});

// to update task
export const update = mutation({
  args: {
    id: v.id('tasks'),
    text: v.string(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.replace(args.id, {
      text: args.text,
      isCompleted: args.isCompleted,
    });
  },
});

// to delete task
export const remove = mutation({
  args: {
    id: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
