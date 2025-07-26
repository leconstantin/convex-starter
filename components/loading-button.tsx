"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, children, isLoading = false, disabled, ...props }, ref) => {
    return (
      <Button
        className={cn(className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 flex h-4 w-4 animate-spin " />}
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
