import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileModalProps {
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  body: ReactNode;
  rootClassName?: string;
  overlayClassName?: string;
  panelClassName?: string;
  headerClassName?: string;
}

export function MobileModal({
  onClose,
  title,
  subtitle,
  action,
  body,
  rootClassName,
  overlayClassName,
  panelClassName,
  headerClassName,
}: MobileModalProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-stretch justify-center",
        rootClassName,
      )}
    >
      <div
        className={cn("absolute inset-0 cursor-pointer bg-black/30", overlayClassName)}
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-50 flex h-full min-h-0 w-full flex-col overflow-hidden bg-card text-card-foreground",
          panelClassName,
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 border-b px-4 py-4",
            headerClassName,
          )}
        >
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="min-w-0 flex-1">
            {title ? (
              <h2 className="truncate text-base font-semibold text-foreground">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="truncate text-sm text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>

          {action ? (
            <div className="shrink-0">{action}</div>
          ) : title || subtitle ? (
            <div className="w-10 shrink-0" />
          ) : null}
        </div>

        {body}
      </div>
    </div>
  );
}
