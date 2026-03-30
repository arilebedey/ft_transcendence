import { useEffect, useState } from "react";

export function useIsMobileViewport(maxWidth: number) {
  const getMatches = () =>
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${maxWidth}px)`).matches;

  const [isMobileViewport, setIsMobileViewport] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [maxWidth]);

  return isMobileViewport;
}
