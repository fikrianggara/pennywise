"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen, CircleAlert, Trash2 } from "lucide-react";
import { DrawerDialogWithoutTrigger } from "./drawerDialog";
import { UpdateTransactionForm } from "./form";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { TRANSACTION } from "@/types/type";
import { useEffect, useState } from "react";
import { usePersistStore } from "@/store/zustand";

export type TransactionTable = {
  id: string;
  sheetId: string;
  amount: number;
  account: "expense" | "income";
  category: string;
  description: string;
  date: string;
};

export function DashboardDataTable({ data }: { data: TransactionTable[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { transactions, deleteTransactionById } = usePersistStore();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const isMobile = useIsMobile();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TRANSACTION | null>(null);
  // console.log(selectedTransactionId, openUpdate, openDelete);
  useEffect(() => {
    if (selectedTransactionId) {
      // setOpenUpdate(true)
      setSelectedTransaction(
        transactions.find(
          (transaction) => transaction.id === selectedTransactionId
        ) as TRANSACTION
      );
    }
  }, [selectedTransactionId]);

  const columns: ColumnDef<TransactionTable>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "account",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-xs"
          >
            Akun
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("account") === "income" ? "Pemasukan" : "Pengeluaran"}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-xs"
          >
            Kategori
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-xs"
          >
            Deskripsi
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-xs"
          >
            Amount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-xs"
          >
            Tanggal
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("date")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        // const TransactionTable = row.original;

        // return (
        //   <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //       <Button variant="ghost" className="h-8 w-8 p-0">
        //         <span className="sr-only">Open menu</span>
        //         <DotsHorizontalIcon className="h-4 w-4" />
        //       </Button>
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align="end">
        //       <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //       <DropdownMenuItem
        //         onClick={() =>
        //           navigator.clipboard.writeText(TransactionTable.id)
        //         }
        //       >
        //         Copy TransactionTable ID
        //       </DropdownMenuItem>
        //       <DropdownMenuSeparator />
        //       <DropdownMenuItem>View customer</DropdownMenuItem>
        //       <DropdownMenuItem>View TransactionTable details</DropdownMenuItem>
        //     </DropdownMenuContent>
        //   </DropdownMenu>
        // );
        const TransactionTable = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => {
                e.preventDefault();
                console.log(TransactionTable);
              }}
            >
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Aksi </span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              {/* <DropdownMenuItem>
                <Eye className="text-muted-foreground" />
                <Link href={`/sheets/${TransactionTable.sheetId}`}>
                  Lihat Sheet
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTransactionId(TransactionTable.id);
                  setOpenUpdate(true);
                }}
              >
                <SquarePen className="text-muted-foreground" />
                Edit
              </DropdownMenuItem>
              {selectedTransaction && (
                <DrawerDialogWithoutTrigger
                  title={`Perbarui transaksi`}
                  description={""}
                  content={
                    <UpdateTransactionForm
                      transaction={selectedTransaction}
                      callback={setOpenUpdate}
                    />
                  }
                  open={openUpdate}
                  setOpen={setOpenUpdate}
                />
              )}
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTransactionId(TransactionTable.id);
                  setOpenDelete(true);
                }}
              >
                <Trash2 className="text-muted-foreground" />
                <span>Hapus </span>
              </DropdownMenuItem>
              {selectedTransaction && (
                <DrawerDialogWithoutTrigger
                  title={`Hapus transaksi`}
                  description={""}
                  open={openDelete}
                  setOpen={setOpenDelete}
                  content={
                    <div className="p-4 md:p-2 space-y-2">
                      <Alert variant={"destructive"}>
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Perhatian!</AlertTitle>
                        <AlertDescription>
                          transaksi yang dihapus tidak dapat dikembalikan
                        </AlertDescription>
                      </Alert>
                      <Button
                        className="w-full text-red-500"
                        variant={"secondary"}
                        onClick={() =>
                          deleteTransactionById(TransactionTable.id)
                        }
                      >
                        Hapus
                      </Button>
                    </div>
                  }
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 5, //custom default page size
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="w-full">
      <div className="flex items-center py-4 w-full">
        <div className="flex gap-2">
          <Input
            placeholder="beli seblak..."
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="w-full"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" ml-auto text-xs">
                Kolom <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  let name = column.id;
                  switch (column.id) {
                    case "amount":
                      name = "jumlah";
                      break;
                    case "date":
                      name = "tanggal";
                      break;
                    case "description":
                      name = "deskripsi";
                      break;
                    case "account":
                      name = "akun";
                      break;
                    case "category":
                      name = "kategori";
                      break;
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {name}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-[5rem] overflow-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`p-1 text-xs ${
                        row.getValue("account") == "expense"
                          ? "dark:bg-rose-950 bg-rose-100"
                          : "dark:bg-emerald-950 bg-emerald-100"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} baris dipilih
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Kembali
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
