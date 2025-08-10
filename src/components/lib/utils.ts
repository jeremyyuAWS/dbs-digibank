import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAccountNumber(number: string): string {
  return number.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function maskAadhaar(aadhaar: string): string {
  return `XXXX XXXX ${aadhaar.slice(-4)}`;
}

export function maskPAN(pan: string): string {
  return `${pan.slice(0, 3)}XXXXXX${pan.slice(-1)}`;
}