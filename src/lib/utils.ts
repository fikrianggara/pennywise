import { TRANSACTION } from "@/types/type";
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
  return monthNames[date.getMonth()];
}

export const getTotalIncome = (transactions: TRANSACTION[]) =>
  transactions
    .filter((transaction) => transaction.account === "income")
    .reduce(function (acc, obj) {
      return acc + obj.amount;
    }, 0);

export const getTotalExpense = (transactions: TRANSACTION[]) =>
  transactions
    .filter((transaction) => transaction.account === "expense")
    .reduce(function (acc, obj) {
      return acc + obj.amount;
    }, 0);

export const getTotalBalance = (transactions: TRANSACTION[]) =>
  getTotalIncome(transactions) - getTotalExpense(transactions);
