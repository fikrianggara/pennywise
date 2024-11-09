"use client";

import { BarChart } from "@/components/chart-bar";
import { DataTableDemo } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/datepicker";
import { TypographyH2 } from "@/components/ui/typhography";
import { DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonutChartWithText } from "@/components/chart-donut";

export default function Dashboard() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <TypographyH2>Dashboard</TypographyH2>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange />
          <Button className=" w-fit md:w-32" size="sm">
            Download
          </Button>
        </div>
      </div>
      <Tabs defaultValue="transaction" className="w-full">
        <TabsList>
          <TabsTrigger value="transaction">Transaksi</TabsTrigger>
          <TabsTrigger value="analysis">Analisis</TabsTrigger>
          <TabsTrigger value="report">Laporan</TabsTrigger>
        </TabsList>
        <TabsContent value="transaction">
          <div className="w-full grid gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 w-full">
              <div className="md:col-span-2 h-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <Card className="h-full p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-thin">
                            Total Pengeluaran
                          </h4>
                          <DollarSign size={16} />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight">
                          Rp 1.000.000,00
                        </h2>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% dari bulan lalu
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="h-full p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-thin">
                            Total Pengeluaran
                          </h4>
                          <DollarSign size={16} />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight">
                          Rp 1.000.000,00
                        </h2>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% dari bulan lalu
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="h-full p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-thin">
                            Total Pengeluaran
                          </h4>
                          <DollarSign size={16} />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight">
                          Rp 1.000.000,00
                        </h2>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% dari bulan lalu
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="h-full p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-thin">
                            Total Pengeluaran
                          </h4>
                          <DollarSign size={16} />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight">
                          Rp 1.000.000,00
                        </h2>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% dari bulan lalu
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="md:col-span-2">
                <DonutChartWithText
                  title={"Distribusi Transaksi"}
                  description={"Transaksi Bulan Ini"}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full">
              <div className="col-span-2">
                <BarChart />
              </div>

              <Card className="h-full p-6">
                <h2 className="font-bold">Histori Transaksi</h2>
                <h3 className="text-xs text-muted-foreground">
                  30 transaksi bulan ini
                </h3>
                <DataTableDemo />
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analysis">coming soon..</TabsContent>
        <TabsContent value="report">coming soon...</TabsContent>
      </Tabs>
    </div>
  );
}
