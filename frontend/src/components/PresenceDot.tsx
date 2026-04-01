import { cn } from "@/lib/utils";

interface PresenceDotProps {
  online?: boolean;
  className?: string;
}

export function PresenceDot({ online = false, className }: PresenceDotProps) {
  if (!online) return null;

  return (
    <span
      title="Online"
      className={cn(
        "inline-block h-3 w-3 rounded-full bg-emerald-500",
        className,
      )}
    />
  );
}
