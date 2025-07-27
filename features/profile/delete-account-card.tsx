'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { deleteUserFormSchema, type TDeleteUserFormValues } from '@/lib/schema';

// Schema

export default function DeleteUserCard() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const deleteUser = useMutation(api.users.deleteCurrentUserAccount);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TDeleteUserFormValues>({
    resolver: zodResolver(deleteUserFormSchema),
    defaultValues: { title: '' },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await deleteUser();
      form.reset();
      setIsOpen(false);
      await signOut(); // clears session
      toast.success('Your account has been deleted.');
      router.push('/');
    } catch {
      toast.error('Failed to delete account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-start rounded-sm border border-destructive">
        <div className="flex flex-col gap-2 p-6">
          <h2 className="font-medium text-primary text-xl">Delete Account</h2>
          <p className="font-normal text-primary/60 text-sm">
            Permanently remove your Personal Account and all of its contents
            from the Vercel platform. This action is not reversible, so please
            continue with caution.
          </p>
        </div>
        <div className="flex w-full items-center justify-end rounded-lg rounded-t-none border-border border-t bg-red-400/10 px-6 py-3 dark:bg-red-600/10">
          <Button onClick={() => setIsOpen(true)} variant="destructive">
            Delete Personal Account
          </Button>
        </div>
      </div>

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="w-full max-w-md rounded-sm p-6">
          <DialogHeader className="flex flex-col gap-5">
            <DialogTitle className="font-extrabold text-xl tracking-tighter lg:text-3xl">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your account. To confirm, please type{' '}
              <strong>delete my account</strong> below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              className="mt-6 flex flex-col gap-6 lg:gap-10"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm tracking-tight">
                      Type <strong>delete my account</strong> to confirm:
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-sm"
                        placeholder="delete my account"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center justify-between gap-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>

                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <Spinner text="Deleting..." />
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <DialogClose />
        </DialogContent>
      </Dialog>
    </>
  );
}
