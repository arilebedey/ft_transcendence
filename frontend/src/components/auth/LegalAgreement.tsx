import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DesktopModal } from "@/components/ui/DesktopModal";
import { MobileModal } from "@/components/ui/MobileModal";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import { LegalContent } from "@/pages/Legal";

export function LegalAgreement() {
  const { t } = useTranslation();
  const isMobile = useIsMobileViewport(700);
  const [showLegalModal, setShowLegalModal] = useState(false);

  const closeLegalModal = () => setShowLegalModal(false);
  const openLegalModal = () => setShowLegalModal(true);
  const ignoreDesktopOverlayClose = () => undefined;

  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t("authConsentPrefix")}{" "}
        <span
          role="button"
          tabIndex={0}
          onClick={openLegalModal}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openLegalModal();
            }
          }}
          className="cursor-pointer text-primary underline underline-offset-2"
          aria-haspopup="dialog"
        >
          {t("legal.modalTitle")}
        </span>
      </p>

      {showLegalModal ? (
        isMobile ? (
          <MobileModal
            onClose={closeLegalModal}
            title={t("legal.modalTitle")}
            body={
              <div className="min-h-0 flex-1 overflow-y-auto">
                <LegalContent />
              </div>
            }
          />
        ) : (
          <DesktopModal
            onClose={ignoreDesktopOverlayClose}
            overlayClassName="bg-black/20"
            panelClassName="max-h-[min(42rem,calc(100vh-2rem))] w-[min(48rem,calc(100vw-2rem))]"
            body={
              <div className="flex min-h-0 h-full flex-col bg-card">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <LegalContent />
                </div>
                <div className="border-t px-6 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeLegalModal}
                  >
                    {t("back")}
                  </Button>
                </div>
              </div>
            }
          />
        )
      ) : null}
    </>
  );
}
