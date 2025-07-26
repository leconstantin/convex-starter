import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
// import type { DataModel } from "./_generated/dataModel";
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub,
    Google,
    Password,
    // Password<DataModel>({
    //   id: "password-custom",
    //   profile(params, _ctx) {
    //     return {
    //       email: params.email as string,
    //       userName: params.userName as string,
    //       role: params.role as string,
    //     };
    //   },
    // }),
  ],
});
