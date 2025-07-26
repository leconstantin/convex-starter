import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { internal } from "./_generated/api";
import {
  internalMutation,
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

export const deleteCurrentUserAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx); // or getAuthUserId(ctx)

    // Get user's identity (from Convex Auth)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Delete all todos linked to this user
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const todoDeletePromises = todos.map((todo) => ctx.db.delete(todo._id));
    await Promise.all(todoDeletePromises);

    await ctx.runMutation(internal.users.deleteUserAccount, {
      userId,
    });

    return { success: true };
  },
});
export const deleteUserAccount = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await asyncMap(
      [
        "google",
        "github",
        "password",
        // "password-custom" /* add other providers as needed */,
      ],
      async (provider) => {
        const authAccount = await ctx.db
          .query("authAccounts")
          .withIndex("userIdAndProvider", (q) =>
            q.eq("userId", args.userId).eq("provider", provider)
          )
          .unique();
        if (!authAccount) {
          return;
        }
        await ctx.db.delete(authAccount._id);
      }
    );
    await ctx.db.delete(args.userId);
  },
});

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return;
    }

    return {
      ...user,
      name: user.userName || user.name,
      avatarUrl: user.imageId
        ? await ctx.storage.getUrl(user.imageId)
        : undefined,
    };
  },
});

export const updateUser = mutation({
  args: {
    userName: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    return await ctx.db.patch(userId, args);
  },
});
