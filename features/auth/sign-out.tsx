"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";

export function SignOut() {
  const { signOut } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingButton
      className="w-full rounded-sm"
      isLoading={isLoading}
      onClick={() => {
        setIsLoading(true);
        signOut();
      }}
      size="sm"
    >
      Log out
      <LogOutIcon className="ml-2" />
    </LoadingButton>
  );
}
