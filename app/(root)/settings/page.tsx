'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { UploadFileResponse } from '@xixixao/uploadstuff/react';
import { useMutation, useQuery } from 'convex/react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadInput } from '@/components/upload-input';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import DeleteUserCard from '@/features/profile/delete-account-card';
import { type TUsernameFormValues, usernameFormSchema } from '@/lib/schema';

export default function DashboardSettings() {
  const user = useQuery(api.users.getUser);
  const updateUserImage = useMutation(api.users.updateUserImage);
  const updateUsername = useMutation(api.users.updateUsername);
  const removeUserImage = useMutation(api.users.removeUserImage);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const form = useForm<TUsernameFormValues>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: { username: user?.name || '' },
  });

  const handleUpdateUserImage = (uploaded: UploadFileResponse[]) => {
    return updateUserImage({
      imageId: (uploaded[0]?.response as { storageId: Id<'_storage'> })
        .storageId,
    });
  };
  // Reset form when user data is available
  React.useEffect(() => {
    if (user?.name) {
      form.reset({ username: user.name });
    }
  }, [user?.name, form]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Avatar */}
      <div className="flex w-full flex-col items-start rounded-sm border border-border ">
        <div className="flex w-full items-start justify-between rounded-lg p-6">
          <div className="flex flex-col gap-3">
            <h2 className="font-medium text-primary text-xl">Avatar</h2>
            <div className="flex flex-col gap-1">
              <p className="font-normal text-sm">This is your avatar.</p>
              <p className="font-normal text-sm">
                Click on the avatar to upload a custom one from your files.
              </p>
            </div>
          </div>
          <label
            className="group relative flex cursor-pointer overflow-hidden rounded-full transition active:scale-95"
            htmlFor="avatar_field"
          >
            {user.avatarUrl ? (
              <Image
                alt={user.userName ?? user.email ?? ''}
                className="h-20 w-20 rounded-full object-cover"
                height={80}
                src={user.avatarUrl}
                width={80}
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-10% from-lime-400 via-cyan-300 to-blue-500" />
            )}
            <div className="absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex">
              <Upload className="h-6 w-6 text-secondary" />
            </div>
          </label>
          <UploadInput
            accept="image/*"
            className="peer sr-only"
            generateUploadUrl={generateUploadUrl}
            id="avatar_field"
            onUploadComplete={handleUpdateUserImage}
            required
            tabIndex={user ? -1 : 0}
            type="file"
          />
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-border border-t bg-secondary px-6 dark:bg-background">
          <p className="font-normal text-primary/60 text-sm">
            An avatar is optional but strongly recommended.
          </p>
          {user.avatarUrl && (
            <Button
              onClick={() => {
                removeUserImage({});
              }}
              size="sm"
              type="button"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Username */}
      <Form {...form}>
        <form
          className="flex w-full flex-col items-start rounded-sm border border-border "
          onSubmit={form.handleSubmit((values) => {
            updateUsername({ username: values.username });
          })}
        >
          <div className="flex flex-col gap-4 rounded-lg p-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-primary text-xl">Display Name</h2>
              <p className="font-normal text-primary/60 text-sm">
                This is your username. It will be displayed on your profile.
              </p>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Username</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-border border-t bg-secondary px-6 dark:bg-card">
            <p className="font-normal text-primary/60 text-sm">
              Please use 32 characters at maximum.
            </p>
            <Button size="sm" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>

      {/* Delete Account */}
      <DeleteUserCard />
    </div>
  );
}
