import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { UserNav } from "@/features/tasks/components/user-nav";

export default async function SiteHeader() {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Link className="flex items-center gap-2" href="/">
          <ListTodoIcon />
          <h2 className="font-bold font-mono text-xl italic tracking-tighter">
            Don&apos;t Forget
          </h2>
        </Link>
        <div className="flex items-center">
          {(await isAuthenticatedNextjs()) && <UserNav />}
        </div>
      </div>
    </div>
  );
}
