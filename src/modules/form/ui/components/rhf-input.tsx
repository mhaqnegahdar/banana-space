"use client";
import { FieldValues } from "react-hook-form";
import * as React from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RHFInputProps } from "@/modules/form/lib/types";

// Import the separate input components
import { ComboboxInput } from "./inputs/combobox-input";
import { MultiSelectInput } from "./inputs/multiselect-input";
import { DateInput } from "./inputs/date-input";
import { ImageInput } from "./inputs/image-input";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleAlert } from "lucide-react";

export function RHFInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  description,
  disabled = false,
  className,
  ...props
}: RHFInputProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("flex flex-col items-start w-full ", className)}
        >
          <div className="flex gap-2">
            {label && props.type !== "checkbox" && (
              <FormLabel>{label}</FormLabel>
            )}
            {description && (
              <Tooltip>
                <TooltipTrigger>
                  <CircleAlert className="text-muted size-4" />{" "}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <FormDescription>{description}</FormDescription>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <FormControl>
            {(() => {
              switch (props.type) {
                case "text":
                case "email":
                case "password":
                  return (
                    <Input
                      type={props.type}
                      placeholder={placeholder}
                      disabled={disabled}
                      {...field}
                    />
                  );
                case "number":
                  return (
                    <Input
                      type="number"
                      placeholder={placeholder}
                      disabled={disabled}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  );
                case "textarea":
                  return (
                    <Textarea
                      placeholder={placeholder}
                      disabled={disabled}
                      rows={props.rows || 3}
                      {...field}
                    />
                  );

                case "image":
                  return (
                    <ImageInput
                      field={field}
                      placeholder={placeholder}
                      disabled={disabled}
                      folder={props.folder || "/"}
                    />
                  );
                case "select":
                  return (
                    <Select
                      key={field.value} // Force re-render when value changes
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {props.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case "combobox":
                  return (
                    <ComboboxInput
                      field={field}
                      options={props.options}
                      placeholder={placeholder}
                      disabled={disabled}
                    />
                  );
                case "multiselect":
                  return (
                    <MultiSelectInput
                      field={field}
                      options={props.options}
                      placeholder={placeholder}
                      disabled={disabled}
                    />
                  );
                case "date":
                  return (
                    <DateInput
                      field={field}
                      placeholder={placeholder}
                      disabled={disabled}
                    />
                  );
                case "radio":
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={disabled}
                      className="grid grid-cols-1 gap-2 mt-2"
                    >
                      {props.options.map(({ value, label: optionLabel }) => (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={value}
                            id={`${name}-${value}`}
                            disabled={disabled}
                          />
                          <Label htmlFor={`${name}-${value}`}>
                            {optionLabel}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  );
                case "checkbox":
                  return (
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={disabled}
                      />
                      <div className="space-y-1 leading-none">
                        {label && (
                          <FormLabel className="text-sm font-normal">
                            {label}
                          </FormLabel>
                        )}
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
