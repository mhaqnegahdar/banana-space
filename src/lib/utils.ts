import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnv(varName: string) {
  // Check if running in Node.js
  if (typeof process !== "undefined" && process.env && process.env[varName]) {
    return process.env[varName];
  }

  return new Error(`${varName} is undefined`);
}
