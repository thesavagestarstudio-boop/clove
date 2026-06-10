'use client'
import { useState, useEffect } from 'react'
import { User, ShoppingBag, Menu, X, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react'
import { Session } from '@supabase/supabase-js'

interface HeaderProps {
  onLoginClick: () => void
  onLogoutClick: () => void
  onCartClick: () => void
  cartCount: number
  session: Session | null
}

export default function Header({ onLoginClick, onLogoutClick, onCartClick, cartCount, session }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (location.pathname === '/menu') {
      setHidden(false);
      return;
    }
    const previous = scrollY.getPrevious() ?? 0;
    const scrollingDown = latest > previous;
    const threshold = typeof window !== 'undefined' ? window.innerHeight : 0;
    if (scrollingDown) {
      setHidden(true);
    } else {
      // scrolling up: show only when within first viewport
      setHidden(latest > threshold);
    }
  })

  useEffect(() => {
    if (location.pathname === '/menu') {
      setHidden(false)
    }
  }, [location.pathname])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/menu', label: 'Menu' },
    { href: '/contact', label: 'Contact' },
  ]

  const isHome = location.pathname === '/'
  const isAbout = location.pathname === '/about'
  const isMenu = location.pathname === '/menu'
  const dynamicColor = (isHome || isAbout) ? '#B7A68B' : (isMenu ? '#000000' : '#49453b')

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: isMenu ? '#D8CBB8' : 'transparent' }}
      >
        <div className="max-w-[1400px] mx-auto px-10 h-[76px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/officiallogo.png"
              alt="CLOVE Logo"
              className="h-[38px] w-auto object-contain transition-all duration-300"
              style={{
                filter: (location.pathname === '/menu')
                  ? 'brightness(0)'
                  : 'none'
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={`font-inter text-[12px] tracking-[2.5px] uppercase transition-colors duration-300 relative group ${
                  location.pathname === link.href ? 'text-amber-spice' : 'hover:text-amber-spice'
                }`} style={{ color: location.pathname === link.href ? undefined : dynamicColor }}>
                {link.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-amber-spice transition-all duration-300 ${
                  location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)} 
                  aria-label="Profile" 
                  className="p-2.5 hover:opacity-80 transition-opacity flex items-center justify-center"
                >
                  {session.user?.user_metadata?.avatar_url ? (
                    <img 
                      src={session.user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-[22px] h-[22px] rounded-full object-cover shadow-sm border border-charcoal/10" 
                    />
                  ) : (
                    <div className="w-[22px] h-[22px] rounded-full bg-charcoal text-cream flex items-center justify-center text-[10px] font-bold">
                      {session.user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 bg-linen border border-linen-dark p-2 min-w-[160px] z-50 flex flex-col shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-linen-dark/50 mb-2">
                        <p className="text-[10px] uppercase tracking-[1px] text-stone">Signed in as</p>
                        <p className="text-[12px] font-medium text-charcoal truncate">{session.user?.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileMenuOpen(false)}
                        className="text-left px-4 py-2.5 text-[11px] tracking-[2px] uppercase text-charcoal hover:bg-amber-spice transition-colors flex items-center gap-3"
                      >
                        <User size={14} />
                        My Orders
                      </Link>
                      <button 
                        onClick={() => { onLogoutClick(); setProfileMenuOpen(false) }} 
                        className="text-left px-4 py-2.5 text-[11px] tracking-[2px] uppercase text-charcoal hover:bg-amber-spice transition-colors flex items-center gap-3"
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={onLoginClick} aria-label="Login" title="Login" className="p-2.5 hover:text-amber-spice transition-colors" style={{ color: dynamicColor }}>
                <User size={20} />
              </button>
            )}
            <button onClick={onCartClick} aria-label="Cart" className="relative p-2.5 hover:text-amber-spice transition-colors" style={{ color: dynamicColor }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-spice text-charcoal text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2.5" aria-label="Open menu" style={{ color: dynamicColor }}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen nav overlay */}
      <div className={`fixed inset-0 z-[100] bg-charcoal flex flex-col items-center justify-center transition-all duration-500 ${
        mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-cream/60 hover:text-amber-spice">
          <X size={24} />
        </button>
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
              className={`font-playfair italic text-[44px] transition-colors duration-300 ${
                location.pathname === link.href ? 'text-amber-spice' : 'text-cream hover:text-amber-spice'
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-12 flex gap-4">
          {session ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)}
                className="border border-linen-dark/40 text-cream px-6 py-3 text-[12px] tracking-[2px] uppercase">
                My Orders
              </Link>
              <button onClick={() => { onLogoutClick(); setMobileOpen(false) }}
                className="border border-linen-dark/40 text-cream px-6 py-3 text-[12px] tracking-[2px] uppercase">
                Log Out
              </button>
            </>
          ) : (
            <button onClick={() => { onLoginClick(); setMobileOpen(false) }}
              className="border border-linen-dark/40 text-cream px-6 py-3 text-[12px] tracking-[2px] uppercase">
              Log In
            </button>
          )}
          <Link to="/menu" onClick={() => setMobileOpen(false)}
            className="bg-amber-spice text-charcoal px-6 py-3 text-[12px] tracking-[2px] uppercase font-medium">
            Order Pickup
          </Link>
        </div>
      </div>
    </>
  )
}
