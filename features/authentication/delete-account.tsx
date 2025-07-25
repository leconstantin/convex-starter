"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export function DeleteAccountButton() {
  const { signOut } = useAuthActions();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const deleteUser = useMutation(api.users.deleteUser);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This is irreversible."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUser();
      await signOut(); // clears session
      toast.success("Your account has been deleted.");
      router.push("/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete account."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      className="w-full"
      disabled={isDeleting}
      onClick={handleDelete}
      size={"sm"}
      variant="destructive"
    >
      {isDeleting ? "Deleting…" : "Delete Account"}
    </Button>
  );
}
