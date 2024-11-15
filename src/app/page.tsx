"use client";
import { DrawerDialog } from "@/components/drawerDialog";
import { AddSheetForm, UpdateSheetForm } from "@/components/form";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { TypographyH2 } from "@/components/ui/typhography";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTotalBalance } from "@/lib/utils";
import { usePersistStore } from "@/store/zustand";
import {
  CircleAlert,
  DollarSign,
  Eye,
  FileDown,
  MoreHorizontal,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  // const { isOnline } = useNetworkChecker();
  const isMobile = useIsMobile();
  const { sheets, transactions, deleteSheetById } = usePersistStore();

  return (
    <div className="w-11/12 mx-auto space-y-6 lg:space-y-12">
      <div className="space-y-2 md:space-y-4">
        <TypographyH2>PennyWise</TypographyH2>
        <p className="text-lg md:text-xl text-muted-foreground">
          Wise Up Your Penny&lsquo;s Expenses
        </p>
        <p className="text-xs md:text-md lg:text-lg md:leading-7 w-11/12 lg:w-1/2">
          Pennywise adalah teman keuangan cerdas Anda, yang membantu Anda
          melacak pengeluaran, mengelola pendapatan, dan mencapai kejelasan
          finansial—semuanya dalam satu aplikasi sederhana. Pantau keuangan Anda
          dengan mudah dan manfaatkan setiap sen.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-2 lg:gap-4">
        {sheets &&
          sheets.map((s) => {
            const filteredTransactions = transactions
              ? transactions.filter((t) => t.sheetId === s.id)
              : [];
            const totalBalance =
              filteredTransactions.length > 0
                ? getTotalBalance(filteredTransactions)
                : 0;
            return (
              <Card className="h-full p-4 md:p-6 relative" key={s.id}>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 items-center">
                          <DollarSign size={16} />
                          <Link
                            href={`/sheets/${s.id}`}
                            className="text-xs md:text-sm font-thin hover:underline"
                          >
                            {s.name}
                          </Link>
                        </div>
                      </div>
                      {filteredTransactions.length > 0 ? (
                        <h3
                          className={`tracking-tight italic self-center text-xs md:text-md lg:text-lg px-4 rounded w-fit font-semibold ${
                            totalBalance > 0
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }`}
                        >
                          {totalBalance < 0
                            ? `- Rp. ${totalBalance * -1}`
                            : `Rp. ${totalBalance}`}
                        </h3>
                      ) : (
                        <h2 className="text-xs md:text-md lg:text-lg tracking-tight italic">
                          Tidak ada data
                        </h2>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction className="self-center">
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem>
                        <Eye className="text-muted-foreground" />
                        <Link href={`/sheets/${s.id}`}>Lihat Sheet</Link>
                      </DropdownMenuItem>
                      <DrawerDialog
                        title={`Perbarui Sheet ${s.name}`}
                        description={""}
                        content={<UpdateSheetForm sheet={s} />}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <SquarePen className="text-muted-foreground" />
                            Edit
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuItem>
                        <FileDown className="text-muted-foreground" />
                        <button onClick={() => console.log("coming soon")}>
                          Export Sheet
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DrawerDialog
                        title={`Hapus sheet ${s.name}`}
                        description={""}
                        content={
                          <div className="p-4 md:p-0 space-y-2">
                            <Alert variant="destructive">
                              <CircleAlert className="h-4 w-4" />
                              <AlertTitle>Perhatian!</AlertTitle>
                              <AlertDescription>
                                Tindakan yang akan anda lakukan tidak dapat
                                dipulihkan
                              </AlertDescription>
                            </Alert>
                            <Button
                              className="w-full"
                              onClick={() => deleteSheetById(s.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        }
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="text-muted-foreground" />
                            <span>Hapus </span>
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            );
          })}

        <DrawerDialog
          trigger={
            <div className="h-full p-6 flex justify-center items-center border rounded-xl cursor-pointer shadow">
              <div className="flex items-center justify-evenly w-full">
                <div className="text-sidebar-foreground/70 flex flex-col md:flex-row justify-evenly items-center w-full">
                  <div className="flex space-x-2 items-center text-xs md:text-sm">
                    <Plus size={16} className="mr-2" /> Sheet
                  </div>
                </div>
              </div>
            </div>
          }
          title={"Tambah sheet"}
          description={"Tambah sheet baru"}
          content={<AddSheetForm />}
        ></DrawerDialog>
      </div>
    </div>
  );
}
