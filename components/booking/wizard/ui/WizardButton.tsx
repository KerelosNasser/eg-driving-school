"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface WizardButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  premium?: boolean;
}

export const WizardButton: React.FC<WizardButtonProps> = ({
  className,
  children,
  loading,
  premium = true,
  disabled,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        premium &&
          "bg-linear-to-r from-(--primary) to-yellow-400 hover:to-yellow-300 text-black font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-0.5",
        disabled &&
          "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none border-b-0",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {children}

      {/* Shine effect removed for performance */}
    </Button>
  );
};
