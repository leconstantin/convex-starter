import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { PageContainer } from "@/components/ui/page-container";
import { api } from "@/convex/_generated/api";
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
  if (!user?.userName) {
    return redirect("/onboarding");
  }
  if (!user?.role) {
    return redirect("/onboarding");
  }
  return (
    <PageContainer className="py-8">
      <main className="flex flex-col gap-20 md:gap-8">
        <SiteHeader />
        {children}
      </main>
    </PageContainer>
  );
}
