/** biome-ignore-all lint/nursery/noAwaitInLoop: <explanation> */
import { authTables, getAuthUserId } from "@convex-dev/auth/server";
import {
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server";

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
export const currentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx); // or getAuthUserId(ctx)

    // Get user's identity (from Convex Auth)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const tokenIdentifier = identity.tokenIdentifier;

    // Delete all todos linked to this user
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const todoDeletePromises = todos.map((todo) => ctx.db.delete(todo._id));
    await Promise.all(todoDeletePromises);

    // Delete from your custom users table
    const userDoc = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .unique();

    if (userDoc) {
      await ctx.db.delete(userDoc._id);
    }

    // Delete from all Convex Auth internal tables
    for (const table of Object.keys(authTables)) {
      const docs = await ctx.db
        .query(table as any)
        .filter((q) => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
        .collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    return { success: true };
  },
});

// export const deleteUser = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const userId = await requireUser(ctx);
//     const userDoc = await ctx.db
//       .query("users")
//       .withIndex("by_id", (q) => q.eq("_id", userId))
//       .unique();
//     const todos = await ctx.db
//       .query("todos")
//       .withIndex("by_userId", (q) => q.eq("userId", userId))
//       .collect();
//     if (todos) {
//       for (const todo of todos) {
//         await ctx.db.delete(todo._id);
//       }
//     }

//     // Delete the user
//     if (userDoc) {
//       await ctx.db.delete(userDoc._id);
//     }
//     // Optionally delete other tables
//     return { success: true };
//   },
// });
