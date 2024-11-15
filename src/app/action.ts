import { TRANSACTION } from "@/types/type";

export const getTransactionFromLocalStorage = () => {
  const transactions = localStorage.getItem("transactions");
  return transactions ? JSON.parse(transactions) : [];
};

export const getTransactionBySheetIdFromLocalStorage = (sheetId: string) => {
  const transactions = getTransactionFromLocalStorage();
  if (!transactions) return [];
  return transactions.filter(
    (transaction: TRANSACTION) => transaction.sheetId === sheetId
  );
};
