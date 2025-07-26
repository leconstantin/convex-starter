"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import {
  type TUserOnboardingFormValues,
  userOnboardingSchema,
} from "@/lib/schema";

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];
export default function UserOnboardingForm() {
  const router = useRouter();
  const updateUser = useMutation(api.users.updateUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TUserOnboardingFormValues>({
    resolver: zodResolver(userOnboardingSchema),
    defaultValues: { userName: "", role: "" },
  });

  const handleSubmit = async (values: TUserOnboardingFormValues) => {
    setIsSubmitting(true);
    try {
      await updateUser(values);
      form.reset();
      toast.success("User updated successfully!");
      router.push("/");
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-3"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Username</FormLabel>
              <FormControl>
                <Input
                  className="w-full rounded-sm dark:bg-background"
                  placeholder="Username"
                  {...field}
                  disabled={isSubmitting}
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
              <FormLabel className="sr-only">Role</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full dark:bg-background">
                    <SelectValue
                      className="w-full dark:bg-background"
                      placeholder="Select a role"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Continue"}
        </Button>
      </form>
      <p className="px-6 text-center font-normal text-primary/60 text-sm leading-normal">
        You can update your username at any time from your account settings.
      </p>
    </Form>
  );
}
