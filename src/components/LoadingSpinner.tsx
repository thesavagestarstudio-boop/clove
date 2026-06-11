'use client'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm transition-all duration-350 animate-fadeIn">
      <div className="bg-[#00503D] p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center max-w-[220px] text-center">
        <div className="relative mb-5 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <div className="absolute inset-0 rounded-full border border-white/20 scale-125" />
        </div>
        <p className="font-playfair text-[16px] text-white font-bold tracking-[2px] uppercase">CLOVE</p>
        <p className="font-inter text-[11px] text-white/70 mt-1.5 font-medium tracking-[1.5px] uppercase">Please wait</p>
      </div>
    </div>
  )
}
