"use client";

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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { INVALID_PASSWORD } from "@/convex/errors";
import { type TupFormSchema, upFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Spinner } from "../spinner";
const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];
export default function SignUpForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<TupFormSchema>({
    resolver: zodResolver(upFormSchema),
    defaultValues: {
      userName: "",
      email: "",
      role: "",
      password: "",
    },
  });
  const computeStrength = useCallback((password: string) => {
    let strength = 0;

    // Length-based scoring
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (password.length >= 16) strength += 20;

    // Character variety
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15; // any symbol

    return Math.min(strength, 100);
  }, []);

  const getStrengthColor = (strength: number) => {
    if (strength >= 85) return "bg-green-500";
    if (strength >= 60) return "bg-yellow-500";
    if (strength > 0) return "bg-red-500";
    return "bg-gray-300";
  };

  const handleSubmit = async (values: TupFormSchema) => {
    setIsLoading("credentials");
    try {
      // Replace with your sign-up logic
      await signIn("password-custom", {
        flow,
        userName: values.userName,
        email: values.email,
        role: values.role,
        password: values.password,
        redirectTo: "/",
      });
      form.reset();
      toast.success("Account created successful!");
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
        `${provider} sign-up failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Create a New Account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to continue.
        </p>
      </header>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-busy={!!isLoading}
          className="grid gap-3"
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Username"
                    disabled={!!isLoading}
                    className="rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-none">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none">
                    {roles.map((role) => (
                      <SelectItem
                        value={role.value}
                        className="rounded-none"
                        key={role.value}
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <FormLabel className="flex justify-between gap-1">
                      Password
                    </FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="text-muted-foreground h-4 w-4 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">
                          Must be at least 6 characters, with uppercase,
                          lowercase, number, and special character.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <span className="text-muted-foreground text-xs">
                    {passwordStrength >= 85
                      ? "Strong"
                      : passwordStrength >= 60
                      ? "Medium"
                      : passwordStrength > 0
                      ? "Weak"
                      : ""}
                  </span>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="Password"
                    autoComplete="new-password"
                    className="rounded-none"
                    disabled={isLoading === "credentials"}
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;
                      field.onChange(e);
                      setPasswordStrength(val ? computeStrength(val) : 0);
                    }}
                  />
                </FormControl>
                <Progress
                  value={passwordStrength}
                  className={`mt-2 h-1 ${getStrengthColor(passwordStrength)}`}
                />

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
              <Spinner text="Signing up..." />
            ) : (
              "Sign Up"
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
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          aria-label="Sign in with Google"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading === "google"}
          className="flex-1 rounded-none"
        >
          <FcGoogle className="text-lg" />
          <span className="ml-2">Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-label="Sign in with GitHub"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isLoading === "github"}
          className="flex-1 rounded-none"
        >
          <FaGithub className="text-lg" />
          <span className="ml-2">GitHub</span>
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className={cn(
            "transition-all duration-300 hover:underline hover:underline-offset-4",
            isLoading && "pointer-events-none cursor-not-allowed opacity-50"
          )}
          aria-disabled={!!isLoading}
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
