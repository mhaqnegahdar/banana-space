import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  TriangleAlert,
  CircleAlert,
  CircleCheck,
  Info,
  ArrowRight,
} from "lucide-react";

// Utility function to merge classes (simplified version of cn)
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(1rem)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current [&>svg]:opacity-60",
  {
    variants: {
      variant: {
        warning: "border-amber-500/50 text-amber-600",
        error: "border-red-500/50 text-red-600",
        success: "border-emerald-500/50 text-emerald-600",
        info: "border-blue-500/50 text-blue-600",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap = {
  warning: TriangleAlert,
  error: CircleAlert,
  success: CircleCheck,
  info: Info,
};

export function Alert({
  className,
  variant = "info",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const IconComponent = iconMap[variant || "info"];

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <IconComponent aria-hidden="true" />
      {children}
    </div>
  );
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 text-sm font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-start grid justify-items-start gap-1 text-sm  [&_p]:leading-relaxed [&_ul]:list-inside [&_ul]:list-disc [&_ul]:opacity-80",
        className
      )}
      {...props}
    />
  );
}

export function AlertLink({
  className,
  children,
  href = "#",
  ...props
}: React.ComponentProps<"a"> & { href?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "group text-sm font-semibold whitespace-nowrap inline-flex items-center",
        className
      )}
      {...props}
    >
      {children}
      <ArrowRight
        className="ms-1 -mt-0.5 opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        aria-hidden="true"
      />
    </a>
  );
}
