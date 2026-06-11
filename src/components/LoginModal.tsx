'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
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

  const handleGoogleLogin = async () => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
    } catch (error: any) {
      console.error('Login error:', error)
      alert("Login failed. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel, and add your Vercel domain to Supabase Auth redirect URLs.")
    }
  }

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
            className="bg-[#00503D] border border-white/10 max-w-[420px] w-full p-10 relative z-10 text-center rounded-2xl shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-cream/70 hover:text-cream transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-serif text-white mb-8">Welcome Back</h2>

            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-cream text-[#00503D] py-4 text-[12px] tracking-[3px] uppercase font-bold hover:bg-[#00392C] hover:text-white transition-all duration-300 rounded-lg shadow-md border border-transparent"
            >
              {/* Simple Google SVG Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
