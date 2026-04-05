import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DesktopModalProps {
  onClose: () => void;
  body: ReactNode;
  rootClassName?: string;
  overlayClassName?: string;
  panelClassName?: string;
}

export function DesktopModal({
  onClose,
  body,
  rootClassName,
  overlayClassName,
  panelClassName,
}: DesktopModalProps) {
  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center", rootClassName)}
    >
      <div
        className={cn("absolute inset-0 cursor-pointer bg-black/30", overlayClassName)}
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-50 flex max-h-[calc(100vh-2rem)] w-[30rem] max-w-[calc(100vw-2rem)] min-h-0 flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg",
          panelClassName,
        )}
      >
        {body}
      </div>
    </div>
  );
}
