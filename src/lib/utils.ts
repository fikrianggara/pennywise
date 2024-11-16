import { SHEET, TRANSACTION } from "@/types/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

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

export const exportToExcel = (data: object[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, filename + ".xlsx");
};

export const transformTransactionsToExportDataFormat = (
  transactions: TRANSACTION[],
  sheets: SHEET[]
) => {
  return transactions.map((transaction) => ({
    id: transaction.id,
    sheetId: transaction.sheetId,
    sheet: sheets.find((s) => s.id === transaction.sheetId)?.name,
    account: transaction.account,
    category: transaction.category,
    description: transaction.description,
    amount: transaction.amount,
    date: format(transaction.date, "MM-dd-yyyy"),
    time: transaction.time,
  }));
};

export const formatNumberToIDR = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};
