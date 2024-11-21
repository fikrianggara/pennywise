"use client";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CircleAlert,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  SquarePen,
  Trash,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { usePersistStore } from "@/store/zustand";
import { SHEET, TRANSACTION } from "@/types/type";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const transactionSchema = z.object({
  sheetId: z
    .string({
      required_error: "Sheet harus diisi",
    })
    .min(3, {
      message: "Sheet minimal 3 karakter",
    })
    .max(100, {
      message: "Sheet terlalu panjang",
    }),
  account: z.enum(["expense", "income"], {
    required_error: "Anda harus memilih akun",
  }),
  category: z
    .string({
      required_error: "Kategori harus diisi",
    })
    .min(3, {
      message: "Kategori minimal 3 karakter",
    })
    .max(30, {
      message: "Kategori terlalu panjang",
    }),
  description: z
    .string({
      required_error: "Catatan harus diisi",
    })
    .min(4, {
      message: "Catatan minimal 4 karakter",
    })
    .max(200, {
      message: "Catatan terlalu panjang",
    }),
  amount: z
    .number({
      required_error: "Nominal harus terisi",
    })
    .min(500, {
      message: "Minimal nominal Rp.500",
    }),
  date: z.date({
    required_error: "Tanggal harus diisi",
  }),
  time: z.string(),
});

const sheetSchema = z.object({
  name: z
    .string({
      required_error: "nama harus terisi",
    })
    .min(4, {
      message: "minimal 4 karakter",
    })
    .max(20, {
      message: "maksimal 20 karakter",
    }),
  description: z
    .string({
      required_error: "deskripsi harus terisi",
    })
    .min(4, {
      message: "minimal 4 karakter",
    })
    .max(200, {
      message: "maksimal 200 karakter",
    }),
});

