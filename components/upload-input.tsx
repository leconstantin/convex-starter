/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
'use client';

import {
  type UploadFileResponse,
  useUploadFiles,
} from '@xixixao/uploadstuff/react';
import { type InputHTMLAttributes, useRef } from 'react';

export function UploadInput({
  generateUploadUrl,
  onUploadComplete,
  ...props
}: {
  generateUploadUrl: () => Promise<string>;
  onUploadComplete: (uploaded: UploadFileResponse[]) => void;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'accept' | 'id' | 'type' | 'className' | 'required' | 'tabIndex'
>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadFiles(generateUploadUrl, {
    onUploadComplete: async (uploaded) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadComplete(uploaded);
    },
  });
  return (
    <input
      onChange={async (event) => {
        if (!event.target.files) {
          return;
        }
        const files = Array.from(event.target.files);
        if (files.length === 0) {
          return;
        }
        startUpload(files);
      }}
      ref={fileInputRef}
      type="file"
      {...props}
    />
  );
}
