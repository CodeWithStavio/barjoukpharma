"use client"

import * as React from "react"

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  React.useEffect(() => {
    const html = document.documentElement
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "dark") {
        html.classList.add("dark")
      } else if (stored === "light") {
        html.classList.remove("dark")
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark")
      }
    } catch {}
  }, [])

  return <>{children}</>
}
