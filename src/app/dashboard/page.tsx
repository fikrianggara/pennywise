"use client";

import { DashboardBarChart } from "@/components/chart-bar";
import { DashboardDataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { TypographyH2 } from "@/components/ui/typhography";
import { DollarSign, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardDonutChart } from "@/components/chart-donut";
import { usePersistStore } from "@/store/zustand";
import { ComboboxWithSearchInput } from "@/components/form";
import { SHEET, TRANSACTION } from "@/types/type";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  exportToExcel,
  formatNumberToIDR,
  transformTransactionsToExportDataFormat,
} from "@/lib/utils";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";
import Empty from "@/components/empty";

export default function Dashboard() {
  const { sheets, transactions } = usePersistStore();
  const [selectedSheet, setSelectedSheet] = useState<string>("semua");
  const [filteredTransactions, setFilteredTransactions] =
    useState<TRANSACTION[]>(transactions);

  const [filteredDate, setFilteredDate] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    setFilteredTransactions(
      transactions.sort(
        (t1, t2) => Number(new Date(t1.date)) - Number(new Date(t2.date))
      )
    );
  }, [transactions]);

  useEffect(() => {
    const tempFilteredTransactions = transactions.filter(
      (t) =>
        new Date(t.date) >= filteredDate.from! &&
        new Date(t.date) <= filteredDate.to!
    );
    if (selectedSheet === "semua") {
      setFilteredTransactions(tempFilteredTransactions);
    } else {
      setFilteredTransactions(
        tempFilteredTransactions.filter((t) => t.sheetId === selectedSheet)
      );
    }
  }, [selectedSheet, filteredDate]);

  const expenseStat = useMemo(
    () => ({
      amount: filteredTransactions
        .filter((t) => t.account === "expense")
        .reduce((acc: number, t: TRANSACTION) => acc + t.amount, 0),
    }),
    [filteredTransactions]
  );

  const incomeStat = useMemo(
    () => ({
      amount: filteredTransactions
        .filter((t) => t.account === "income")
        .reduce((acc: number, t: TRANSACTION) => acc + t.amount, 0),
    }),
    [filteredTransactions]
  );

  const revenueStat = useMemo(
    () => ({
      amount: incomeStat.amount - expenseStat.amount,
    }),
    [incomeStat, expenseStat]
  );

  const categoryStat = useMemo(() => {
    const uniqueCategory = [
      ...new Set(filteredTransactions.map((t) => t.category)),
    ];
    console.log(filteredTransactions);
    const categoryStat = uniqueCategory
      .map((category) => {
        return {
          name: category,
          count: filteredTransactions.filter((t) => t.category === category)
            .length,
          amount: filteredTransactions
            .filter((t) => t.category === category)
            .reduce(
              (acc: number, t: TRANSACTION) =>
                t.account === "expense" ? acc - t.amount : acc + t.amount,
              0
            ),
        };
      })
      .sort((a, b) => a.amount - b.amount);
    return categoryStat;
  }, [filteredTransactions]);

  const barChartData = useMemo(() => {
    const uniqueMonth = [
      ...new Set(
        filteredTransactions.map((t) =>
          format(new Date(t.date), "LLLL yyyy", { locale: id })
        )
      ),
    ];
    return uniqueMonth.map((m) => {
      return {
        month: m,
        expense: filteredTransactions
          .filter(
            (t) =>
              format(new Date(t.date), "LLLL yyyy", { locale: id }) === m &&
              t.account === "expense"
          )
          .reduce((acc: number, t: TRANSACTION) => acc + t.amount, 0),
        income: filteredTransactions
          .filter(
            (t) =>
              format(new Date(t.date), "LLLL yyyy", { locale: id }) === m &&
              t.account === "income"
          )
          .reduce((acc: number, t: TRANSACTION) => acc + t.amount, 0),
      };
    });
  }, [filteredTransactions]);
  const sheetsOptions = [
    ...sheets.map((s: SHEET) => ({
      label: s.name,
      value: s.id,
    })),
    {
      label: "Semua Sheet",
      value: "semua",
    },
  ];

  let TransactionContent;
  if (!filteredTransactions.length) {
    TransactionContent = <Empty />;
  } else {
    TransactionContent = (
      <div className="w-full grid gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 w-full">
          <div className="col-span-2 h-full grid grid-cols-2 gap-2 md:gap-4">
            <Card className="h-full p-4 md:p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-thin">Total Pengeluaran</h4>
                      <DollarSign size={16} />
                    </div>
                    <h2 className="text-base md:text-xl font-semibold tracking-tight">
                      {formatNumberToIDR(expenseStat.amount)}
                    </h2>
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                  +20.1% dari bulan lalu
                </p> */}
                </div>
              </div>
            </Card>
            <Card className="h-full p-4 md:p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-thin">Total Pemasukan</h4>
                      <DollarSign size={16} />
                    </div>
                    <h2 className="text-base md:text-xl font-semibold tracking-tight">
                      {formatNumberToIDR(incomeStat.amount)}
                    </h2>
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                  +20.1% dari bulan lalu
                </p> */}
                </div>
              </div>
            </Card>
            <Card className="h-full p-4 md:p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-thin">Total Pendapatan</h4>
                      <DollarSign size={16} />
                    </div>
                    <h2
                      className={`text-base md:text-xl font-semibold tracking-tight ${
                        revenueStat.amount > 0
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {formatNumberToIDR(revenueStat.amount)}
                    </h2>
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                  +20.1% dari bulan lalu
                </p> */}
                </div>
              </div>
            </Card>
            <Card className="h-full p-4 md:p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 flex flex-col justify-between space-y-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-thin">
                        Pengeluaran Terbanyak
                      </h4>
                      <DollarSign size={16} />
                    </div>
                    <h2 className="text-base md:text-xl font-semibold tracking-tight">
                      {categoryStat[0]?.name}
                    </h2>
                  </div>
                  <p className="text-xs flex items-center gap-2 font-medium leading-none">
                    Sebesar{" "}
                    <strong
                      className={
                        categoryStat[0]?.amount < 0
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }
                    >
                      {formatNumberToIDR(categoryStat[0]?.amount)}
                    </strong>
                    {/* <TrendingUp className="h-4 w-4" /> */}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    dari {categoryStat[0]?.count} transaksi
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-span-2">
            <DashboardDonutChart
              title={"Distribusi Transaksi Berdasarkan Kategori"}
              description={`Transaksi ${format(
                filteredDate.from!,
                "dd LLLL yyyy",
                {
                  locale: id,
                }
              )} hingga ${format(filteredDate.to!, "dd LLLL yyyy", {
                locale: id,
              })}`}
              data={categoryStat}
              unit={"transaksi"}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full">
          <div className="col-span-2">
            <DashboardBarChart
              title={"Pendapatan dan Pengeluaran"}
              description={`Transaksi ${format(
                filteredDate.from!,
                "dd LLLL yyyy",
                {
                  locale: id,
                }
              )} hingga ${format(filteredDate.to!, "dd LLLL yyyy", {
                locale: id,
              })}`}
              data={barChartData}
            />
          </div>

          <Card className="h-full p-4 md:p-6">
            <h2 className="font-bold">Histori Transaksi</h2>
            <h3 className="text-xs text-muted-foreground">
              30 transaksi bulan ini
            </h3>
            <DashboardDataTable
              data={filteredTransactions.map((t) => {
                return {
                  id: t.id,
                  date: format(t.date, "dd LLLL yyyy", {
                    locale: id,
                  }),
                  category: t.category,
                  account: t.account as "expense" | "income",
                  amount: t.amount,
                  description: t.description,
                };
              })}
            />
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <TypographyH2>Dashboard</TypographyH2>
        <div className="space-y-2 flex flex-col md:items-end w-full md:w-64">
          <div className="flex flex-row items-center gap-2">
            <DatePickerWithRange
              callback={setFilteredDate}
              className="w-full"
              date={filteredDate}
            />
            <div className="w-full md:w-32">
              <ComboboxWithSearchInput
                value={selectedSheet}
                className="w-full"
                optionsProp={sheetsOptions}
                placeholder="Pilih Sheet"
                callback={setSelectedSheet}
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="transaction" className="w-full space-y-4">
        <div className="flex justify-between items-start gap-2">
          <TabsList className="w-full md:w-1/2 lg:w-fit">
            <TabsTrigger value="transaction">Transaksi</TabsTrigger>
            <TabsTrigger value="analysis">Analisis</TabsTrigger>
            <TabsTrigger value="report">Laporan</TabsTrigger>
          </TabsList>
          <Button
            className="w-full md:w-32"
            size="sm"
            onClick={() =>
              exportToExcel(
                transformTransactionsToExportDataFormat(
                  filteredTransactions,
                  sheets
                ),
                "Dashoard_" + format(new Date(), "MM-dd-yyyy")
              )
            }
          >
            <FileSpreadsheet />
            Export
          </Button>
        </div>

        <TabsContent value="transaction">{TransactionContent}</TabsContent>
        <TabsContent value="analysis">coming soon..</TabsContent>
        <TabsContent value="report">coming soon...</TabsContent>
      </Tabs>
    </div>
  );
}
