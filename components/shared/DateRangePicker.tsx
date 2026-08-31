"use client";

import * as React from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(
    date || {
      from: subDays(new Date(), 30),
      to: new Date(),
    }
  );

  const handleSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onDateChange?.(range);
  };

  const setPreset = (from: Date, to: Date) => {
    const range = { from, to };
    setSelectedRange(range);
    onDateChange?.(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          className={cn(
            "inline-flex shrink-0 items-center justify-start rounded-xl border border-border bg-card h-9 px-3 text-xs font-normal hover:bg-accent text-foreground transition-all cursor-pointer w-full sm:w-[260px]",
            !selectedRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {selectedRange?.from ? (
            selectedRange.to ? (
              <>
                {format(selectedRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                {format(selectedRange.to, "dd MMM yyyy", { locale: fr })}
              </>
            ) : (
              format(selectedRange.from, "dd MMM yyyy", { locale: fr })
            )
          ) : (
            <span>Sélectionner une période</span>
          )}
          <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-50" />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-2xl border-border bg-popover/95 backdrop-blur-md shadow-lg"
          align="end"
        >
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
            {/* Presets */}
            <div className="p-3 flex flex-col gap-1 text-xs min-w-[140px]">
              <span className="font-semibold text-muted-foreground mb-1 px-2">
                Raccourcis
              </span>
              <button
                className="text-left px-2 py-1.5 rounded-lg text-xs hover:bg-muted font-medium transition-colors"
                onClick={() => setPreset(new Date(), new Date())}
              >
                Aujourd'hui
              </button>
              <button
                className="text-left px-2 py-1.5 rounded-lg text-xs hover:bg-muted font-medium transition-colors"
                onClick={() => setPreset(subDays(new Date(), 7), new Date())}
              >
                7 derniers jours
              </button>
              <button
                className="text-left px-2 py-1.5 rounded-lg text-xs hover:bg-muted font-medium transition-colors"
                onClick={() => setPreset(subDays(new Date(), 30), new Date())}
              >
                30 derniers jours
              </button>
              <button
                className="text-left px-2 py-1.5 rounded-lg text-xs hover:bg-muted font-medium transition-colors"
                onClick={() =>
                  setPreset(startOfMonth(new Date()), endOfMonth(new Date()))
                }
              >
                Ce mois-ci
              </button>
            </div>

            <div className="p-2">
              <Calendar
                mode="range"
                defaultMonth={selectedRange?.from}
                selected={selectedRange}
                onSelect={handleSelect}
                numberOfMonths={1}
                locale={fr}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
