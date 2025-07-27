'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { type Preloaded, usePreloadedQuery } from 'convex/react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  CirclePlusIcon,
  LogOut,
  Settings,
  Slash,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SiTodoist } from 'react-icons/si';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './them-toggle';
import { Button, buttonVariants } from './ui/button';
export function Navigation({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.getUser>;
}) {
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardPath = pathname === '/';
  const isSettingsPath = pathname === '/settings';

  const user = usePreloadedQuery(preloadedUser);

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col border-border border-b bg-background px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
        <div className="flex h-10 items-center gap-2">
          <Link className="flex h-10 items-center gap-1" href="/">
            <SiTodoist className="size-8" />
          </Link>
          <Slash className="-rotate-12 h-6 w-6 stroke-[1.5px] text-primary/10" />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-2 px-2 data-[state=open]:bg-primary/5"
                variant="ghost"
              >
                <div className="flex items-center gap-2">
                  {user.avatarUrl ? (
                    <Image
                      alt={user.name ?? user.email ?? ''}
                      className="h-8 w-8 rounded-full object-cover"
                      height={32}
                      src={user.avatarUrl}
                      width={32}
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-gradient-to-br from-10% from-lime-400 via-cyan-300 to-blue-500" />
                  )}

                  <p className="font-medium text-primary/80 text-sm">
                    {user?.name || ''}
                  </p>
                </div>
                <span className="flex flex-col items-center justify-center">
                  <ChevronUp className="relative top-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                  <ChevronDown className="relative bottom-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 bg-card p-2"
              sideOffset={8}
            >
              <DropdownMenuLabel className="flex items-center font-normal text-primary/60 text-xs">
                Personal Account
              </DropdownMenuLabel>
              <DropdownMenuItem className="h-10 w-full cursor-pointer justify-between rounded-md bg-secondary px-2">
                <div className="flex items-center gap-2">
                  {user.avatarUrl ? (
                    <Image
                      alt={user.name ?? user.email ?? ' '}
                      className="h-6 w-6 rounded-full object-cover"
                      height={24}
                      src={user.avatarUrl}
                      width={24}
                    />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-10% from-lime-400 via-cyan-300 to-blue-500" />
                  )}

                  <p className="font-medium text-primary/80 text-sm">
                    {user.name || ''}
                  </p>
                </div>
                <Check className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-between">
                Create Team
                <CirclePlusIcon />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-10 items-center gap-3">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 rounded-full" variant="ghost">
                {user.avatarUrl ? (
                  <Image
                    alt={user.name ?? user.email ?? ' '}
                    className="min-h-8 min-w-8 rounded-full object-cover"
                    height={48}
                    src={user.avatarUrl}
                    width={48}
                  />
                ) : (
                  <span className="min-h-8 min-w-8 rounded-full bg-gradient-to-br from-10% from-lime-400 via-cyan-300 to-blue-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="-right-4 fixed min-w-56 bg-background p-2"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm leading-none">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => router.push('/settings')}
              >
                <span className="text-primary/60 text-sm group-hover:text-primary group-focus:text-primary">
                  Settings
                </span>
                <Settings className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 py-0 font-normal">
                Theme
                <ThemeToggle />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => signOut()}
              >
                <span className="text-primary/60 text-sm group-hover:text-primary group-focus:text-primary">
                  Log Out
                </span>
                <LogOut className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-3">
        <div
          className={cn(
            'flex h-12 items-center border-b-2',
            isDashboardPath ? 'border-primary' : 'border-transparent'
          )}
        >
          <Link
            className={cn(
              `${buttonVariants({ variant: 'ghost', size: 'sm' })} text-primary/80`
            )}
            href="/"
          >
            Dashboard
          </Link>
        </div>
        <div
          className={cn(
            'flex h-12 items-center border-b-2',
            isSettingsPath ? 'border-primary' : 'border-transparent'
          )}
        >
          <Link
            className={cn(
              `${buttonVariants({ variant: 'ghost', size: 'sm' })} text-primary/80`
            )}
            href="/settings"
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}
