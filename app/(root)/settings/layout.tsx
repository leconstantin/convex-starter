'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isSettingsPath = pathname === '/settings';
  const isAuthPath = pathname === '/settings/auth';
  return (
    <div className="flex h-full w-full py-4">
      <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
        <div className="hidden w-full max-w-64 flex-col gap-0.5 lg:flex">
          <Link
            className={cn(
              `${buttonVariants({ variant: 'ghost' })} ${isSettingsPath && 'bg-primary/5'}`,
              'justify-start rounded-md'
            )}
            href="/settings"
          >
            <span
              className={cn(
                `text-primary/80 text-sm ${isSettingsPath && 'font-medium text-primary'}`
              )}
            >
              General
            </span>
          </Link>
          <Link
            className={cn(
              `${buttonVariants({ variant: 'ghost' })} ${isAuthPath && 'bg-primary/5'} justify-start rounded-md`
            )}
            href="/settings/auth"
          >
            <span
              className={cn(
                `text-primary/80 text-sm ${isAuthPath && 'font-medium text-primary'}`
              )}
            >
              Authentications
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutContainer>{children}</LayoutContainer>;
}
