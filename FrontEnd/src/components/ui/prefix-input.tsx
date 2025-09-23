import React from "react";
import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";

type PrefixInputProps = InputHTMLAttributes<HTMLInputElement> & {
  prefixIcon?: React.ReactNode;
};

export default function PrefixInput({ prefixIcon, className = "", ...props }: PrefixInputProps) {
  return (
    <div className="relative w-full">
      {/* Prefix icon container - pointer-events-none so clicks go to the input */}
      {prefixIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="h-4 w-4 text-muted-foreground">{prefixIcon}</span>
        </div>
      )}

      {/* shadcn Input - give left padding when prefix exists */}
      <Input
        {...props}
        className={`${prefixIcon ? "pl-10" : "pl-3"} ${className}`}
      />
    </div>
  );
}
