import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface LikeToggleProps {
  likes: number;
  liked: boolean;
  onToggle: () => void;
}

export const LikeToggle = ({ likes, liked, onToggle }: LikeToggleProps) => {
  const [pop, setPop] = useState(false);

  const handleClick = () => {
    setPop(true);
    onToggle();
  };

  useEffect(() => {
    if (pop) {
      const timer = setTimeout(() => setPop(false), 150); // revenir à la taille normale après 150ms
      return () => clearTimeout(timer);
    }
  }, [pop]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 text-muted-foreground hover:text-primary"
      onClick={handleClick}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-150 ${
          liked ? "fill-pink-500 text-pink-500" : "text-muted-foreground"
        } ${pop ? "scale-125" : "scale-100"}`}
      />
      <span>{likes}</span>
    </Button>
  );
};