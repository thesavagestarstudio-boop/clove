'use client'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {

    // Title reveal
    gsap.fromTo('.hero-title',
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        delay: 0,
        ease: 'power3.out'
      }
    )

    // Buttons reveal
    gsap.fromTo('.hero-buttons',
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out'
      }
    )

    // Parallax hero image
    gsap.to('.hero-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // Welcome Section animations
    gsap.fromTo('.welcome-title',
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.welcome-section',
          start: 'top 95%',
        }
      }
    )

    gsap.fromTo('.welcome-line',
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.welcome-section',
          start: 'top 95%',
        }
      }
    )

    gsap.fromTo('.welcome-card',
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.welcome-section',
          start: 'top 85%',
        }
      }
    )

    // Vision Section animations
    gsap.fromTo('.vision-title',
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.vision-section',
          start: 'top 75%',
        }
      }
    )

    gsap.fromTo('.vision-line',
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.vision-section',
          start: 'top 75%',
        }
      }
    )

    gsap.fromTo('.vision-card',
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.vision-section',
          start: 'top 65%',
        }
      }
    )

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 1000)

    return () => clearTimeout(timer)
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* Pattern Section above Hero */}
      <div className="w-full h-7 bg-black overflow-hidden relative border-b border-linen-dark/15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="arch-pattern-top-hero" width="54" height="28" patternUnits="userSpaceOnUse">
              {/* Background */}
              <rect width="54" height="28" fill="#000000" />
              
              {/* Dense vertical thin golden lines */}
              {Array.from({ length: 27 }).map((_, i) => (
                <line
                  key={i}
                  x1={i * 2}
                  y1="0"
                  x2={i * 2}
                  y2="28"
                  stroke="#D49653"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              
              {/* Concentric Arches pointing upwards */}
              <circle cx="27" cy="28" r="27" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="22" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="17" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="12" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="7" stroke="#D49653" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-pattern-top-hero)" />
        </svg>
      </div>

      {/* SECTION 1 — HERO */}
      <section ref={heroRef} className="relative h-[55vh] md:h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/ChickenTikkaTrilogy.jpg"
            alt="CLOVE cuisine"
            className="hero-img w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-black/80 md:bg-charcoal/65" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto [perspective:1200px] -translate-y-6 md:translate-y-0">
          <h1 className="font-script leading-[1.1] mb-8 select-none hero-title"
              style={{ fontSize: 'clamp(54px, 8.5vw, 110px)', color: '#ffffff', textTransform: 'none' }}>
            Indian Fusion Restaurant
          </h1>
          <div className="hero-buttons flex gap-4 justify-center flex-wrap">
            {/* Mobile: ABOUT US (Golden) */}
            <Link to="/about"
              className="md:hidden bg-amber-spice text-charcoal px-7 py-3.5 text-[11px] tracking-[3px] uppercase font-medium hover:bg-amber-deep transition-colors duration-300">
              ABOUT US
            </Link>
            {/* Desktop: Order Pickup */}
            <Link to="/menu"
              className="hidden md:inline-block bg-amber-spice text-charcoal px-7 py-3.5 text-[11px] tracking-[3px] uppercase font-medium hover:bg-amber-deep transition-colors duration-300">
              Order Pickup
            </Link>
            {/* Explore Menu / EXPLORE MENU */}
            <Link to="/menu"
              className="border border-cream/50 text-cream px-7 py-3.5 text-[11px] tracking-[3px] uppercase font-medium hover:border-amber-spice hover:text-amber-spice transition-all duration-300">
              <span className="md:hidden">EXPLORE MENU</span>
              <span className="hidden md:inline">Explore Menu</span>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-cream/30 text-[10px] tracking-[3px] uppercase font-inter">Scroll</span>
          <div className="w-px h-14 bg-gradient-to-b from-amber-spice/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Pattern Section below Hero */}
      <div className="w-full h-7 bg-black overflow-hidden relative border-t border-b border-linen-dark/15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="arch-pattern" width="54" height="28" patternUnits="userSpaceOnUse">
              {/* Background */}
              <rect width="54" height="28" fill="#000000" />
              
              {/* Dense vertical thin golden lines */}
              {Array.from({ length: 27 }).map((_, i) => (
                <line
                  key={i}
                  x1={i * 2}
                  y1="0"
                  x2={i * 2}
                  y2="28"
                  stroke="#D49653"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              
              {/* Concentric Arches pointing downwards */}
              <circle cx="27" cy="0" r="27" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="22" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="17" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="12" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="7" stroke="#D49653" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-pattern)" />
        </svg>
      </div>

      {/* Welcome Section */}
      <section className="welcome-section w-full bg-black pt-14 pb-24 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* 2. Wavy lines pattern in the lower half (absolute, z-10) */}
        <svg 
          className="absolute bottom-0 right-0 z-10 pointer-events-none" 
          width="100%" 
          height="40%" 
          viewBox="0 0 1440 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Multiple parallel golden curved waves */}
          {Array.from({ length: 15 }).map((_, i) => {
            const offset = i * 15;
            return (
              <path
                key={i}
                d={`M -100 ${360 - offset} C 400 ${150 - offset}, 800 ${450 - offset}, 1600 ${200 - offset}`}
                stroke="#D49653"
                strokeWidth="1.8"
                fill="none"
                opacity="0.55"
              />
            );
          })}
        </svg>

        {/* 3. Welcome Cursive Text (relative, z-20) */}
        <h2 className="welcome-title relative font-script text-amber-spice select-none text-center z-20"
            style={{ fontSize: 'clamp(64px, 12vw, 110px)', textTransform: 'none', lineHeight: 1.1 }}>
          Welcome
        </h2>

        {/* 4. Solid straight gold line (relative, z-20) */}
        <div className="welcome-line origin-center relative w-[85%] max-w-[1000px] h-px bg-amber-spice/50 my-8 z-20" />

        {/* 5. Text container box with solid black background and white text (relative, z-20) */}
        <div className="welcome-card relative w-full max-w-[650px] bg-[#0c0c0c] border border-linen-dark/15 px-6 sm:px-10 py-10 z-20 shadow-2xl">
          <div className="font-inter text-cream/90 text-[14px] leading-[1.8] text-left font-normal tracking-[0.5px]">
            <p className="mb-6">
              Clove is an Indian fusion restaurant where tradition meets innovation, bringing together the rich flavors of India with contemporary culinary creativity.
            </p>
            <p>
              Inspired by the diversity of Indian cuisine and elevated with global influences, Clove offers a dining experience that is bold, vibrant, and unforgettable. From handcrafted cocktails and thoughtfully curated small plates to elevated signature entrées, every dish is designed to celebrate authentic flavors in a fresh, modern way.
            </p>
          </div>
        </div>
      </section>

      {/* Pattern Section below Welcome */}
      <div className="w-full h-7 bg-black overflow-hidden relative border-t border-b border-linen-dark/15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="arch-pattern-bottom" width="54" height="28" patternUnits="userSpaceOnUse">
              {/* Background */}
              <rect width="54" height="28" fill="#000000" />
              
              {/* Dense vertical thin golden lines */}
              {Array.from({ length: 27 }).map((_, i) => (
                <line
                  key={i}
                  x1={i * 2}
                  y1="0"
                  x2={i * 2}
                  y2="28"
                  stroke="#D49653"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              
              {/* Concentric Arches (centered at x=27, top y=0) - rotated/flipped downwards */}
              <circle cx="27" cy="0" r="27" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="22" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="17" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="12" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="7" stroke="#D49653" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-pattern-bottom)" />
        </svg>
      </div>

      {/* Dish Image Section */}
      <div className="w-full bg-black pt-12 pb-4 px-6 flex justify-center z-10 relative">
        <div className="w-full max-w-[650px] aspect-[4/3] overflow-hidden border border-linen-dark/15 shadow-2xl">
          <img
            src="/Paneer Triple Play .jpg"
            alt="Paneer Triple Play"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Our Vision Section */}
      <section className="vision-section w-full bg-black pt-14 pb-24 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Wavy lines pattern in the lower half (absolute, z-10) */}
        <svg 
          className="absolute bottom-0 right-0 z-10 pointer-events-none" 
          width="100%" 
          height="40%" 
          viewBox="0 0 1440 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Multiple parallel golden curved waves */}
          {Array.from({ length: 15 }).map((_, i) => {
            const offset = i * 15;
            return (
              <path
                key={i}
                d={`M -100 ${360 - offset} C 400 ${150 - offset}, 800 ${450 - offset}, 1600 ${200 - offset}`}
                stroke="#D49653"
                strokeWidth="1.8"
                fill="none"
                opacity="0.55"
              />
            );
          })}
        </svg>

        {/* Our Vision Cursive Text (relative, z-20) */}
        <h2 className="vision-title relative font-script text-amber-spice select-none text-center z-20"
            style={{ fontSize: 'clamp(64px, 12vw, 110px)', textTransform: 'none', lineHeight: 1.1 }}>
          Our Vision
        </h2>

        {/* Solid straight gold line (relative, z-20) */}
        <div className="vision-line origin-center relative w-[85%] max-w-[1000px] h-px bg-amber-spice/50 my-8 z-20" />

        {/* Text container box (relative, z-20) */}
        <div className="vision-card relative w-full max-w-[650px] bg-[#0c0c0c] border border-linen-dark/15 px-6 sm:px-10 py-10 z-20 shadow-2xl">
          <div className="font-inter text-cream/90 text-[14px] leading-[1.8] text-left font-normal tracking-[0.5px]">
            <p>
              At Clove, we believe dining is more than just food — it is an experience. Our vision is to create a space where culture, community, music, hospitality, and exceptional cuisine come together seamlessly. Whether you are joining us for an intimate dinner, a lively night out, or a special celebration, Clove delivers an atmosphere that is stylish, energetic, and welcoming.
            </p>
          </div>
        </div>
      </section>

      {/* Pattern Section below Our Vision */}
      <div className="w-full h-7 bg-black overflow-hidden relative border-t border-b border-linen-dark/15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="arch-pattern-bottom-2" width="54" height="28" patternUnits="userSpaceOnUse">
              {/* Background */}
              <rect width="54" height="28" fill="#000000" />
              
              {/* Dense vertical thin golden lines */}
              {Array.from({ length: 27 }).map((_, i) => (
                <line
                  key={i}
                  x1={i * 2}
                  y1="0"
                  x2={i * 2}
                  y2="28"
                  stroke="#D49653"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              
              {/* Concentric Arches (centered at x=27, top y=0) - rotated/flipped downwards */}
              <circle cx="27" cy="0" r="27" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="22" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="17" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="12" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="0" r="7" stroke="#D49653" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-pattern-bottom-2)" />
        </svg>
      </div>

    </div>
  )
}
