"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Spinner } from "../spinner";
import { cn } from "@/lib/utils";
import { type TupFormSchema, upFormSchema } from "@/lib/schema";
import { INVALID_PASSWORD } from "@/convex/errors";
import { ConvexError } from "convex/values";
export default function SignInForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");

  const form = useForm<TupFormSchema>({
    resolver: zodResolver(upFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: TupFormSchema) => {
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
        toastTitle =
          flow === "signIn"
            ? "Could not sign in, did you mean to sign up?"
            : "Could not sign up, did you mean to sign in?";
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
        <h1 className="text-2xl font-bold">Sign In to Your Account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to continue.
        </p>
      </header>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-busy={!!isLoading}
          className="grid gap-6"
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
                    type="email"
                    placeholder="you@example.com"
                    disabled={!!isLoading}
                    className="rounded-none"
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
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline underline-offset-4"
                  >
                    Forgot Password?
                  </Link>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Password"
                    disabled={!!isLoading}
                    className="rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!!isLoading}
            className="w-full cursor-pointer rounded-none"
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
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          aria-label="Sign in with Google"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading === "google"}
          className="w-full rounded-none"
        >
          <FcGoogle className="text-lg" />
          <span className="ml-2">Sign in with Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-label="Sign in with GitHub"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isLoading === "github"}
          className="w-full rounded-none"
        >
          <FaGithub className="text-lg" />
          <span className="ml-2">Sign in with GitHub</span>
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className={cn(
            "transition-all duration-300 hover:underline hover:underline-offset-4",
            isLoading && "pointer-events-none cursor-not-allowed opacity-50"
          )}
          aria-disabled={!!isLoading}
        >
          Sign up
        </Link>
      </p>
    </section>
  );
}
