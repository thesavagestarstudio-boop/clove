import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d0d0d] pt-20 pb-12 px-6 md:px-12 border-t border-linen-dark/10 flex flex-col items-center z-10 relative mt-auto">
      {/* Footer Details Container */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-20 w-full max-w-max md:max-w-[1200px] md:w-full mx-auto text-left justify-between items-start">
        {/* Phone */}
        <div className="flex items-center gap-6">
          <Phone className="w-5 h-5 text-amber-spice flex-shrink-0" strokeWidth={1.5} />
          <a href="tel:+17708000881" className="text-[13px] tracking-[4px] uppercase font-light text-cream/80 hover:text-amber-spice transition-colors font-inter">
            +1(770)800-0881
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-6">
          <Mail className="w-5 h-5 text-amber-spice flex-shrink-0" strokeWidth={1.5} />
          <a href="mailto:Info@tastofclove.com" className="text-[13px] tracking-[4px] uppercase font-light text-cream/80 hover:text-amber-spice transition-colors font-inter">
            INFO@TASTOFCLOVE.COM
          </a>
        </div>

        {/* Address */}
        <div className="flex items-start gap-6">
          <MapPin className="w-5 h-5 text-amber-spice mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <a 
            href="https://maps.google.com/?q=3083+Breckinridge+Blvd,+Suite+210,+Duluth+GA+30096"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] tracking-[4px] uppercase font-light text-cream/80 hover:text-amber-spice transition-colors leading-[1.6] font-inter"
          >
            3083 BRECKINRIDGE BLVD, SUITE 210, DULUTH GA 30096
          </a>
        </div>
      </div>

      {/* Social Icons & Design Credit */}
      <div className="w-full max-w-[1200px] border-t border-linen-dark/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-amber-spice hover:opacity-80 transition-opacity">
            <Facebook className="w-5 h-5" strokeWidth={1.5} />
          </a>
          <a href="https://www.instagram.com/tasteofclove/" target="_blank" rel="noopener noreferrer" className="text-amber-spice hover:opacity-80 transition-opacity">
            <Instagram className="w-5 h-5" strokeWidth={1.5} />
          </a>
        </div>
        
        <div className="text-center md:text-right text-[10px] tracking-[3px] text-cream/30 uppercase font-light leading-relaxed font-inter">
          @2026 Clove. ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  )
}
