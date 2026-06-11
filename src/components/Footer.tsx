import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0B0806] pt-16 pb-8 px-8 flex flex-col items-center border-t border-white/5 w-full">
      <div className="w-full max-w-[1200px] flex flex-col items-center gap-10 mb-12">
        {/* Contact info list */}
        <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[320px] md:max-w-none md:flex-row md:justify-center md:items-center">
          {/* Phone */}
          <div className="flex items-center gap-4 text-left md:justify-center">
            <Phone size={20} className="text-[#D49653] flex-shrink-0" />
            <span className="font-inter text-[13px] tracking-[2px] uppercase text-white/90">
              +1 (770) 800-0881
            </span>
          </div>

          {/* Divider on desktop */}
          <div className="hidden md:block w-px h-5 bg-white/10" />

          {/* Email */}
          <div className="flex items-center gap-4 text-left md:justify-center">
            <Mail size={20} className="text-[#D49653] flex-shrink-0" />
            <span className="font-inter text-[13px] tracking-[2px] uppercase text-white/90 break-all">
              Info@tasteofclove.com
            </span>
          </div>

          {/* Divider on desktop */}
          <div className="hidden md:block w-px h-5 bg-white/10" />

          {/* Address */}
          <div className="flex items-start gap-4 text-left md:justify-center md:items-center">
            <MapPin size={20} className="text-[#D49653] mt-0.5 md:mt-0 flex-shrink-0" />
            <span className="font-inter text-[13px] tracking-[2px] uppercase text-white/90 leading-relaxed md:leading-none">
              3083 Breckinridge Blvd, Suite 210, Duluth GA 30096
            </span>
          </div>
        </div>
      </div>

      {/* Social Icons & Copyright */}
      <div className="w-full max-w-[1200px] pt-8 border-t border-white/10 flex flex-col items-center gap-6">
        <div className="flex gap-6 items-center justify-center">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-[#D49653] hover:opacity-80 transition-opacity" aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[#D49653] hover:opacity-80 transition-opacity" aria-label="Instagram">
            <Instagram size={24} />
          </a>
        </div>
        <p className="font-inter text-[10px] tracking-[2px] uppercase text-white/30">
          © 2026 CLOVE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
