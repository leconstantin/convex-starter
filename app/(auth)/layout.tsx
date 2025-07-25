export const dynamic = "force-dynamic";

import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import cImg from "@/public/auth-cover.jpg";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link className="flex items-center gap-2 font-medium" href="/">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Todo App
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:grayscale"
          placeholder="blur"
          src={cImg}
        />
      </div>
    </div>
  );
}
