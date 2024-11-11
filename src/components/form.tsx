"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  getLocalStorageByKey,
  setLocalStorageByKey,
} from "@/store/localstorage";
import { transactions } from "@/data/transaction";
import { cn } from "@/lib/utils";

const uniqueCategories = [...new Set(transactions.map((t) => t.category))];
const uniqueSheets = [...new Set(transactions.map((t) => t.sheetId))];
const transactionSchema = z.object({
  sheetId: z
    .string({
      required_error: "Sheet harus diisi",
    })
    .min(3, {
      message: "Sheet minimal 3 karakter",
    })
    .max(30, {
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
  optionsProp,
  placeholder,
  callback,
}: {
  optionsProp: { label: string; value: string }[];
  placeholder: string;
  callback: (value: string) => void;
}) => {
  const [options, setOptions] = useState(optionsProp);
  const [selectedOption, setSelectedOption] = useState(optionsProp[0].value);
  const [searchInput, setSearchInput] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between text-xs ",
            !selectedOption && "text-muted-foreground"
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
            {options.find((option) =>
              option.label.toLowerCase().startsWith(searchInput.toLowerCase())
            ) ? null : (
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

export const AddTransactionForm = () => {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      sheetId: uniqueSheets[0],
      account: "expense",
      category: uniqueCategories[0],
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
      date: format(values.date, "dd-MM-yyyy"),
    };
    const transactionsString = getLocalStorageByKey("transactions");
    if (transactionsString) {
      const transactions = JSON.parse(transactionsString);
      transactions.push(payload);
      setLocalStorageByKey("transactions", JSON.stringify(transactions));
    } else {
      localStorage.setItem("transactions", JSON.stringify([payload]));
    }
    toast.success("Transaksi ditambahkan");
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
                      optionsProp={uniqueSheets.map((sheet) => ({
                        label: sheet,
                        value: sheet,
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
                    <ComboboxWithSearchInput
                      optionsProp={uniqueCategories.map((category) => ({
                        label: category,
                        value: category,
                      }))}
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
          <Button type="submit" className="w-full text-xs ">
            Tambah
          </Button>
        </form>
      </Form>
    </div>
  );
};
