"use client"

import { useState, useEffect } from "react"

export function useScroll(threshold = 10) {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Determine if we've scrolled past the threshold
      if (currentScrollY > threshold) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
      
      // Determine scroll direction to show/hide navbar
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false)
      } else {
        // Scrolling up
        setVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, threshold])
  
  return { scrolled, visible }
}