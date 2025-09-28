"use client"

import { useId, useState, useEffect } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ModeToggle({ className = "" }) {
  const id = useId()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = (checked) => {
    setIsDark(checked)

    if (checked) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Switch
        id={id}
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode" />
      <Label htmlFor={id} className="cursor-pointer">
        <span className="sr-only">Toggle dark mode</span>
        {isDark ? (
          <SunIcon size={16} aria-hidden="true" className="text-foreground" />
        ) : (
          <MoonIcon size={16} aria-hidden="true" className="text-foreground"/>
        )}
      </Label>
    </div>
  );
}