"use client";

import { ReactNode } from "react";
import {
  FieldValues,
  UseFormReturn,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormStatus {
  type: "success" | "error" | "pending" | null;
  message: string;
}

interface RHFFormContainerProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  onError?: SubmitErrorHandler<TFieldValues>;
  children: ReactNode;
  submitText?: string;
  loadingText?: string;
  className?: string;
  status?: FormStatus;
  showDebug?: boolean;
  showStatus?: boolean;
  disabled?: boolean;
}

export function RHFormContainer<
  TFieldValues extends FieldValues = FieldValues,
>({
  form,
  onSubmit,
  onError = (errors) => {
    toast.error("Please fix the errors before submitting.");
    console.log("Validation errors:", errors);
  },
  children,
  submitText ,
  loadingText = "Submitting...",
  className = "space-y-4",
  status,
  showDebug = false,
  showStatus = true,
  disabled,
}: RHFFormContainerProps<TFieldValues>) {
  return (
    <div className="space-y-4 w-full">
      {/* Status Alert */}
      {status?.type && status.type != "pending" && showStatus && (
        <Alert variant={status?.type}>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className={className}
        >
          {children}

          {submitText ? (
            <Button
              type="submit"
              size={"lg"}
              disabled={form.formState.isSubmitting || disabled}
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingText}
                </>
              ) : (
                submitText
              )}
            </Button>
          ) : null}
        </form>
      </Form>

      {/* Debug Panel */}
      {showDebug && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Form State (Debug)</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(
              {
                values: form.getValues(),
                errors: form.formState.errors,
                isValid: form.formState.isValid,
                isDirty: form.formState.isDirty,
                touchedFields: form.formState.touchedFields,
              },
              null,
              2,
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
