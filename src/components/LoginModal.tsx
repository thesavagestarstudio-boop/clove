'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-linen border border-linen-dark max-w-[420px] w-full p-10 relative z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-stone hover:text-charcoal transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex border-b border-linen-dark/50 mb-8">
              <button 
                onClick={() => setTab('login')}
                className={`flex-1 pb-3 text-[12px] tracking-[2px] uppercase font-medium transition-all relative ${
                  tab === 'login' ? 'text-charcoal' : 'text-stone'
                }`}
              >
                Log In
                {tab === 'login' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-spice" />
                )}
              </button>
              <button 
                onClick={() => setTab('signup')}
                className={`flex-1 pb-3 text-[12px] tracking-[2px] uppercase font-medium transition-all relative ${
                  tab === 'signup' ? 'text-charcoal' : 'text-stone'
                }`}
              >
                Sign Up
                {tab === 'signup' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-spice" />
                )}
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {tab === 'signup' && (
                <div>
                  <label className="block font-inter text-[11px] tracking-[2px] uppercase text-stone mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Arjun Singh"
                    className="bg-white/60 border border-linen-dark/50 focus:border-amber-spice outline-none px-4 py-3 w-full text-charcoal placeholder:text-stone/40 font-inter transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block font-inter text-[11px] tracking-[2px] uppercase text-stone mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="bg-white/60 border border-linen-dark/50 focus:border-amber-spice outline-none px-4 py-3 w-full text-charcoal placeholder:text-stone/40 font-inter transition-all"
                />
              </div>
              <div>
                <label className="block font-inter text-[11px] tracking-[2px] uppercase text-stone mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-white/60 border border-linen-dark/50 focus:border-amber-spice outline-none px-4 py-3 w-full text-charcoal placeholder:text-stone/40 font-inter transition-all"
                />
              </div>

              <button className="w-full bg-charcoal text-cream py-4 text-[12px] tracking-[3px] uppercase font-medium hover:bg-amber-spice hover:text-charcoal transition-all duration-300 mt-4">
                {tab === 'login' ? 'Proceed' : 'Create Account'}
              </button>

              <p className="text-center text-[12px] text-stone font-light">
                {tab === 'login' ? (
                  <>Don't have an account? <button onClick={() => setTab('signup')} className="text-charcoal font-medium hover:underline">Sign up</button></>
                ) : (
                  <>Already have an account? <button onClick={() => setTab('login')} className="text-charcoal font-medium hover:underline">Log in</button></>
                )}
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
