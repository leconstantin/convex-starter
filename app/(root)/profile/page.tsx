import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import DeleteUserCard from "@/features/profile/delete-account-card";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your profile",
};

export default async function ProfilePage() {
  return (
    <section className="container-wrapper sm:px-6 lg:px-2">
      <div className="container flex flex-col py-8 md:py-16 lg:py-20">
        <div className="mx-auto flex w-full flex-col gap-6 lg:max-w-2xl lg:gap-10">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="font-medium text-lg">Settings</h3>
              <p className="text-muted-foreground text-sm">
                This is your settings page.
              </p>
            </div>
            <Separator />
          </div>
          {(await isAuthenticatedNextjs()) && <DeleteUserCard />}
        </div>
      </div>
    </section>
  );
}
