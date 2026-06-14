'use client'
import { useState, useEffect } from 'react'
import { User, ShoppingBag, Menu, X, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react'
import { Session } from '@supabase/supabase-js'
import { useLenis } from './SmoothScroll'

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
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      if (mobileOpen) {
        lenis.stop()
      } else {
        lenis.start()
      }
    } else {
      if (mobileOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
  }, [mobileOpen, lenis])

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
    { href: '/gallery', label: 'Gallery' },
    { href: '/catering', label: 'Catering' },
    { href: '/contact', label: 'Contact' },
  ]

  const isHome = location.pathname === '/'
  const isAbout = location.pathname === '/about'
  const isMenu = location.pathname === '/menu'
  const dynamicColor = (isHome || isAbout) ? '#B7A68B' : (isMenu ? '#000000' : '#49453b')

  return (
    <>
      {/* Mobile-Only Header - Vertical Stack matching Tamasha layout */}
      <header
        className="md:hidden relative z-50 bg-black border-b border-linen-dark/10 pt-18 pb-10 px-6 flex flex-col items-center gap-10"
      >
        {/* Absolute top row for Profile and Cart */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
          {/* User Profile / Login */}
          <div>
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)} 
                  aria-label="Profile" 
                  className="p-1 hover:opacity-80 transition-opacity flex items-center justify-center"
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
                      className="absolute top-full left-0 mt-2 bg-linen border border-linen-dark p-2 min-w-[160px] z-50 flex flex-col shadow-xl"
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
              <button onClick={onLoginClick} aria-label="Login" title="Login" className="p-1 hover:text-amber-spice transition-colors text-cream">
                <User size={20} />
              </button>
            )}
          </div>

          {/* Cart */}
          <button onClick={onCartClick} aria-label="Cart" className="relative p-1 hover:text-amber-spice transition-colors text-cream">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-spice text-charcoal text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* 1. Logo (in normal flow, naturally below the absolute top row, with extra margin top) */}
        <Link to="/" className="flex flex-col items-center mt-3 z-10">
          <div
            style={{
              width: '140px',
              height: '56px',
              backgroundColor: '#D49653',
              mask: "url('/officiallogo.png') no-repeat center",
              WebkitMask: "url('/officiallogo.png') no-repeat center",
              maskSize: 'contain',
              WebkitMaskSize: 'contain'
            }}
            aria-label="CLOVE Logo"
          />
        </Link>

        {/* 2. Reservations Button */}
        <div className="w-full flex justify-center z-10">
          <Link to="/menu"
            className="border border-cream/40 text-cream px-10 py-3 text-[10px] tracking-[3px] uppercase font-medium hover:border-amber-spice hover:text-amber-spice transition-all duration-300">
            RESERVATION
          </Link>
        </div>

        {/* 3. Centered Hamburger Menu / Close Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-cream hover:text-amber-spice z-10" aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Inline Mobile Menu Items */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full flex flex-col overflow-hidden bg-charcoal border-t border-linen-dark/10 mt-2 z-10"
            >
              {/* Option 1: ABOUT US (Amber Spice/Gold Background) */}
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-amber-spice text-charcoal py-4.5 px-8 font-inter text-[12px] font-bold tracking-[3px] uppercase hover:bg-amber-deep transition-colors text-left"
              >
                ABOUT US
              </Link>

              {/* Option 2: MENU */}
              <Link
                to="/menu"
                onClick={() => setMobileOpen(false)}
                className="w-full text-cream py-4.5 px-8 font-inter text-[12px] font-semibold tracking-[3px] uppercase border-b border-linen-dark/5 hover:bg-white/5 transition-colors text-left"
              >
                MENU
              </Link>

              {/* Option 3: GALLERY */}
              <Link
                to="/gallery"
                onClick={() => setMobileOpen(false)}
                className="w-full text-cream py-4.5 px-8 font-inter text-[12px] font-semibold tracking-[3px] uppercase border-b border-linen-dark/5 hover:bg-white/5 transition-colors text-left"
              >
                GALLERY
              </Link>

              {/* Option 4: CATERING */}
              <Link
                to="/catering"
                onClick={() => setMobileOpen(false)}
                className="w-full text-cream py-4.5 px-8 font-inter text-[12px] font-semibold tracking-[3px] uppercase border-b border-linen-dark/5 hover:bg-white/5 transition-colors text-left"
              >
                CATERING
              </Link>

              {/* Option 5: CONTACT */}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full text-cream py-4.5 px-8 font-inter text-[12px] font-semibold tracking-[3px] uppercase border-b border-linen-dark/5 hover:bg-white/5 transition-colors text-left"
              >
                CONTACT
              </Link>

              {/* Option 4: PROFILE / LOGIN */}
              {session ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-cream py-4.5 px-8 font-inter text-[12px] font-semibold tracking-[3px] uppercase border-b border-linen-dark/5 hover:bg-white/5 transition-colors text-left"
                >
                  MY PROFILE
                </Link>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setMobileOpen(false); }}
                  className="w-full text-cream py-4.5 px-8 font-inter text-[12px] font-semibold tracking-[3px] uppercase border-b border-linen-dark/5 hover:bg-white/5 transition-colors text-left"
                >
                  LOGIN
                </button>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop-Only Header - Original clean style */}
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block fixed top-0 left-0 right-0 z-50"
        style={{ 
          backgroundColor: isMenu ? '#000000' : 'transparent', 
          borderBottom: isMenu ? '1px solid rgba(229, 169, 59, 0.15)' : 'none' 
        }}
      >
        <div className="max-w-[1400px] mx-auto px-10 h-[76px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div
              style={{
                width: '95px',
                height: '38px',
                backgroundColor: '#D49653',
                mask: "url('/officiallogo.png') no-repeat center",
                WebkitMask: "url('/officiallogo.png') no-repeat center",
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                transition: 'all 0.3s'
              }}
              aria-label="CLOVE Logo"
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
          </div>
        </div>
      </motion.header>


    </>
  )
}
