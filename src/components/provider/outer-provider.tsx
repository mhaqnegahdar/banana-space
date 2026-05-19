import React from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "../ui/tooltip";

export default function OuterProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
