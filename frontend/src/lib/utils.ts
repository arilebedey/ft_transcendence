<<<<<<< HEAD
import { type ClassValue, clsx } from "clsx";
=======
import { clsx, type ClassValue } from "clsx";
>>>>>>> 6b6eef6 (Add front-end proposition. Working on plugging back-end)
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
