// types/form.types.ts
import { FieldPath, FieldValues, Control } from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
}

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "combobox"
  | "multiselect"
  | "date"
  | "radio"
  | "mdx"
  | "image"; // Added image input type

export interface BaseInputProps<
  TFieldValues extends FieldValues = FieldValues
> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export interface TextInputProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "text" | "email" | "password" | "number";
}

export interface TextareaProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "textarea";
  rows?: number;
}

export interface SelectProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "select";
  options: SelectOption[];
}

export interface ComboboxProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "combobox";
  options: SelectOption[];
}

export interface RadioProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "radio";
  options: SelectOption[];
}

export interface MultiSelectProps<
  TFieldValues extends FieldValues = FieldValues
> extends BaseInputProps<TFieldValues> {
  type: "multiselect";
  options?: SelectOption[];
}

export interface DateProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "date";
}

export interface CheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "checkbox";
}

// MDX Editor props
export interface MdxProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "mdx";
  height?: number;
  theme?: "light" | "dark";
}

// Image Upload props
export interface ImageProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseInputProps<TFieldValues> {
  type: "image";
  folder?: string; // ImageKit folder path
}

export type RHFInputProps<TFieldValues extends FieldValues = FieldValues> =
  | TextInputProps<TFieldValues>
  | TextareaProps<TFieldValues>
  | SelectProps<TFieldValues>
  | ComboboxProps<TFieldValues>
  | MultiSelectProps<TFieldValues>
  | RadioProps<TFieldValues>
  | DateProps<TFieldValues>
  | CheckboxProps<TFieldValues>
  | MdxProps<TFieldValues>
  | ImageProps<TFieldValues>;
