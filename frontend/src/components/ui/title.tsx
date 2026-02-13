import React from "react";

interface TitleProps {
  title: string;
  className?: string;
}

export function Title(
    { title, className = "text-xl md:text-2xl text-muted-foreground font-light" }: TitleProps) {
  return (
    <p className={className}>
      {title}
    </p>
  );
}