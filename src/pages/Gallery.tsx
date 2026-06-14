'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.gallery-item',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
    )
  }, { scope: containerRef })

  const items = [
    { src: '/Paneer Triple Play .jpg', alt: 'Paneer Triple Play' },
    { src: '/ChickenTikkaTrilogy.jpg', alt: 'Chicken Tikka Trilogy' },
    { src: '/Paneer Triple Play .jpg', alt: 'Deluxe Platter' },
    { src: '/ChickenTikkaTrilogy.jpg', alt: 'Clove Signature cocktail' },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-cream pt-28 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto text-center">
        <h1 className="font-script text-[60px] md:text-[80px] text-amber-spice mb-4 select-none" style={{ textTransform: 'none' }}>
          Gallery
        </h1>
        <p className="font-inter text-cream/70 text-[12px] tracking-[3px] uppercase mb-16">
          A Visual Journey of Flavors
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="gallery-item overflow-hidden border border-linen-dark/15 shadow-2xl relative group aspect-[4/3] bg-charcoal">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="font-inter text-[11px] tracking-[3px] uppercase text-cream border border-cream/30 px-6 py-3 bg-black/60">
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
