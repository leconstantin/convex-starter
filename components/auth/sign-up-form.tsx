"use client";

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
import { Spinner } from "../spinner";

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const DIGIT_REGEX = /\d/;
const SYMBOL_REGEX = /[^A-Za-z0-9]/;

export default function SignUpForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [flow] = useState<"signIn" | "signUp">("signUp");

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
    if (password.length >= 8) {
      strength += 20;
    }
    if (password.length >= 12) {
      strength += 20;
    }
    if (password.length >= 16) {
      strength += 20;
    }

    // Character variety
    if (UPPERCASE_REGEX.test(password)) {
      strength += 15;
    }
    if (LOWERCASE_REGEX.test(password)) {
      strength += 15;
    }
    if (DIGIT_REGEX.test(password)) {
      strength += 15;
    }
    if (SYMBOL_REGEX.test(password)) {
      strength += 15; // any symbol
    }

    return Math.min(strength, 100);
  }, []);

  const getStrengthColor = (strength: number) => {
    if (strength >= 85) {
      return "bg-green-500";
    }
    if (strength >= 60) {
      return "bg-yellow-500";
    }
    if (strength > 0) {
      return "bg-red-500";
    }
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
        toastTitle = "Could not sign up, did you mean to sign in?";
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
        <h1 className="font-bold text-2xl">Create a New Account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to continue.
        </p>
      </header>

      {/* Form */}
      <Form {...form}>
        <form
          aria-busy={!!isLoading}
          className="grid gap-3"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-none"
                    disabled={!!isLoading}
                    placeholder="Username"
                    type="text"
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
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-none">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none">
                    {roles.map((role) => (
                      <SelectItem
                        className="rounded-none"
                        key={role.value}
                        value={role.value}
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
                        <InfoIcon className="h-4 w-4 cursor-pointer text-muted-foreground" />
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
                    {(() => {
                      if (passwordStrength >= 85) {
                        return "Strong";
                      }
                      if (passwordStrength >= 60) {
                        return "Medium";
                      }
                      if (passwordStrength > 0) {
                        return "Weak";
                      }
                      return "";
                    })()}
                  </span>
                </div>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    className="rounded-none"
                    disabled={isLoading === "credentials"}
                    placeholder="Password"
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;
                      field.onChange(e);
                      setPasswordStrength(val ? computeStrength(val) : 0);
                    }}
                  />
                </FormControl>
                <Progress
                  className={`mt-2 h-1 ${getStrengthColor(passwordStrength)}`}
                  value={passwordStrength}
                />

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
              <Spinner text="Signing up..." />
            ) : (
              "Sign Up"
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
        Already have an account?{" "}
        <Link
          aria-disabled={!!isLoading}
          className={cn(
            "transition-all duration-300 hover:underline hover:underline-offset-4",
            isLoading && "pointer-events-none cursor-not-allowed opacity-50"
          )}
          href="/sign-in"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
