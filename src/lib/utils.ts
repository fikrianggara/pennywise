import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uppercaseFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function camalize(str: string) {
  const parts = str.split(" ");
  return parts.map(uppercaseFirst).join(" ");
}

export function getMonthNameFromDate(date: Date) {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return monthNames[date.getMonth() + 1];
}
