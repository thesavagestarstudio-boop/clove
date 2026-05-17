'use client'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Utensils, Flame, Heart, Leaf } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const sigRef = useRef<HTMLDivElement>(null)
  const philRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Hero Animations
    gsap.from('.hero-reveal', {
      y: 72,
      opacity: 0,
      duration: 1.3,
      stagger: 0.14,
      ease: 'power3.out'
    })

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
        y: 64,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
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
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&q=90"
            alt="CLOVE cuisine"
            className="hero-img w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-charcoal/65" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="hero-reveal font-playfair font-normal uppercase leading-[0.88] mb-8"
              style={{ fontSize: 'clamp(44px, 9vw, 100px)', color: '#b6a68b' }}>
            Modern<br/>Fusion.
          </h1>
          <div className="hero-reveal flex gap-4 justify-center flex-wrap">
            <Link to="/menu"
              className="bg-amber-spice text-charcoal px-7 py-3.5 text-[11px] tracking-[3px] uppercase font-medium hover:bg-amber-deep transition-colors duration-300">
              Order Pickup
            </Link>
            <Link to="/menu"
              className="border border-cream/50 text-cream px-7 py-3.5 text-[11px] tracking-[3px] uppercase font-medium hover:border-amber-spice hover:text-amber-spice transition-all duration-300">
              Explore Menu
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-cream/30 text-[10px] tracking-[3px] uppercase font-inter">Scroll</span>
          <div className="w-px h-14 bg-gradient-to-b from-amber-spice/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* SECTION 2 — SIGNATURE PLATES */}
      <section ref={sigRef} className="flex min-h-[680px] flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-amber-spice px-8 sm:px-14 py-20 flex flex-col justify-center slide-l">
          <div className="flex items-start justify-between mb-10">
            <h2 className="font-playfair font-black uppercase text-charcoal leading-[0.9]"
                style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}>
              Signature<br/>Plates
            </h2>
            <Utensils size={28} className="text-charcoal/30 mt-2 flex-shrink-0" />
          </div>
          
          <div className="divide-y divide-charcoal/12">
            {[
              { name: 'Variety Tray', price: '17.99', desc: 'Samosas, pakoras, bhujia — a celebratory spread for sharing' },
              { name: 'Butter Chicken', price: '18.99', desc: 'Tender chicken in a creamy, aromatic tomato sauce' },
              { name: 'Lamb Rogan Josh', price: '21.99', desc: 'Slow-braised lamb in rich yogurt and ginger gravy' },
              { name: 'Palak Paneer', price: '16.99', desc: 'Fresh cottage cheese in vibrant spinach and garlic purée' },
              { name: 'Chicken Tikka Masala', price: '19.99', desc: 'Char-grilled chicken in a robustly spiced masala sauce' },
            ].map(dish => (
              <div key={dish.name} className="py-5">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-inter font-semibold text-[17px] text-charcoal">{dish.name}</span>
                  <span className="font-playfair font-bold text-[17px] text-charcoal flex-shrink-0">${dish.price}</span>
                </div>
                <p className="font-inter text-[13px] text-stone font-light mt-1 leading-[1.6]">{dish.desc}</p>
              </div>
            ))}
          </div>
          
          <Link to="/menu"
            className="mt-8 self-start border border-charcoal text-charcoal px-6 py-3 text-[11px] tracking-[3px] uppercase font-medium hover:bg-charcoal hover:text-cream transition-all duration-300">
            View Full Menu
          </Link>
        </div>
        
        <div className="w-full md:w-1/2 h-[400px] md:h-auto relative overflow-hidden slide-r">
          <img
            src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=85"
            alt="Signature dish"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* SECTION 3 — PHILOSOPHY */}
      <section ref={philRef} className="bg-charcoal flex min-h-[580px] flex-col md:flex-row">
        <div className="w-full md:w-1/2 px-8 sm:px-16 py-20 flex flex-col justify-center slide-l order-2 md:order-1">
          <p className="reveal font-inter text-[11px] tracking-[4px] uppercase text-amber-spice mb-5">The Philosophy</p>
          <h2 className="reveal font-playfair text-[32px] sm:text-[42px] font-bold text-cream leading-[1.1] mb-6">
            Redefining tradition through a contemporary lens.
          </h2>
          <p className="reveal font-inter text-[16px] text-cream-dim font-light leading-[1.9] mb-8 max-w-[420px]">
            We view Indian cuisine not as a static artifact, but as a living canvas. Our kitchen weaves heritage spices with avant-garde techniques, presenting dishes that honor their origins while engaging the modern palate.
          </p>
          <Link to="/about"
            className="reveal flex items-center gap-3 text-amber-spice text-[12px] tracking-[3px] uppercase font-medium font-inter group w-fit">
            Our Story
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
        
        <div className="w-full md:w-1/2 h-[400px] md:h-auto relative flex items-center justify-center bg-charcoal-mid p-8 sm:p-14 slide-r order-1 md:order-2">
          <div className="relative w-full max-w-[400px]">
            <div className="absolute inset-0 border border-amber-spice/40 translate-x-5 translate-y-5 pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=85"
              alt="CLOVE restaurant"
              className="w-full h-full object-cover relative z-10"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 — SIGNATURE COLLECTION */}
      <section ref={colRef} className="bg-linen px-8 sm:px-16 py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-14 gap-8 flex-wrap">
            <div>
              <p className="reveal font-inter text-[11px] tracking-[4px] uppercase text-amber-deep mb-4">Featured</p>
              <h2 className="reveal font-playfair text-[32px] sm:text-[44px] font-bold text-charcoal leading-[1.05]">
                The Signature Collection
              </h2>
              <p className="reveal font-inter text-[15px] text-stone font-light mt-3 max-w-[440px] leading-[1.8]">
                Curated masterpieces that define our culinary philosophy. Each plate is a symphony of flavors for the discerning palate.
              </p>
            </div>
            <Link to="/menu"
              className="reveal border border-charcoal text-charcoal px-5 py-2.5 text-[11px] tracking-[2px] uppercase font-medium font-inter hover:bg-charcoal hover:text-cream transition-all duration-300 whitespace-nowrap flex-shrink-0">
              View Full Menu
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Dal Makhani', price: '15.99', desc: 'Slow-cooked black lentils, rich with butter and cream', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=85', offset: false },
              { name: 'Chicken Biryani', price: '17.99', desc: 'Fragrant basmati, saffron, and slow-cooked chicken', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=85', offset: true },
              { name: 'Gulab Jamun', price: '5.99', desc: 'Soft milk dumplings soaked in rose-scented syrup', img: 'https://images.unsplash.com/photo-1571112750286-fbd1c77ec8bc?w=500&q=85', offset: false },
            ].map((item, i) => (
              <div key={i} className={`reveal group cursor-pointer ${item.offset ? 'md:mt-10' : ''}`}>
                <div className="overflow-hidden mb-5">
                  <img src={item.img} alt={item.name}
                    className="w-full h-[240px] object-cover group-hover:scale-[1.06] transition-transform duration-700" />
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-playfair text-[22px] font-semibold text-charcoal">{item.name}</h3>
                  <span className="font-inter text-[14px] text-stone">${item.price}</span>
                </div>
                <p className="font-inter text-[14px] text-stone font-light mt-2 leading-[1.7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — TWO BROTHERS EDITORIAL BANNER */}
      <section className="bg-amber-spice py-20 px-8 text-center overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-2">
            <span className="font-inter text-[11px] tracking-[4px] uppercase text-charcoal/40 hidden sm:inline">Built by</span>
            <h2 className="font-playfair font-black uppercase text-charcoal leading-[0.88] reveal"
                style={{ fontSize: 'clamp(48px, 8vw, 100px)' }}>
              Two Brothers,
            </h2>
            <span className="font-inter text-[11px] tracking-[4px] uppercase text-charcoal/40 hidden sm:inline">With Love</span>
          </div>
          <h2 className="font-playfair font-black uppercase text-charcoal leading-[0.88] mb-8 reveal"
              style={{ fontSize: 'clamp(48px, 8vw, 100px)' }}>
            Duluth, Georgia.
          </h2>
          <p className="font-inter text-[16px] text-stone font-light max-w-md mx-auto leading-[1.9] mb-10 reveal">
            CLOVE was born not from a business plan, but from a dinner table. Every dish we serve carries that memory forward.
          </p>
          <Link to="/about"
            className="inline-block bg-charcoal text-cream px-10 py-4 text-[12px] tracking-[3px] uppercase font-medium hover:bg-charcoal-mid transition-colors duration-300 reveal">
            Our Story
          </Link>
        </div>
      </section>

      {/* SECTION 6 — THREE FOOD PHOTOS */}
      <section className="flex min-h-screen flex-col md:flex-row bg-charcoal">
        {[
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=85', 
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=85',   
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85', 
        ].map((src, i) => (
          <div key={i} className="flex-1 min-h-[40vh] md:min-h-screen relative overflow-hidden group border-b md:border-b-0 md:border-r border-charcoal last:border-0">
            <img 
              src={src} 
              alt="Culinary detail" 
              className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000" 
            />
            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-700" />
          </div>
        ))}
      </section>
    </div>
  )
}
