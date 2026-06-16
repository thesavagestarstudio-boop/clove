import { motion } from 'motion/react'

export default function WorkInProgress() {
  return (
    <div className="fixed inset-0 bg-[#070504] flex flex-col items-center justify-center overflow-hidden z-[9999] select-none px-6">
      {/* Premium Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D49653]/5 blur-[120px] pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        
        {/* Logo Container with Shimmer & Scale Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-10 group cursor-pointer"
        >
          {/* Subtle logo background reflection effect */}
          <div
            className="absolute inset-0 blur-md opacity-30 transition-all duration-1000 group-hover:opacity-60 scale-105"
            style={{
              backgroundColor: '#D49653',
              mask: "url('/officiallogo.png') no-repeat center",
              WebkitMask: "url('/officiallogo.png') no-repeat center",
              maskSize: 'contain',
              WebkitMaskSize: 'contain'
            }}
          />
          <div
            style={{
              width: '200px',
              height: '80px',
              backgroundColor: '#D49653',
              mask: "url('/officiallogo.png') no-repeat center",
              WebkitMask: "url('/officiallogo.png') no-repeat center",
              maskSize: 'contain',
              WebkitMaskSize: 'contain'
            }}
            aria-label="CLOVE Logo"
          />
        </motion.div>

        {/* Elegant Website In Progress Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h1 className="text-[14px] md:text-[16px] tracking-[8px] uppercase font-light text-[#D9C5A1] leading-relaxed">
            WEBSITE IN PROGRESS
          </h1>
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#D49653]/40 to-transparent mx-auto" />
          <p className="text-[11px] tracking-[3px] uppercase text-[#5C4A32]/80 font-normal">
            Refining the Experience
          </p>
        </motion.div>
      </div>

      {/* Decorative corners for a high-end restaurant vibe */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-[#D49653]/20" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-[#D49653]/20" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-[#D49653]/20" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-[#D49653]/20" />
    </div>
  )
}
