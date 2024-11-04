import React from "react";
import { transactions } from "@/data/transaction";
import { getMonthNameFromDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
    <div className="w-11/12 md:w-10/12 lg:w-8/10 mx-auto space-y-4">
      <div className="w-full text-center space-y-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {sheetId}
        </h3>
        <h3
          className={`self-center mx-auto text-xl lg:text-2xl  w-fit ${
            totalBalance > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          Rp. {totalBalance}
        </h3>
      </div>

      <ul className="space-y-4">
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
            <li key={i} className="space-y-2 ">
              <div className="w-full flex justify-between">
                <h4 className="sticky top-0 scroll-m-20 text-sm md:text-lg font-semibold tracking-tight text-muted-foreground">
                  {day} {month}
                </h4>
                <h4
                  className={`text-sm px-3 py-1 border-b-2 ${
                    balanceByDate > 0
                      ? " border-green-500/50 text-green-500 "
                      : "border-red-500/50 text-red-500"
                  }`}
                >
                  Rp. {balanceByDate}
                </h4>
              </div>

              <ul className="space-y-2">
                {filteredTransactions
                  .filter((transaction) => transaction.date === d)
                  .map((transaction, i) => (
                    <li key={i}>
                      <div className="w-full flex justify-between items-start">
                        <div className="flex flex-col space-y-1">
                          <h5 className="text-lg font-semibold">
                            {transaction.category}
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {transaction.description}
                          </p>
                        </div>
                        <div className="pr-4">
                          {transaction.account === "income" ? (
                            <p className="font-thin text-green-500 text-sm opacity-75">
                              Rp. {transaction.amount}
                            </p>
                          ) : (
                            <p className="font-thin text-red-500 text-sm opacity-75">
                              Rp. {transaction.amount}
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
