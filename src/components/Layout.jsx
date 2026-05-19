import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Drawer from './Drawer'
import BottomNav from './BottomNav'

function Layout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <div className="app-container">
      <Header isScrolled={isScrolled} toggleDrawer={toggleDrawer} theme={theme} toggleTheme={toggleTheme} />
      <Drawer isOpen={isDrawerOpen} closeDrawer={() => setIsDrawerOpen(false)} theme={theme} toggleTheme={toggleTheme} />
      <main>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  )
}

export default Layout
