'use client'
import { useRef } from 'react'
import { MapPin, Phone, Mail, Instagram } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.contact-reveal', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out'
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* SECTION 1 — HERO */}
      <section className="bg-charcoal pt-48 pb-20 text-center px-8">
        <p className="contact-reveal font-inter text-[11px] tracking-[5px] uppercase text-amber-spice mb-8">CONNECT</p>
        <h1 className="contact-reveal font-playfair font-black uppercase text-cream leading-[0.88]"
            style={{ fontSize: 'clamp(52px, 9vw, 110px)' }}>
          Reach Out.
        </h1>
        <p className="contact-reveal font-playfair italic text-[24px] text-amber-spice mt-4">
          Duluth's Heritage Kitchen.
        </p>
      </section>

      {/* SECTION 2 — INFO + FORM */}
      <section className="bg-linen py-20 px-8 sm:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-20">
          {/* Left Info */}
          <div className="w-full lg:w-1/2 space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="contact-reveal">
                <p className="text-[11px] tracking-[3px] uppercase text-amber-deep font-semibold mb-4">Location</p>
                <p className="font-playfair text-[18px] text-charcoal leading-relaxed">
                  3083 Breckinridge Blvd, Suite 210<br/>Duluth, GA 30096
                </p>
              </div>
              <div className="contact-reveal">
                <p className="text-[11px] tracking-[3px] uppercase text-amber-deep font-semibold mb-4">Inquiries</p>
                <p className="font-playfair text-[18px] text-charcoal">
                  info@tasteofclove.com<br/>+1 (770) 800-0881
                </p>
              </div>
            </div>

            <div className="contact-reveal w-full h-[400px] relative overflow-hidden bg-charcoal-mid">
                <div className="absolute inset-0 border border-amber-spice/30 translate-x-3 translate-y-3 pointer-events-none" />
                <iframe 
                src="https://maps.google.com/maps?q=3083+Breckinridge+Blvd+Duluth+GA&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="brightness-90 contrast-125"
              />
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-1/2 bg-white/70 p-8 sm:p-14 border border-linen-dark/30 contact-reveal">
            <p className="text-[11px] tracking-[3px] uppercase text-amber-deep font-semibold mb-10">Table Inquiries</p>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[11px] tracking-[2px] uppercase text-stone font-medium">Name</label>
                  <input type="text" className="bg-transparent border-b border-linen-dark/50 focus:border-amber-spice focus:outline-none text-charcoal px-0 py-3 w-full font-inter transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] tracking-[2px] uppercase text-stone font-medium">Email</label>
                  <input type="email" className="bg-transparent border-b border-linen-dark/50 focus:border-amber-spice focus:outline-none text-charcoal px-0 py-3 w-full font-inter transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] tracking-[2px] uppercase text-stone font-medium">Message</label>
                <textarea rows={4} className="bg-transparent border-b border-linen-dark/50 focus:border-amber-spice focus:outline-none text-charcoal px-0 py-3 w-full font-inter transition-colors resize-none" />
              </div>
              <button className="bg-charcoal text-cream px-10 py-5 text-[12px] tracking-[3px] uppercase font-medium hover:bg-amber-spice hover:text-charcoal transition-all duration-300">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WATERMARK */}
      <section className="bg-charcoal py-24 text-center overflow-hidden">
        <h2 className="font-playfair font-black uppercase text-cream/5 leading-[0.8] mb-[-0.1em]"
            style={{ fontSize: 'clamp(80px, 20vw, 360px)' }}>
          CLOVE
        </h2>
      </section>
    </div>
  )
}
