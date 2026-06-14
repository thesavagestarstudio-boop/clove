'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Catering() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.catering-fade',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power2.out' }
    )
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-cream pt-28 pb-20 px-6">
      <div className="max-w-[800px] mx-auto text-center">
        <h1 className="catering-fade font-script text-[60px] md:text-[80px] text-amber-spice mb-4 select-none" style={{ textTransform: 'none' }}>
          Catering
        </h1>
        <p className="catering-fade font-inter text-cream/70 text-[12px] tracking-[3px] uppercase mb-16">
          Elevate Your Celebrations
        </p>

        <div className="catering-fade bg-[#0c0c0c] border border-linen-dark/15 p-8 sm:p-12 shadow-2xl text-left mb-10">
          <p className="font-inter text-cream/90 text-[14px] leading-[1.8] mb-8">
            From intimate gatherings and corporate luncheons to grand weddings and festive celebrations, Clove brings the richness of authentic Indian fusion cuisine to your special events.
          </p>
          <p className="font-inter text-cream/90 text-[14px] leading-[1.8] mb-8">
            Our team works closely with you to curate customized menus that capture the essence of our restaurant dining experience, perfectly tailored to satisfy your guests.
          </p>

          <h3 className="font-inter text-amber-spice text-[12px] tracking-[3px] uppercase font-bold mb-4">
            Our Catering Services
          </h3>
          <ul className="list-disc pl-5 font-inter text-cream/80 text-[13px] leading-[2.0] mb-8">
            <li>Custom Menu Curation (Appetizers, Mains, Desserts & Drinks)</li>
            <li>On-site Live Tandoori & Chaat counters</li>
            <li>Drop-off & Full-service setup options</li>
            <li>Corporate event packages</li>
          </ul>

          <div className="border-t border-linen-dark/15 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <p className="font-inter text-cream/40 text-[10px] tracking-[2px] uppercase">Contact us at</p>
              <a href="mailto:info@tasteofclove.com" className="font-inter text-amber-spice text-[14px] tracking-[1px] hover:underline">
                INFO@TASTOFCLOVE.COM
              </a>
            </div>
            <a 
              href="mailto:info@tasteofclove.com?subject=Catering Inquiry"
              className="bg-amber-spice text-charcoal px-8 py-3.5 text-[10px] tracking-[3px] uppercase font-medium hover:bg-amber-deep transition-colors duration-300"
            >
              Inquire Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
