import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface PostCreationButtonProps {
  onClick: () => void;
}

export function PostCreationButton({ onClick }: PostCreationButtonProps) {
  const { t } = useTranslation();

  return (
      <Button
        type="button"
        onClick={onClick}
        className="h-10 rounded-full px-4 sm:px-5"
      >
        {t("createPost")}
      </Button>
  );
}
