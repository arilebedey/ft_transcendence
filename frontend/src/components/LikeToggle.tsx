import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeToggleProps {
  likes: number;
  onToggle: () => void;
}

export const LikeToggle = ({ likes, onToggle }: LikeToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 text-muted-foreground hover:text-primary"
      onClick={onToggle}
    >
      <Heart className={`w-4 h-4`} />
      <span>{likes}</span>
    </Button>
  );
};