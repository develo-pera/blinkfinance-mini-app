"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  // TODO: fix animation
  return (
    <Button className="!bg-foreground/10 !text-foreground hover:!bg-foreground/20 hover:!text-foreground rounded-full" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:!scale-100 dark:-rotate-0 hidden dark:!block text-foreground" />
      <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:!scale-0 dark:rotate-90 !block dark:!hidden text-foreground" />
    </Button>
  )
}
