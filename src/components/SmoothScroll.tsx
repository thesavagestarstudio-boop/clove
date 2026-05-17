'use client'
import React, { useEffect, useRef, createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

const SmoothScrollContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(SmoothScrollContext)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { pathname, key } = useLocation()
  const [lenis, setLenis] = React.useState<Lenis | null>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    
    setLenis(lenisInstance)
    
    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)
    
    return () => {
      lenisInstance.destroy()
    }
  }, [])

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname, key, lenis])
  
  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
