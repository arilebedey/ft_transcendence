import { useState, useRef, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DeleteButton } from "./ui/DeleteButton";

interface DropDownListProps {
  currentUserId?: string;
  authorId?: string;
  onDelete?: () => void;
  children?: ReactNode;
}

export function DropDownList({ currentUserId, authorId, onDelete, children }: DropDownListProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative ml-auto" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-background border rounded-md shadow-lg z-50 animate-fade-in">
          {currentUserId === authorId && (
            <DeleteButton onDelete={() => {
              setMenuOpen(false);
              onDelete?.();
            }} />
          )}

          {children}
        </div>
      )}
    </div>
  );
}