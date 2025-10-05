import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsFromName(name: string) {
  return name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function screamingSnakeToTitle(text: string) {
  return text
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLocaleLowerCase())
    .join(" ");
}
