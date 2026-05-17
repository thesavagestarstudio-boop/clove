'use client'
import { useRef } from 'react'
import { Flame, Heart, Leaf } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.about-reveal', {
      y: 72,
      opacity: 0,
      duration: 1.3,
      stagger: 0.14,
      ease: 'power3.out'
    })

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
        }
      })
    })

    gsap.from('.slide-l', {
      x: -80,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top 75%'
      }
    })

    gsap.from('.slide-r', {
      x: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top 75%'
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* SECTION 1 — HERO */}
      <section className="bg-[#D8CBB8] min-h-screen flex items-center justify-center text-center px-6 md:px-12 relative">
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="about-reveal font-playfair font-normal uppercase text-charcoal leading-[0.9] sm:leading-[0.85] tracking-tighter text-[42px] sm:text-[75px] mb-4 sm:mb-[-36px]">
            Built by<br/>Two Brothers.
          </h1>
          <p className="about-reveal font-playfair italic text-amber-deep mt-4 sm:mt-8 opacity-90 leading-relaxed text-[15px] sm:text-[17.8px] mb-8 sm:mb-[-86px]">
            Modern Fusion. Ancient Roots.
          </p>
          <div className="about-reveal text-charcoal/10 text-3xl mt-16 animate-bounce">↓</div>
        </div>
      </section>

      {/* SECTION 2 — GALLERY ROW */}
      <section className="flex flex-col md:flex-row h-auto md:min-h-[80vh] bg-charcoal">
        {[
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85',
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=85',
        ].map((src, i) => (
          <div key={i} className="flex-1 h-[40vh] md:h-auto relative overflow-hidden group border-b md:border-b-0 md:border-r border-charcoal last:border-0">
            <img 
              src={src} 
              alt="Restaurant interior" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-100" 
            />
            <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-transparent transition-colors duration-700" />
          </div>
        ))}
      </section>

      {/* SECTION 3 — STORY */}
      <section className="story-section bg-linen py-20 px-8 sm:px-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 slide-l">
            <p className="font-inter text-[11px] tracking-[4px] uppercase text-amber-deep mb-4">THE FOUNDERS</p>
            <h2 className="font-playfair text-[32px] sm:text-[44px] font-bold text-charcoal leading-[1.1]">
              A Shared Dream, A Shared Kitchen
            </h2>
            <div className="w-14 h-0.5 bg-amber-spice my-6" />
            <div className="space-y-6">
              <p className="font-inter text-[16px] text-stone font-light leading-[1.9]">
                CLOVE was born not from a business plan, but from a dinner table. Two brothers — raised on their mother's recipes, their grandmother's spice blends, and the aroma of cardamom on winter mornings — decided to share that inheritance with Duluth.
              </p>
              <p className="font-inter text-[16px] text-stone font-light leading-[1.9]">
                What started as a family passion became a culinary philosophy: take the bold, layered traditions of Indian cooking and weave them into something contemporary. Modern techniques, ancient soul.
              </p>
              <p className="font-inter text-[16px] text-stone font-light leading-[1.9]">
                At CLOVE, every dish is a bridge between memory and innovation. We are not just serving food — we are passing something forward.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 slide-r">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-spice translate-x-6 translate-y-6 -z-10" />
              <img src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=85"
                alt="The founders" className="w-full h-[500px] sm:h-[600px] object-cover relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — VALUES */}
      <section className="bg-amber-spice py-20 px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: <Flame size={36} />, title: 'Craftsmanship', desc: 'Every dish prepared with devotion to detail and technique.' },
            { icon: <Leaf size={36} />, title: 'Heritage', desc: 'Rooted in generations of Indian culinary tradition.' },
            { icon: <Heart size={36} />, title: 'Warmth', desc: 'Every guest welcomed like family, every time.' },
          ].map((v, i) => (
            <div key={i} className="reveal">
              <div className="text-charcoal/70 mb-6 flex justify-center">{v.icon}</div>
              <h3 className="font-inter text-[12px] tracking-[4px] uppercase font-semibold text-charcoal mb-3">{v.title}</h3>
              <p className="font-inter text-[15px] text-stone font-light leading-[1.8] max-w-[200px] mx-auto">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
