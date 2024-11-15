import { SHEET, TRANSACTION } from "@/types/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PERSIST_STORE = {
  transactions: TRANSACTION[];
  sheets: SHEET[];
  addTransaction: (transaction: TRANSACTION) => void;
  addSheet: (sheet: SHEET) => void;
  deleteTransactionById: (id: string) => void;
  deleteSheetById: (id: string) => void;
};

export const usePersistStore = create<PERSIST_STORE>()(
  persist(
    (set, get) => ({
      transactions: [],
      sheets: [],
      addTransaction: (transaction: TRANSACTION) => {
        const transactionsStore = get().transactions;
        if (transactionsStore) {
          set({ transactions: [...transactionsStore, transaction] });
        } else {
          set({ transactions: [transaction] });
        }
      },
      addSheet: (sheet: SHEET) => {
        const sheetsStore = get().sheets;
        if (sheetsStore) {
          set({ sheets: [...sheetsStore, sheet] });
        } else {
          set({ sheets: [sheet] });
        }
      },
      deleteTransactionById: (id: string) => {
        const newTransactions = get().transactions.filter(
          (t: TRANSACTION) => t.id != id
        );
        set(() => ({ transactions: newTransactions }));
      },
      deleteSheetById: (id: string) => {
        const newSheets = get().sheets.filter((t: SHEET) => t.id != id);
        set(() => ({ sheets: newSheets }));
      },
    }),

    {
      name: "store",
    }
  )
);