export const SelectInput = ({
  options,
  placeholder,
  callback,
}: {
  options: { label: string; value: string }[];
  placeholder: string;
  callback: (value: string) => void;
}) => {
  return (
    <Select onValueChange={callback} defaultValue={options[0].value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const ComboboxWithSearchInput = ({
  className,
  value,
  optionsProp,
  placeholder,
  callback,
}: {
  className?: string;
  value: string;
  optionsProp: { label: string; value: string }[];
  placeholder: string;
  callback: (value: string) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState(value);
  const [searchInput, setSearchInput] = useState("");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size={"sm"}
          className={cn(
            "w-full justify-between text-xs ",
            !selectedOption && "text-muted-foreground",
            className
          )}
        >
          {selectedOption
            ? optionsProp.find((option) => option.value === selectedOption)
                ?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-0 truncate">
        <Command>
          <CommandInput
            value={searchInput}
            placeholder={placeholder + "..."}
            onValueChange={setSearchInput}
            className="h-9 text-xs"
          />
          <CommandList>
            {/* {optionsProp.find((option) =>
              option.label.toLowerCase().startsWith(searchInput.toLowerCase())
            ) ? (
              <CommandEmpty>No framework found.</CommandEmpty>
            ) : (
              <CommandItem
                key={searchInput}
                value={searchInput}
                onSelect={() => {
                  setSelectedOption(searchInput);
                  callback(searchInput);
                }}
              >
                {searchInput}
                <Check
                  className={cn(
                    "ml-auto text-xs  ",
                    searchInput === selectedOption ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            )} */}
            <CommandEmpty>tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {optionsProp.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => {
                    setSelectedOption(option.value);
                    callback(option.value);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto text-xs  ",
                      option.value === selectedOption
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const AddableComboboxWithSearchInput = ({
  className,
  value,
  optionsProp,
  placeholder,
  callback,
}: {
  className?: string;
  value: string;
  optionsProp: { label: string; value: string }[];
  placeholder: string;
  callback: (value: string) => void;
}) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedOption, setSelectedOption] = useState(value);
  const [searchInput, setSearchInput] = useState("");
  // console.log(optionsProp, options);
  useEffect(() => {
    setOptions(optionsProp);
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size={"sm"}
          className={cn(
            "w-full justify-between text-xs ",
            !selectedOption && "text-muted-foreground",
            className
          )}
        >
          {selectedOption
            ? options.find((option) => option.value === selectedOption)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-0 truncate">
        <Command>
          <CommandInput
            placeholder={placeholder + "..."}
            onValueChange={setSearchInput}
            className="h-9 text-xs"
          />
          <CommandList>
            {searchInput !== "" && (
              <CommandItem
                key={searchInput}
                value={searchInput}
                onSelect={() => {
                  setOptions((prev) => [
                    ...prev,
                    { label: searchInput, value: searchInput },
                  ]);
                  setSelectedOption(searchInput);
                  callback(searchInput);
                }}
              >
                {searchInput}
                <Check
                  className={cn(
                    "ml-auto text-xs  ",
                    searchInput === selectedOption ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            )}

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => {
                    setSelectedOption(option.value);
                    callback(option.value);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto text-xs  ",
                      option.value === selectedOption
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const RadioInput = ({
  options,
  orientation,
  callback,
}: {
  options: { label: string; value: string }[];
  orientation: "horizontal" | "vertical";
  callback: (value: string) => void;
}) => {
  return (
    <RadioGroup
      defaultValue={options[0].value}
      onValueChange={callback}
      className={`flex text-xs  ${
        orientation === "horizontal"
          ? "flex-row space-x-2"
          : "flex-col space-y-2"
      } items-start justify-start`}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value} className="text-xs ">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export const AddSheetForm = ({ callback }: { callback: (p?: any) => void }) => {
  const { addSheet } = usePersistStore();

  const form = useForm<z.infer<typeof sheetSchema>>({
    resolver: zodResolver(sheetSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof sheetSchema>) {
    const payload = {
      id: crypto.randomUUID(),
      ...values,
    };

    addSheet(payload);
    callback(false);
    toast.success("Sheet berhasil ditambahkan");
  }
  return (
    <div className="p-4 md:p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-xs"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Nama</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"tabungan"}
                    {...field}
                    className="text-xs "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="deskripsi sheet"
                    className="resize-none text-xs "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full text-xs ">
            Tambah
          </Button>
        </form>
      </Form>
    </div>
  );
};
export const AddTransactionForm = ({
  sheet,
  callback,
}: {
  sheet: string;
  callback: (p?: any) => void;
}) => {
  const { sheets, transactions, addTransaction } = usePersistStore();
  // const { setOpen } = useContext(DrawerContext);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      sheetId: sheet ? sheet : "",
      account: "expense",
      category: "",
      description: "",
      amount: 1,
      date: new Date(),
      time: "",
    },
  });
  function onSubmit(values: z.infer<typeof transactionSchema>) {
    const payload = {
      id: crypto.randomUUID(),
      ...values,
      date: new Date(values.date),
    };
    addTransaction(payload);
    callback(false);
    toast.success("Transaksi berhasil ditambahkan");
  }

  return (
    <div className="h-[calc(100vh-400px)] overflow-y-scroll p-4 md:p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-xs"
        >
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Akun</FormLabel>
                <FormControl defaultValue={field.value}>
                  <RadioInput
                    callback={field.onChange}
                    options={[
                      { label: "Pengeluaran", value: "expense" },
                      { label: "Pemasukan", value: "income" },
                    ]}
                    orientation="horizontal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="sheetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-xs ">Sheet</FormLabel>
                  <FormControl>
                    <ComboboxWithSearchInput
                      value={field.value}
                      optionsProp={sheets.map((sheet) => ({
                        label: sheet.name,
                        value: sheet.id,
                      }))}
                      placeholder="Pilih Sheet"
                      callback={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ">Kategori</FormLabel>
                  <FormControl>
                    <AddableComboboxWithSearchInput
                      value={field.value}
                      optionsProp={
                        transactions.length > 0
                          ? [
                              ...new Set(transactions.map((t) => t.category)),
                            ].map((category) => ({
                              label: category,
                              value: category,
                            }))
                          : []
                      }
                      placeholder="Pilih Kategori"
                      callback={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ">Tanggal</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal truncate text-xs ",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-xs ">Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ">Waktu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"hh:mm"}
                      {...field}
                      className="text-xs "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Nominal</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    type="number"
                    className="text-xs "
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  nominal yang diperoleh atau dikeluarkan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="deskripsi pengeluaran/pemasukan"
                    className="resize-none text-xs "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full text-xs ">
            Tambah
          </Button>
        </form>
      </Form>
    </div>
  );
};

export const UpdateSheetForm = ({
  sheet,
  callback,
}: {
  sheet: SHEET;
  callback: (p?: any) => void;
}) => {
  const { updateSheetById, deleteSheetById } = usePersistStore();

  const form = useForm<z.infer<typeof sheetSchema>>({
    resolver: zodResolver(sheetSchema),
    defaultValues: {
      name: sheet.name,
      description: sheet.description,
    },
  });

  function onSubmit(values: z.infer<typeof sheetSchema>) {
    const payload = {
      id: sheet.id,
      ...values,
    };
    updateSheetById(payload.id, payload);
    callback(false);
    toast.success("Sheet berhasil diubah");
  }
  const onDelete = () => {
    deleteSheetById(sheet.id);
  };
  return (
    <div className="p-4 md:p-2 space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-xs"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Nama</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"tabungan"}
                    {...field}
                    className="text-xs "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="deskripsi sheet"
                    className="resize-none text-xs "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col flex-col-reverse md:flex-row gap-4">
            <Button
              className="w-full text-xs text-red-600"
              variant={"secondary"}
              onClick={onDelete}
            >
              <Trash /> Hapus
            </Button>
            <Button type="submit" className="w-full text-xs ">
              <SquarePen />
              Perbarui
            </Button>
          </div>
        </form>
      </Form>
      <Alert variant={"destructive"} className="text-xs">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Peringatan</AlertTitle>
        <AlertDescription className="text-xs">
          Sheet yang dihapus tidak dapat dikembalikan. Catatan transaksi akan
          ikut terhapus
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const UpdateTransactionForm = ({
  transaction,
  callback,
}: {
  id: string;
  transaction: TRANSACTION;
  callback: (p?: any) => void;
}) => {
  const { sheets, transactions, updateTransactionById, deleteTransactionById } =
    usePersistStore();
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      sheetId: transaction.sheetId,
      account: transaction.account as "income" | "expense",
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      date: new Date(transaction.date),
      time: transaction.time,
    },
  });
  function onSubmit(values: z.infer<typeof transactionSchema>) {
    const payload = {
      id: crypto.randomUUID(),
      ...values,
    };
    updateTransactionById(transaction.id, payload);
    callback(false);
    toast.success("Transaksi berhasil diubah");
  }
  function onDelete() {
    deleteTransactionById(transaction.id);
    callback(false);
    toast.success("Transaksi berhasil dihapus");
  }
  return (
    <div className="h-[calc(100vh-400px)] overflow-y-scroll p-4 md:p-2 space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-xs"
        >
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Akun</FormLabel>
                <FormControl defaultValue={field.value}>
                  <RadioInput
                    callback={field.onChange}
                    options={[
                      { label: "Pengeluaran", value: "expense" },
                      { label: "Pemasukan", value: "income" },
                    ]}
                    orientation="horizontal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="sheetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-xs ">Sheet</FormLabel>
                  <FormControl>
                    <AddableComboboxWithSearchInput
                      value={field.value}
                      optionsProp={sheets.map((sheet) => ({
                        label: sheet.name,
                        value: sheet.id,
                      }))}
                      placeholder="Pilih Sheet"
                      callback={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ">Kategori</FormLabel>
                  <FormControl>
                    <AddableComboboxWithSearchInput
                      value={field.value}
                      optionsProp={
                        transactions.length > 0
                          ? [
                              ...new Set(transactions.map((t) => t.category)),
                            ].map((category) => ({
                              label: category,
                              value: category,
                            }))
                          : []
                      }
                      placeholder="Pilih Kategori"
                      callback={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ">Tanggal</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal truncate text-xs ",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-xs ">Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ">Waktu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"hh:mm"}
                      {...field}
                      className="text-xs "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Nominal</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    type="number"
                    className="text-xs "
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  nominal yang diperoleh atau dikeluarkan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs ">Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="deskripsi pengeluaran/pemasukan"
                    className="resize-none text-xs "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col flex-col-reverse md:flex-row gap-4">
            <Button
              className="w-full text-xs text-red-600"
              variant={"secondary"}
              onClick={onDelete}
            >
              <Trash /> Hapus
            </Button>
            <Button type="submit" className="w-full text-xs ">
              <SquarePen />
              Perbarui
            </Button>
          </div>
        </form>
      </Form>
      <Alert variant={"destructive"} className="text-xs">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Peringatan</AlertTitle>
        <AlertDescription className="text-xs">
          Data yang dihapus tidak bisa dipulihkan.
        </AlertDescription>
      </Alert>
    </div>
  );
};
