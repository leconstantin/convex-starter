import SiteHeader from "@/components/site-header";
import { PageContainer } from "@/components/ui/page-container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer className="py-8">
      <main className="flex flex-col gap-20 md:gap-8">
        <SiteHeader />
        {children}
      </main>
    </PageContainer>
  );
}
