'use client';

import { useMutation, useQuery } from 'convex/react';
import { CircleUserRoundIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useFileUpload } from '@/hooks/use-file-upload';

export default function UserImage() {
  const router = useRouter();
  const user = useQuery(api.users.getUser);
  const updateUserImage = useMutation(api.users.updateUserImage);
  const removeUserImage = useMutation(api.users.removeUserImage);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);

  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: 'image/*',
  });

  const previewUrl = files[0]?.preview || null;
  const hasUserAvatar = user?.avatarUrl;
  let hasNewImage = !!previewUrl;

  async function handleSendImage() {
    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': files[0]?.file.type },
        body: files[0]?.file instanceof File ? files[0].file : undefined,
      });
      const { storageId } = await result.json();
      await updateUserImage({ imageId: storageId });
      toast.success('Image uploaded!');
    } catch {
      toast.error('Failed to upload image');
      removeFile(files[0]?.id);
      hasNewImage = false;
      // refresh the page
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  }

  async function handleResetImage() {
    await removeUserImage();
  }

  if (!user) {
    return null;
  }

  // Determine which image to show: new preview, existing avatar, or placeholder
  const imageToShow = previewUrl || user.avatarUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          aria-label={imageToShow ? 'Change image' : 'Upload image'}
          className="relative flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-input border-dashed outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-[img]:border-none has-disabled:opacity-50 data-[dragging=true]:bg-accent/50"
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          type="button"
        >
          {imageToShow ? (
            <Image
              alt={
                hasNewImage
                  ? files[0]?.file?.name || 'New image'
                  : 'User avatar'
              }
              className="size-full object-cover"
              height={64}
              src={imageToShow}
              style={{ objectFit: 'cover' }}
              width={64}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </button>

        {/* Remove button - only show for new preview images */}
        {hasNewImage && (
          <Button
            aria-label="Remove image"
            className="-top-1 -right-1 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input
          {...getInputProps()}
          aria-label="Upload image file"
          className="sr-only"
          tabIndex={-1}
        />
      </div>

      {/* Conditional button rendering */}
      {hasNewImage && (
        <Button disabled={isUploading} onClick={handleSendImage}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      )}
      {!hasNewImage && hasUserAvatar && (
        <Button onClick={handleResetImage} variant="outline">
          Reset
        </Button>
      )}
      {/* {!(hasNewImage || hasUserAvatar) && (
        <Button onClick={openFileDialog}>Choose Image</Button>
      )} */}
    </div>
  );
}
