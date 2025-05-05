// File: lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string,
 * resolving Tailwind CSS class conflicts intelligently.
 * @param inputs - Class names or conditional class objects.
 * @returns A string of combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ensure 'clsx' and 'tailwind-merge' are installed:
// npm install clsx tailwind-merge
