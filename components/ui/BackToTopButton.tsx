"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/shadcnUI/button"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackToTopButtonProps {
  className?: string;
}

export function BackToTopButton({ className = '' }: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-white border-0",
        className
      )}
      size="icon"
      aria-label="Back to top"
    >
      <ChevronUp className="w-6 h-6" />
    </Button>
  )
}

export default BackToTopButton
