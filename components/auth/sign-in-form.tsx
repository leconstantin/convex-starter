"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { INVALID_PASSWORD } from "@/convex/errors";
import { inFormSchema, type TinFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
export default function SignInForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [flow] = useState<"signIn" | "signUp">("signIn");

  const form = useForm<TinFormSchema>({
    resolver: zodResolver(inFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: TinFormSchema) => {
    setIsLoading("credentials");
    try {
      // Replace with your sign-in logic
      await signIn("password", {
        flow,
        email: values.email,
        password: values.password,
        redirectTo: "/",
      });
      form.reset();
      toast.success("Sign-in successful!");
      router.push("/");
    } catch (error) {
      let toastTitle: string;
      if (error instanceof ConvexError && error.data === INVALID_PASSWORD) {
        toastTitle = "Invalid password - check the requirements and try again.";
      } else {
        toastTitle = "Could not sign in, did you mean to sign up?";
      }
      toast.error(toastTitle);
    } finally {
      setIsLoading(null);
    }
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading(provider);
    try {
      await signIn(provider, { redirectTo: "/" });
    } catch (error) {
      toast.error(
        `${provider} sign-in failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">Sign In to Your Account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to continue.
        </p>
      </header>

      {/* Form */}
      <Form {...form}>
        <form
          aria-busy={!!isLoading}
          className="grid gap-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-none"
                    disabled={!!isLoading}
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel className="flex items-center justify-between">
                  Password
                  <Link
                    className="text-muted-foreground text-sm underline underline-offset-4"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    className="rounded-none"
                    disabled={!!isLoading}
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            className="w-full cursor-pointer rounded-none"
            disabled={!!isLoading}
            type="submit"
          >
            {isLoading === "credentials" ? (
              <Spinner text="Signing in..." />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      {/* OAuth Buttons */}
      <div className="flex items-center justify-between gap-2">
        <Button
          aria-label="Sign in with Google"
          className="flex-1 rounded-none"
          disabled={isLoading === "google"}
          onClick={() => handleOAuthSignIn("google")}
          type="button"
          variant="outline"
        >
          <FcGoogle className="text-lg" />
          <span className="ml-2">Google</span>
        </Button>
        <Button
          aria-label="Sign in with GitHub"
          className="flex-1 rounded-none"
          disabled={isLoading === "github"}
          onClick={() => handleOAuthSignIn("github")}
          type="button"
          variant="outline"
        >
          <FaGithub className="text-lg" />
          <span className="ml-2">GitHub</span>
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          aria-disabled={!!isLoading}
          className={cn(
            "transition-all duration-300 hover:underline hover:underline-offset-4",
            isLoading && "pointer-events-none cursor-not-allowed opacity-50"
          )}
          href="/sign-up"
        >
          Sign up
        </Link>
      </p>
    </section>
  );
}
