'use client';

import { CircleUserRoundIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';

export default function Component() {
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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
          className="relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-input border-dashed outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-[img]:border-none has-disabled:opacity-50 data-[dragging=true]:bg-accent/50"
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          type="button"
        >
          {previewUrl ? (
            <Image
              alt={files[0]?.file?.name || 'Uploaded image'}
              className="size-full object-cover"
              height={64}
              src={previewUrl}
              style={{ objectFit: 'cover' }}
              width={64}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </button>
        {previewUrl && (
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
      <p aria-live="polite" className="mt-2 text-muted-foreground text-xs">
        Avatar uploader with droppable area ∙{' '}
        <a
          className="underline hover:text-foreground"
          href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
        >
          API
        </a>
      </p>
    </div>
  );
}
