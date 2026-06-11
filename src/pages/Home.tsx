import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Utensils, Flame, Heart, Leaf } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const sigRef = useRef<HTMLDivElement>(null)
  const philRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showWelcome) return
    
    let isMounted = true
    const navTimeout = setTimeout(() => {
      if (isMounted) {
        navigate('/menu')
      }
    }, 2000)
    
    return () => {
      isMounted = false
      clearTimeout(navTimeout)
    }
  }, [showWelcome, navigate])

  useGSAP(() => {
    if (!showWelcome) return
    gsap.fromTo('#mask-path',
      { strokeDashoffset: 600 },
      {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: 'power2.out',
      }
    )
  }, { dependencies: [showWelcome], scope: containerRef })

  const handleExploreMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowWelcome(true)
  }

  useGSAP(() => {
    // Hero Animations — 3D letter reveal
    gsap.fromTo('.hero-letter', 
      {
        y: 80,
        rotateX: -85,
        opacity: 0,
      },
      {
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.04,
        ease: 'power4.out',
        transformOrigin: 'center bottom -30px'
      }
    )

    // Buttons reveal
    gsap.fromTo('.hero-reveal',
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.7,
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

    // General reveals
    const reveals = gsap.utils.toArray('.reveal') as HTMLElement[]
    reveals.forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      })
    })

    // Banner letter reveal
    const bannerLetterContainers = gsap.utils.toArray('.banner-letters') as HTMLElement[]
    bannerLetterContainers.forEach((container) => {
      gsap.from(container.querySelectorAll('.banner-letter'), {
        y: 50,
        rotateX: -45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.02,
        ease: 'power3.out',
        transformOrigin: 'center bottom -20px',
        scrollTrigger: {
          trigger: container,
          start: 'top 95%',
        }
      })
    })

    // Slide animations
    gsap.from('.slide-l', {
      x: -80,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sigRef.current,
        start: 'top 75%'
      }
    })

    gsap.from('.slide-r', {
      x: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sigRef.current,
        start: 'top 75%'
      }
    })

  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* SECTION 1 — HERO */}
      <section ref={heroRef} className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/ChickenTikkaTrilogy.jpg"
            alt="CLOVE cuisine"
            className="hero-img w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-charcoal/65" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto [perspective:1200px]">
          <h1 className="font-playfair font-normal uppercase leading-[1.05] mb-8 select-none [transform-style:preserve-3d]"
              style={{ fontSize: 'clamp(38px, 7.5vw, 80px)', color: '#FFFFFF' }}>
            {['Indian', 'Fusion', 'Restaurant.'].map((word, wi) => (
              <span key={wi} className="block">
                {word.split('').map((char, ci) => (
                  <span key={ci} className="inline-block hero-letter origin-bottom">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <div className="hero-reveal flex gap-4 justify-center flex-wrap">
            <Link to="/about"
              className="bg-[#00503D] text-white px-7 py-3.5 text-[11px] tracking-[3px] uppercase font-medium hover:bg-[#00674F] transition-colors duration-300">
              ABOUT US
            </Link>
            <button
              onClick={handleExploreMenuClick}
              className="border border-cream/50 text-cream px-7 py-3.5 text-[11px] tracking-[3px] uppercase font-medium hover:border-[#00BC90] hover:text-[#00BC90] transition-all duration-300 cursor-pointer">
              Explore Menu
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-cream/30 text-[10px] tracking-[3px] uppercase font-inter">Scroll</span>
          <div className="w-px h-14 bg-gradient-to-b from-[#00503D]/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* SECTION 2 — SIGNATURE CURRIES */}
      <section ref={sigRef} className="flex min-h-[680px] flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-[#00503D] px-8 sm:px-14 py-20 flex flex-col justify-center slide-l">
          <div className="flex flex-col mb-10">
            <div className="flex items-start justify-between">
              <h2 className="font-playfair font-black uppercase text-white leading-[0.9]"
                  style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}>
                Signature<br/>Curries
              </h2>
              <Utensils size={28} className="text-white/30 mt-2 flex-shrink-0" />
            </div>
            <p className="font-inter text-[14px] tracking-[4px] uppercase text-white/70 mt-6 font-bold">
              Vegetarian (11)
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2">
            {[
              { name: 'Clove Dal Makhani', price: '16.00', desc: 'Slow-cooked creamy black lentils' },
              { name: 'Golden Dal Tadka', price: '15.00', desc: 'Yellow lentils with garlic temper' },
              { name: 'Signature Veg Nargisi Kofta Curry', price: '18.00' },
              { name: 'Emerald Palak Paneer', price: '17.00', desc: 'Paneer in creamy spinach curry' },
              { name: 'Punjabi Chana Masala', price: '15.00', desc: 'Chickpeas in bold spiced gravy' },
              { name: 'Rajasthani Bhindi', price: '16.00' },
              { name: 'Paneer Butter Velvet', price: '18.00' },
              { name: 'Paneer Methi Malai', price: '18.00' },
              { name: 'Karahi Paneer', price: '17.00' },
              { name: 'Kashmiri Baingan Khatte', price: '16.00' },
              { name: 'Sev Subzi', price: '15.00' },
            ].map(dish => (
              <div key={dish.name} className="py-7 border-b border-white/12">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-inter font-semibold text-[17px] text-white">{dish.name}</span>
                  <span className="font-playfair font-bold text-[17px] text-white flex-shrink-0">${dish.price}</span>
                </div>
                {dish.desc && (
                  <p className="font-inter text-[13px] text-white/80 font-medium mt-1.5 leading-[1.4]">{dish.desc}</p>
                )}
              </div>
            ))}
          </div>
          
          <Link to="/menu"
            className="mt-8 self-start border border-white text-white px-6 py-3 text-[11px] tracking-[3px] uppercase font-medium hover:bg-white hover:text-[#00503D] transition-all duration-300">
            View Full Menu
          </Link>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col slide-r">
          {/* Text block */}
          <div className="bg-linen px-8 sm:px-14 py-10 flex flex-col justify-center flex-1">
            <p className="font-inter text-[11px] tracking-[4px] uppercase text-amber-deep mb-5">Our Story</p>
            <h2 className="font-playfair font-black uppercase text-charcoal leading-[0.92] mb-8"
                style={{ fontSize: 'clamp(28px, 3.2vw, 50px)' }}>
              Signature<br/>Dishes.<br/>Classic Roots.
            </h2>
            <p className="font-inter text-[15px] text-stone font-normal leading-[1.9] max-w-[480px]">
              Inspired by the diversity of Indian cuisine and elevated with global influences, Clove offers a dining experience that is bold, vibrant, and unforgettable. From handcrafted cocktails and thoughtfully curated small plates to elevated signature entrées, every dish is designed to celebrate authentic flavors in a fresh, modern way.
            </p>
          </div>
          {/* Image block */}
          <div className="h-[400px] md:h-[480px] relative overflow-hidden flex-shrink-0">
            <img
              src="/CloveDalMakhani.jpg"
              alt="Signature dish"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 will-change-transform"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3 — PHILOSOPHY */}
      <section ref={philRef} className="bg-charcoal flex min-h-[580px] flex-col md:flex-row">
        <div className="w-full md:w-1/2 px-8 sm:px-16 py-20 flex flex-col justify-center slide-l md:order-1">
          <h2 className="reveal font-playfair text-[28px] sm:text-[36px] font-bold text-cream leading-[1.3] mb-6 max-w-[500px] uppercase">
            At Clove, we believe dining is more than just food — it is an experience.
          </h2>
          <p className="reveal font-inter text-[16px] text-cream-dim font-normal leading-[1.9] mb-8 max-w-[480px]">
            Our vision is to create a space where culture, community, music, hospitality, and exceptional cuisine come together seamlessly. Whether you are joining us for an intimate dinner, a lively night out, or a special celebration, Clove delivers an atmosphere that is stylish, energetic, and welcoming.
          </p>
          <Link to="/about"
            className="reveal flex items-center gap-3 text-amber-spice text-[12px] tracking-[3px] uppercase font-medium font-inter group w-fit">
            Our Story
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
        
        <div className="w-full md:w-1/2 h-[400px] md:h-auto relative flex items-center justify-center bg-charcoal-mid p-8 sm:p-14 slide-r md:order-2">
          <div className="relative w-full max-w-[400px]">
            <div className="absolute inset-0 border border-amber-spice/40 translate-x-5 translate-y-5 pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=85"
              alt="CLOVE restaurant"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover relative z-10 will-change-transform"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 — SIGNATURE COLLECTION */}
      <section ref={colRef} className="bg-[#00503D] px-8 sm:px-16 py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-14 gap-8 flex-wrap">
            <div>
              <div className="flex items-center gap-4">
                <h2 className="reveal font-playfair text-[32px] sm:text-[44px] font-bold text-white leading-[1.05] uppercase">
                  SIGNATURE CURRIES
                </h2>
                <Utensils size={28} className="text-white/30 flex-shrink-0 mt-1 reveal" />
              </div>
              <p className="reveal font-inter text-[14px] tracking-[4px] uppercase text-white/70 mt-4 mb-2 font-bold">NON VEGETARIAN (9)</p>
            </div>
            <Link to="/menu"
              className="border border-white text-white px-5 py-2.5 text-[11px] tracking-[2px] uppercase font-medium font-inter hover:bg-white hover:text-[#00503D] transition-all duration-300 whitespace-nowrap flex-shrink-0">
              View Full Menu
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2">
            {[
              { name: 'Clove Butter Chicken', price: '18.00' },
              { name: 'Murgh Shahjahani', price: '19.00' },
              { name: 'Kebab Chicken Tikka Masala', price: '18.00' },
              { name: 'Patrani Machi with Malabar Curry', price: '20.00' },
              { name: 'Rajasthani Laal Maas', price: '20.00' },
              { name: 'Goat Curry', price: '22.00' },
              { name: 'Dhaba Chicken Curry - Boneless', price: '18.00' },
              { name: 'Kadai Fire Chicken', price: '18.00', desc: 'Chicken with peppers and bold spices' },
              { name: 'Asian Shrimp Curry', price: '20.00' },
            ].map((dish, i) => (
              <div key={i} className="py-7 border-b border-white/12">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-inter font-semibold text-[17px] text-white">{dish.name}</span>
                  <span className="font-playfair font-bold text-[17px] text-white flex-shrink-0">${dish.price}</span>
                </div>
                {dish.desc && (
                  <p className="font-inter text-[13px] text-white/80 font-medium mt-1.5 leading-[1.4]">{dish.desc}</p>
                )}
              </div>
            ))}
          </div>

          {/* SUBSECTION — SIGNATURE BREAD */}
          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="flex items-end justify-between mb-10 gap-8 flex-wrap">
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="reveal font-playfair text-[32px] sm:text-[44px] font-bold text-white leading-[1.05] uppercase">
                    SIGNATURE BREAD
                  </h2>
                  <Utensils size={28} className="text-white/30 flex-shrink-0 mt-1 reveal" />
                </div>
                <p className="reveal font-inter text-[14px] tracking-[4px] uppercase text-white/70 mt-4 font-bold">
                  SIGNATURE BREAD (8)
                </p>
              </div>
              <Link to="/menu"
                className="border border-white text-white px-5 py-2.5 text-[11px] tracking-[2px] uppercase font-medium font-inter hover:bg-white hover:text-[#00503D] transition-all duration-300 whitespace-nowrap flex-shrink-0">
                View Full Menu
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2">
              {[
                { name: 'Classic Naan', price: '3.00' },
                { name: 'Butter Naan', price: '4.00' },
                { name: 'Garlic Naan', price: '4.00' },
                { name: 'Bullet Naan', price: '5.00' },
                { name: 'Tandoori Roti', price: '3.00' },
                { name: 'Masala Dhaniya Mirchi Roti', price: '5.00' },
                { name: 'Potatoes Stuffed Parantha (Amrtisari)', price: '7.00' },
                { name: 'Goat Cheese, Herbs & Jalapeño', price: '8.00' },
              ].map((dish, i) => (
                <div key={i} className="py-7 border-b border-white/12">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="font-inter font-semibold text-[17px] text-white">{dish.name}</span>
                    <span className="font-playfair font-bold text-[17px] text-white flex-shrink-0">${dish.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBSECTION — RICE & ACCOMPANIMENTS */}
          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="flex items-end justify-between mb-10 gap-8 flex-wrap">
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="reveal font-playfair text-[32px] sm:text-[44px] font-bold text-white leading-[1.05] uppercase">
                    RICE & ACCOMPANIMENTS
                  </h2>
                  <Utensils size={28} className="text-white/30 flex-shrink-0 mt-1 reveal" />
                </div>
                <p className="reveal font-inter text-[14px] tracking-[4px] uppercase text-white/70 mt-4 font-bold">
                  RICE & ACCOMPANIMENTS (5)
                </p>
              </div>
              <Link to="/menu"
                className="border border-white text-white px-5 py-2.5 text-[11px] tracking-[2px] uppercase font-medium font-inter hover:bg-white hover:text-[#00503D] transition-all duration-300 whitespace-nowrap flex-shrink-0">
                View Full Menu
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2">
              {[
                { name: 'Jeera Rice', price: '5.00' },
                { name: 'Vegetable Pulao', price: '6.00' },
                { name: 'Toasted Garlic Herb Bread', price: '5.00' },
                { name: 'Mint & Cucumber Raita', price: '4.00' },
                { name: 'Seasoned Potato', price: '4.00' },
              ].map((dish, i) => (
                <div key={i} className="py-7 border-b border-white/12">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="font-inter font-semibold text-[17px] text-white">{dish.name}</span>
                    <span className="font-playfair font-bold text-[17px] text-white flex-shrink-0">${dish.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — TWO BROTHERS EDITORIAL BANNER */}
      <section className="bg-amber-spice py-20 px-8 text-center overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-playfair font-bold text-charcoal leading-[1.1] mb-6 banner-letters uppercase"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            {'LOCATED IN DULUTH, GEORGIA, CLOVE.'.split(' ').map((word, wordIndex, arr) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0">
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex} className="banner-letter inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="font-inter text-[16px] text-stone font-normal max-w-2xl mx-auto leading-[1.9] mb-10 reveal">
            Our culinary team combines traditional Indian techniques with contemporary presentation to craft dishes that feel both familiar and exciting. Every ingredient, flavor, and detail is thoughtfully chosen to create a modern interpretation of Indian dining.
          </p>
          <Link to="/about"
            className="inline-block bg-charcoal text-cream px-10 py-4 text-[12px] tracking-[3px] uppercase font-medium hover:bg-charcoal-mid transition-colors duration-300 reveal">
            Our Story
          </Link>
        </div>
      </section>


      {showWelcome && (
        <div className="fixed inset-0 bg-[#00503D] z-[9999] flex items-center justify-center animate-fadeIn">
          <svg viewBox="0 0 600 150" className="w-[320px] sm:w-[500px] h-auto select-none">
            <defs>
              <mask id="brush-mask" maskUnits="userSpaceOnUse">
                <path
                  id="mask-path"
                  d="M 10,75 Q 300,65 590,75"
                  fill="none"
                  stroke="white"
                  strokeWidth="110"
                  strokeLinecap="round"
                  strokeDasharray="600"
                  strokeDashoffset="600"
                />
              </mask>
            </defs>
            <text
              x="50%"
              y="58%"
              dominantBaseline="middle"
              textAnchor="middle"
              mask="url(#brush-mask)"
              className="font-pacifico fill-white text-[80px]"
            >
              Welcome
            </text>
          </svg>
        </div>
      )}
    </div>
  )
}
