'use client'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'motion/react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.div
      ref={containerRef}
      className="bg-black text-white overflow-x-hidden min-h-screen pt-[76px] md:pt-0"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');
        .script-font {
          font-family: 'Alex Brush', cursive;
        }
      `}</style>

      {/* Mobile-Only Header Block */}
      <div className="md:hidden flex flex-col items-center w-full px-6 pt-32 pb-8">
        {/* Logo */}
        <Link to="/" className="mb-12">
          <img
            src="/officiallogo.png"
            alt="CLOVE Logo"
            className="h-[38px] w-auto object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(67%) sepia(35%) saturate(836%) hue-rotate(352deg) brightness(91%) contrast(87%)' }}
          />
        </Link>

        {/* Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-3 text-white focus:outline-none flex items-center justify-center transition-transform active:scale-95 z-50"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Expanded Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full flex flex-col items-center mt-6 overflow-hidden z-40"
            >
              <div className="w-full bg-[#111111] border border-white/5 rounded-xl flex flex-col items-center py-2">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-4 text-[13px] tracking-[4px] uppercase text-white hover:text-[#D49653] transition-colors border-b border-white/5"
                >
                  Home
                </Link>
                <Link 
                  to="/menu" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-4 text-[13px] tracking-[4px] uppercase text-white hover:text-[#D49653] transition-colors border-b border-white/5"
                >
                  Menu
                </Link>
                <Link 
                  to="/catering" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-4 text-[13px] tracking-[4px] uppercase text-white hover:text-[#D49653] transition-colors border-b border-white/5"
                >
                  Catering
                </Link>
                <Link 
                  to="/gallery" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-4 text-[13px] tracking-[4px] uppercase text-white hover:text-[#D49653] transition-colors"
                >
                  Gallery
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* About Us section (Mobile & Desktop) */}
      <div className="relative w-full h-[160px] md:h-[260px] flex items-center justify-center overflow-hidden bg-black mt-8 md:mt-24">
        {/* Custom Gold Waves SVG Mesh */}
        <svg className="absolute inset-0 w-full h-full text-[#D49653] opacity-35" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
          <path d="M0,150 C360,50 720,250 1080,150 C1260,100 1380,200 1440,150" stroke="currentColor" strokeWidth="1" />
          <path d="M0,180 C240,100 640,220 960,140 C1200,80 1380,220 1440,180" stroke="currentColor" strokeWidth="0.75" />
          <path d="M0,120 C480,200 960,80 1440,120" stroke="currentColor" strokeWidth="1.2" />
          <path d="M0,140 C360,240 720,40 1080,140 C1260,190 1380,90 1440,140" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0,160 C300,100 600,200 900,150 C1200,100 1320,180 1440,160" stroke="currentColor" strokeWidth="0.8" />
        </svg>

        {/* Text Overlapping Waves */}
        <h2 className="relative z-10 text-[76px] md:text-[130px] text-[#D49653] script-font select-none flex justify-center items-center">
          {"About Us".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 40, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 1.0,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block origin-center"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h2>
      </div>

      {/* Gold Pattern Divider */}
      <GoldPattern />

      {/* Chef & Culinary Vision Content Section (Responsive Desktop Split Grid) */}
      <div className="w-full bg-black py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-20">
          
          {/* Left Side: Chef Image */}
          <div className="w-full md:w-[650px] aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-2xl md:rounded-none flex-shrink-0">
            <img
              src="/CHEF.jpeg"
              alt="Chef Parveen K. Sharma"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Right Side: Details & Story Block */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[450px] md:max-w-[500px]">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-[48px] md:text-[56px] text-[#D49653] script-font select-none leading-none flex flex-wrap justify-center md:justify-start"
            >
              {"Meet Executive Chef".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30, rotate: -5 },
                    visible: { opacity: 1, y: 0, rotate: 0 }
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.04,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block origin-center"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h2>
            <div className="w-16 h-[1px] bg-[#D49653]/60 mt-3 mb-8 md:mx-0 mx-auto" />
            
            <h3 className="font-sans text-[24px] md:text-[28px] font-light text-white tracking-wide">
              Parveen K. Sharma
            </h3>
            <p className="font-inter text-[11px] tracking-[2.5px] uppercase text-[#D49653] font-semibold mt-3 mb-10">
              internationally experienced chef
            </p>

            {/* Chef Story Block */}
            <div className="w-full bg-[#111111] border-[0.5px] border-[#D49653]/10 rounded-2xl py-6 px-6 relative overflow-hidden text-left">
              <h4 className="text-[34px] md:text-[38px] text-[#D49653] script-font mb-6 select-none leading-none">Culinary Vision</h4>
              <div className="font-inter text-[14px] text-white/80 font-extralight leading-[1.8] space-y-4">
                <p>
                  An internationally experienced chef and culinary visionary known for blending authentic Indian flavors with refined modern presentation.
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
              {/* Gold line graphic accents at the bottom right */}
              <div className="absolute -bottom-6 -right-6 w-28 h-28 opacity-20 pointer-events-none">
                <svg className="w-full h-full text-[#D49653]" viewBox="0 0 100 100" fill="none">
                  <path d="M0,100 C30,70 70,70 100,50 M0,90 C30,60 70,60 100,40 M0,80 C30,50 70,50 100,30" stroke="currentColor" strokeWidth="0.75" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Gold Pattern Divider */}
      <GoldPattern />
    </motion.div>
  )
}
