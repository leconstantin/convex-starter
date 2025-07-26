import type { Metadata } from "next";
import UserOnboardingForm from "@/features/onboarding/form-board";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Onboarding",
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6 ">
      <div className="flex flex-col items-center gap-2">
        <span className="mb-2 select-none text-6xl">👋</span>
        <h3 className="text-center font-medium text-2xl text-primary">
          Welcome!
        </h3>
        <p className="text-center font-normal text-base text-primary/60">
          Let's get started by choosing a username.
        </p>
      </div>
      <UserOnboardingForm />
    </div>
  );
}
