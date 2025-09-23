import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export default function Divider({ className }: DividerProps) {
  return (
    <div className={cn("w-full border-b border-gray-300", className)}></div>
  );
}
