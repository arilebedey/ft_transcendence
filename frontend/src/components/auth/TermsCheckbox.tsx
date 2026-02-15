import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface TermsCheckboxProps {
  value: boolean;
  onChange: (checked: boolean) => void;
}

export default function TermsCheckbox({ value, onChange }: TermsCheckboxProps) {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          id="termsAccepted"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="termsAccepted" className="text-sm">
          {t("iAccept")}{" "}
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="underline text-blue-600 hover:text-blue-800"
          >
            {t("TOS")}
          </button>
        </label>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-20"
            onClick={() => setShowPopup(false)}
          ></div>

          <Card className="relative w-[480px] max-h-[600px] shadow-lg z-50 flex flex-col pt-6">
            <CardContent className="text-sm text-center overflow-y-auto max-h-[540px] pl-6 pr-7">
              {(t("tosContent", { returnObjects: true }) as string[]).map(
                (p, idx) => (
                  <p key={idx}>{p}</p>
                ),
              )}
            </CardContent>

            <CardFooter className="justify-center py-3">
              <Button onClick={() => setShowPopup(false)} className="px-6">
                {t("Close")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
