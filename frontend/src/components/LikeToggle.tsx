import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LikeToggleProps {
  likes: number;
  liked: boolean;
  onToggle: () => void;
  className?: string;
}

export const LikeToggle = ({
  likes,
  liked,
  onToggle,
  className,
}: LikeToggleProps) => {
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
      className={cn(
        "h-auto gap-2 pb-0.5 pt-1 text-muted-foreground hover:text-primary cursor-pointer",
        className,
      )}
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
