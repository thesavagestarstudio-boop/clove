'use client'
import React, { useEffect, useRef, createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SmoothScrollContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(SmoothScrollContext)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { pathname, key } = useLocation()
  const [lenis, setLenis] = React.useState<Lenis | null>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    
    setLenis(lenisInstance)
    
    lenisInstance.on('scroll', ScrollTrigger.update)

    let rafId: number
    const updateLenis = (time: number) => {
      lenisInstance.raf(time)
      rafId = requestAnimationFrame(updateLenis)
    }
    rafId = requestAnimationFrame(updateLenis)
    
    return () => {
      cancelAnimationFrame(rafId)
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
