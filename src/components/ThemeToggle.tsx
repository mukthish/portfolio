'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTimeout(() => {
      setTheme(isDark ? 'dark' : 'light')
    }, 0)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    setTheme(nextTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full border border-foreground/10 dark:border-white/10 bg-card-bg/5 backdrop-blur-2xl hover:bg-border/20 transition-all shadow-xl hover:shadow-2xl hover:border-accent/30"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  )
}
