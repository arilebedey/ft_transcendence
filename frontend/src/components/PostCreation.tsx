import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface PostCreationButtonProps {
  onClick: () => void;
}

export function PostCreationButton({ onClick }: PostCreationButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="px-6">
      <Button type="button" onClick={onClick}>
        {t("createPost")}
      </Button>
    </div>
  );
}