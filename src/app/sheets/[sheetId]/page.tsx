import React from "react";
import { transactions } from "@/data/transaction";
import { getMonthNameFromDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DrawerDialog } from "@/components/drawerDialog";
import { AddTransactionForm } from "@/components/form";

const Page = async ({ params }: { params: Promise<{ sheetId: string }> }) => {
  const sheetId = (await params).sheetId;
  const filteredTransactions = transactions
    .filter((transaction) => transaction.sheetId === sheetId)
    .map((transaction) => {
      return {
        ...transaction,
        amount: transaction.amount * 1000,
      };
    });

  const uniqueDate = [
    ...new Set(filteredTransactions.map((transaction) => transaction.date)),
  ];
  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.account === "income")
    .reduce(function (acc, obj) {
      return acc + obj.amount;
    }, 0);
  const totalExpense = filteredTransactions
    .filter((transaction) => transaction.account === "expense")
    .reduce(function (acc, obj) {
      return acc + obj.amount;
    }, 0);
  const totalBalance = totalIncome - totalExpense;
  return (
    <div className="w-11/12 md:w-10/12 lg:w-8/10 mx-auto space-y-6">
      <div className="space-y-6 sticky top-12 bg-background py-4 z-40">
        <div className="w-full text-center space-y-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {sheetId}
          </h3>
          <h3
            className={`self-center mx-auto text-xl lg:text-2xl px-4 rounded w-fit ${
              totalBalance > 0
                ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                : "text-rose-500 bg-rose-50 dark:bg-rose-950"
            }`}
          >
            {totalBalance < 0
              ? `- Rp. ${totalBalance * -1}`
              : `Rp. ${totalBalance}`}
          </h3>
        </div>

        <DrawerDialog
          trigger={
            <Button size="sm">
              <Plus /> Tambah
            </Button>
          }
          title="Tambah Transaksi"
          description="Tambah transaksi pengeluaran/pemasukan baru"
          content={<AddTransactionForm />}
        />
      </div>

      <ul className="">
        {uniqueDate.map((d, i) => {
          const date = new Date(d);
          const day = date.getDate();
          const month = getMonthNameFromDate(date);
          const totalIncomeByDate = filteredTransactions
            .filter(
              (transaction) =>
                transaction.date === d && transaction.account === "income"
            )
            .reduce(function (acc, obj) {
              return acc + obj.amount;
            }, 0);
          const totalExpenseByDate = filteredTransactions
            .filter(
              (transaction) =>
                transaction.date === d && transaction.account === "expense"
            )
            .reduce(function (acc, obj) {
              return acc + obj.amount;
            }, 0);
          const balanceByDate = totalIncomeByDate - totalExpenseByDate;
          return (
            <li key={i} className="space-y-2 pb-4">
              <div
                className={`sticky top-48 backdrop-blur-sm bg-background/30 w-full flex justify-between py-2 pt-4 z-10 border-b-2 ${
                  balanceByDate > 0
                    ? " border-emerald-500/50 text-emerald-500 "
                    : "border-rose-500/50 text-rose-500 "
                }`}
              >
                <h4 className="scroll-m-20 text-sm md:text-lg font-semibold tracking-tight text-foreground">
                  {day} {month}
                </h4>
                <h4
                  className={`text-sm px-3 py-1 rounded ${
                    balanceByDate > 0
                      ? " border-emerald-500/50 text-emerald-500 bg-emerald-50 dark:bg-emerald-950 "
                      : "border-rose-500/50 text-rose-500 bg-rose-50 dark:bg-rose-950 "
                  }`}
                >
                  {balanceByDate < 0
                    ? `- Rp. ${balanceByDate * -1}`
                    : `Rp. ${balanceByDate}`}
                </h4>
              </div>

              <ul className="space-y-2">
                {filteredTransactions
                  .filter((transaction) => transaction.date === d)
                  .map((transaction, i) => (
                    <li key={i} className="space-y-2">
                      <div className="w-full flex justify-between items-start">
                        <div className="flex flex-col space-y-1">
                          <h5 className="text-sm md:text-base">
                            {transaction.category}
                          </h5>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {transaction.description}
                          </p>
                        </div>
                        <div className="pr-4">
                          {transaction.account === "income" ? (
                            <p className="font-thin text-emerald-500 text-sm">
                              Rp. {transaction.amount}
                            </p>
                          ) : (
                            <p className="font-thin text-rose-500 text-sm">
                              - Rp. {transaction.amount}
                            </p>
                          )}
                        </div>
                      </div>
                      <Separator></Separator>
                    </li>
                  ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Page;
