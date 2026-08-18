'use client'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'

gsap.registerPlugin(ScrollTrigger)

const GoldArches = () => (
  <div className="flex justify-center items-center my-16 md:my-24 gap-1 opacity-80 select-none">
    <svg className="w-12 h-6 md:w-16 md:h-8 text-[#D49653]" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10,50 C25,10 75,10 90,50" />
    </svg>
    <svg className="w-16 h-8 md:w-24 md:h-12 text-[#D49653] -mx-3 md:-mx-4" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10,50 C25,5 75,5 90,50" />
    </svg>
    <svg className="w-12 h-6 md:w-16 md:h-8 text-[#D49653]" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10,50 C25,10 75,10 90,50" />
    </svg>
  </div>
)

const GoldPattern = () => {
  const patternWidth = 80
  const patternHeight = 60
  const cx = patternWidth / 2
  const cy = patternHeight
  const radii = [12, 20, 28, 36, 44, 52]
  
  // Generate vertical lines for a single pattern tile
  const lines = []
  const lineSpacing = 8
  for (let x = 0; x < patternWidth; x += lineSpacing) {
    lines.push(
      <line 
        key={x} 
        x1={x} 
        y1={0} 
        x2={x} 
        y2={patternHeight} 
        stroke="#D49653" 
        strokeWidth="1" 
        opacity="0.25" 
      />
    )
  }

  // Generate concentric arches for a single pattern tile
  const arches = radii.map((r, idx) => (
    <path
      key={idx}
      d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
      stroke="#D49653"
      strokeWidth="1.2"
      fill="none"
      opacity="0.65"
    />
  ))

  return (
    <div className="w-full h-[60px] bg-black relative overflow-hidden border-t border-b border-[#D49653]/15">
      <svg className="absolute inset-0 w-full h-full text-[#D49653]" fill="none">
        <defs>
          <pattern 
            id="gold-arch-pattern" 
            width={patternWidth} 
            height={patternHeight} 
            patternUnits="userSpaceOnUse"
          >
            {lines}
            {arches}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gold-arch-pattern)" />
      </svg>
    </div>
  )
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    // Reveal animation matching the homepage "Indian Fusion Restaurant" title exactly
    gsap.fromTo(titleRef.current,
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
          start: 'top 95%',
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
          start: 'top 95%',
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
          start: 'top 85%',
        }
      }
    )
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 1000)

    return () => clearTimeout(timer)
  }, { scope: containerRef })

  return (
    <motion.div
      ref={containerRef}
      className="bg-black min-h-screen text-cream overflow-x-hidden pt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Same Pattern Section used in homepage for transitions (Placed ABOVE, default orientation) */}
      <div className="w-full h-7 md:hidden bg-black overflow-hidden relative border-t border-b border-linen-dark/15 z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-arch-pattern-top" width="54" height="28" patternUnits="userSpaceOnUse">
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
              
              {/* Concentric Arches (centered at x=27, bottom y=28) */}
              <circle cx="27" cy="28" r="27" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="22" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="17" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="12" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="7" stroke="#D49653" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-arch-pattern-top)" />
        </svg>
      </div>

      {/* Hero Section with cropped background image height and golden script title */}
      <section className="relative h-[22vh] w-full flex items-center justify-center bg-black overflow-hidden select-none px-6">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Saffron Lamb-GheeNi Bites.jpg"
            alt="Saffron Lamb-GheeNi Bites"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Dark Overlay (set to 75% as requested) */}
          <div className="absolute inset-0 bg-black/75" />
        </div>

        {/* Golden cursive script title overlaid on the image */}
        <h1 
          ref={titleRef}
          className="relative font-script text-amber-spice text-center z-10 leading-[1.1] select-none"
          style={{ fontSize: 'clamp(70px, 12vw, 110px)', textTransform: 'none' }}
        >
          About Us
        </h1>

      </section>

      {/* Same Pattern Section used in homepage for transitions (Placed BELOW, rotated 180deg to point downwards) */}
      <div className="w-full h-7 bg-black overflow-hidden relative border-t border-b border-linen-dark/15 z-10 rotate-180">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-arch-pattern-bottom" width="54" height="28" patternUnits="userSpaceOnUse">
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
              
              {/* Concentric Arches (centered at x=27, bottom y=28) */}
              <circle cx="27" cy="28" r="27" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="22" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="17" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="12" stroke="#D49653" strokeWidth="1.2" fill="none" />
              <circle cx="27" cy="28" r="7" stroke="#D49653" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-arch-pattern-bottom)" />
        </svg>
      </div>

      {/* Chef Image Section */}
      <div className="w-full bg-black pt-12 pb-4 px-6 flex justify-center z-10 relative">
        <div className="w-full max-w-[650px] aspect-[4/3] overflow-hidden border border-linen-dark/15 shadow-2xl">
          <img
            src="/CHEF.jpeg"
            alt="Chef"
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Copied Our Vision Section */}
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

        {/* Chef Title Playfair Text (relative, z-20) */}
        <h2 className="vision-title relative font-playfair text-[26px] sm:text-[38px] font-bold text-amber-spice uppercase select-none text-center z-20 tracking-[2px] leading-[1.2]">
          Meet Executive Chef Parveen K. Sharma
        </h2>

        {/* Solid straight gold line (relative, z-20) */}
        <div className="vision-line origin-center relative w-[85%] max-w-[1000px] h-px bg-amber-spice/50 my-8 z-20" />

        {/* Text container box (relative, z-20) */}
        <div className="vision-card relative w-full max-w-[650px] bg-[#0c0c0c] border border-linen-dark/15 px-6 sm:px-10 py-10 z-20 shadow-2xl">
          <div className="font-inter text-cream/90 text-[14px] leading-[1.8] text-left font-normal tracking-[0.5px] space-y-6">
            <p>
              At the heart of Clove’s culinary experience is Executive Chef Parveen K. Sharma — an internationally experienced chef and culinary visionary known for blending authentic Indian flavors with refined modern presentation.
            </p>
            <p>
              With over two decades of experience across luxury hotels, acclaimed restaurant concepts, and global hospitality ventures, Chef Parveen has built a reputation for creating bold and memorable dining experiences rooted in tradition while embracing innovation.
            </p>
            <p>
              Originally from India, his culinary journey has taken him through renowned kitchens and leadership roles across the hospitality industry, where he has led culinary operations and developed elevated dining experiences inspired by the rich diversity of Indian cuisine. His expertise spans regional Indian specialties, contemporary fusion cuisine, and modern techniques tailored to today’s evolving palate.
            </p>
            <p>
              Chef Parveen’s philosophy centers on balancing flavor, creativity, and hospitality — transforming every dish into an experience that brings together culture, emotion, and community. He is also the author of The Food – A Journey of Taste, reflecting his passion for authentic recipes and culinary craftsmanship.
            </p>
            <p>
              At Clove, Chef Parveen K. Sharma brings a fresh and sophisticated vision to modern Indian dining — where authenticity meets innovation, and every plate is crafted to leave a lasting impression.
            </p>
          </div>
        </div>
      </section>

      {/* Pattern Section below Our Vision */}
      <div className="w-full h-7 bg-black overflow-hidden relative border-t border-b border-linen-dark/15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-arch-pattern-bottom-2" width="54" height="28" patternUnits="userSpaceOnUse">
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
          <rect width="100%" height="100%" fill="url(#about-arch-pattern-bottom-2)" />
        </svg>
      </div>

    </motion.div>
  )
}
