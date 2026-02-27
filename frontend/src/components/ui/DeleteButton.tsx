import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DeleteButtonProps {
  onDelete: () => void;
}

export function DeleteButton({ onDelete }: DeleteButtonProps) {
  const [confirm, setConfirm] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    if (!confirm) {
      setConfirm(true);
    } else {
      onDelete();
      setConfirm(false);
    }
  };

  useEffect(() => {
    if (confirm) {
      const timer = setTimeout(() => setConfirm(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirm]);

  return (
    <button
      onClick={handleClick}
      className={`
        w-full text-left px-4 py-2 text-sm
        bg-transparent
        ${confirm ? "text-red-700" : "text-red-500"}
        hover:bg-red-50 hover:text-red-700
        transition-colors duration-200
      `}
    >
      {confirm ? t("Confirm") : t("Delete")}
    </button>
  );
}