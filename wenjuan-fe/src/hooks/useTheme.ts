import { useState, useEffect } from 'react'

type ThemeType = 'light' | 'dark'

function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('THEME') as ThemeType) || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('THEME', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}

export default useTheme
