"use client";

import * as React from "react";
import { X } from "lucide-react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import { Command, CommandInput } from "@/components/ui/command";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectInputProps<
  TFieldValues extends FieldValues = FieldValues
> {
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelectInput<
  TFieldValues extends FieldValues = FieldValues
>({
  field,
  placeholder,
  disabled = false,
}: MultiSelectInputProps<TFieldValues>) {
  const [inputValue, setInputValue] = React.useState("");
  // const [open, setOpen] = React.useState(false);

  const currentValues: string[] = React.useMemo(() => {
    return Array.isArray(field.value) ? field.value : [];
  }, [field.value]);

  const handleRemove = (valueToRemove: string) => {
    field.onChange(
      currentValues.filter((value: string) => value !== valueToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (!currentValues.includes(trimmedValue)) {
        field.onChange([...currentValues, trimmedValue]);
      }
      setInputValue("");
      // setOpen(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {/* Combobox for adding new tags */}
      <Command
        className={cn(
          "file:text-foreground placeholder:text-muted selection:bg-primary selection:text-primary-foreground  border-input flex  w-full min-w-0 rounded-md border bg-transparent text-sm  shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "bg-background border-b-0 text-background-foreground flex h-[initial] w-full flex-col overflow-hidden"
        )}
      >
        <CommandInput
          placeholder={`${placeholder}...`}
          value={inputValue}
          className="p-0 m-0 border-b-0"
          onValueChange={setInputValue}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          showIcon={false}
        />
      </Command>
      {/* Selected Tags */}
      {currentValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentValues.map((value: string) => (
            <Badge key={value} variant="outline" className="px-2 py-1 text-xs">
              {value}
              <button
                type="button"
                onClick={() => handleRemove(value)}
                disabled={disabled}
                className="ml-1.5 hover:bg-muted/30 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
                <span className="sr-only">remove the {field.name}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
