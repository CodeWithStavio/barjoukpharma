"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState<string>("light")

  React.useEffect(() => {
    const html = document.documentElement
    const isDark = html.classList.contains("dark")
    setThemeState(isDark ? "dark" : "light")

    // Also check localStorage
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "dark") {
        html.classList.add("dark")
        setThemeState("dark")
      }
    } catch {}
  }, [])

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light"
    setThemeState(newTheme)
    const html = document.documentElement
    if (newTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
    try {
      localStorage.setItem("theme", newTheme)
    } catch {}
  }, [theme])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
