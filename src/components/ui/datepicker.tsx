"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { id } from "date-fns/locale";

export function DatePickerWithRange({
  className,
  date,
  callback,
}: {
  className?: string;
  date?: DateRange;
  callback: (date: DateRange) => void;
}) {
  const [filteredDate, setFilteredDate] = React.useState<DateRange>(
    date
      ? date
      : {
          from: new Date(2022, 0, 20),
          to: addDays(new Date(2022, 0, 20), 20),
          // to: new Date(),
        }
  );
  const onChange = (date: DateRange | undefined) => {
    if (!date) return;
    setFilteredDate(date);
    callback(date);
  };
  return (
    <div className={"grid gap-2"}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            size="sm"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon />
            {filteredDate.from ? (
              filteredDate.to ? (
                <>
                  {format(filteredDate.from, "LLL dd, y", { locale: id })} -{" "}
                  {format(filteredDate.to, "LLL dd, y", { locale: id })}
                </>
              ) : (
                format(filteredDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={filteredDate.from}
            selected={date}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
