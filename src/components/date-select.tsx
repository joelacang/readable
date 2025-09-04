import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

// shadcn/ui select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface DateSelectProps {
  onDateChange: (date: Date | null) => void;
  initialDate?: Date | null;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
  className?: string;
  placeholder?: {
    day: string;
    month: string;
    year: string;
  };
  isError?: boolean;
}

const DateSelect: React.FC<DateSelectProps> = ({
  onDateChange,
  initialDate = null,
  disabled = false,
  minYear = 1900,
  maxYear = new Date().getFullYear() + 10,
  className = "",
  placeholder = {
    day: "Day",
    month: "Month",
    year: "Year",
  },
  isError = false,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const months: Array<{ value: number; label: string }> = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Initialize with initial date if provided
  useEffect(() => {
    if (initialDate) {
      const date = new Date(initialDate);
      if (!isNaN(date.getTime())) {
        setSelectedDay(date.getDate().toString());
        setSelectedMonth((date.getMonth() + 1).toString());
        setSelectedYear(date.getFullYear().toString());
      }
    }
  }, [initialDate]);

  // Get days for selected month/year
  const getDaysInMonth = (month: number, year: number): number => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(
    parseInt(selectedMonth) || 1,
    parseInt(selectedYear) || new Date().getFullYear(),
  );
  const days: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generate years array
  const years: number[] = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  );

  // Handle date changes and validate
  const handleDateChange = (day: string, month: string, year: string): void => {
    // Update local state
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);

    // If all fields are selected, create date and pass to parent
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Validate the date (handles cases like Feb 30)
      if (
        date.getDate() === parseInt(day) &&
        date.getMonth() === parseInt(month) - 1 &&
        date.getFullYear() === parseInt(year)
      ) {
        onDateChange(date);
      } else {
        onDateChange(null); // Invalid date
      }
    } else {
      onDateChange(null); // Incomplete date
    }
  };

  // Adjust day if it's invalid for the new month/year
  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const maxDays = getDaysInMonth(
        parseInt(selectedMonth),
        parseInt(selectedYear),
      );
      if (parseInt(selectedDay) > maxDays) {
        handleDateChange(maxDays.toString(), selectedMonth, selectedYear);
      }
    }
  }, [selectedMonth, selectedYear]);

  const handleDayChange = (value: string): void => {
    handleDateChange(value, selectedMonth, selectedYear);
  };

  const handleMonthChange = (value: string): void => {
    handleDateChange(selectedDay, value, selectedYear);
  };

  const handleYearChange = (value: string): void => {
    handleDateChange(selectedDay, selectedMonth, value);
  };

  return (
    <div className={`flex w-fit gap-3 ${className} `}>
      {/* Day Select */}
      <Select
        value={selectedDay}
        onValueChange={handleDayChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={isError ? "border-red-300 focus:ring-red-500" : ""}
        >
          <SelectValue placeholder={placeholder.day} />
        </SelectTrigger>
        <SelectContent>
          {days.map((day) => (
            <SelectItem key={day} value={day.toString()}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month Select */}
      <div className="w-32">
        <Select
          value={selectedMonth}
          onValueChange={handleMonthChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(
              isError && "border-red-300 focus:ring-red-500",
              "w-32",
            )}
          >
            <SelectValue placeholder={placeholder.month} />
          </SelectTrigger>
          <SelectContent className="w-32">
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                <span className={cn("hidden sm:inline")}>{month.label}</span>
                <span className="sm:hidden">{month.label.substring(0, 3)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Select */}
      <Select
        value={selectedYear}
        onValueChange={handleYearChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={isError ? "border-red-300 focus:ring-red-500" : ""}
        >
          <SelectValue placeholder={placeholder.year} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateSelect;
