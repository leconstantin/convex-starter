import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { PageContainer } from '@/components/ui/page-container';
import { api } from '@/convex/_generated/api';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );

  if (!user?.username) {
    return redirect('/onboarding');
  }

  if (!user?.role) {
    return redirect('/onboarding');
  }

  const preloadedUser = await preloadQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );
  return (
    <>
      <Navigation preloadedUser={preloadedUser} />
      <PageContainer className="py-8">
        <main className="flex flex-col gap-20 md:gap-8">{children}</main>
      </PageContainer>
    </>
  );
}
