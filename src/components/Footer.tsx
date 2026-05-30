export default function Footer() {
  const footerLinks = [
    { label: 'Visit Us', lines: ['3083 Breckinridge Blvd', 'Suite 210, Duluth GA 30096', '+1 (770) 800-0881', 'info@tasteofclove.com'] },
    { label: 'Hours', lines: ['Mon – Thu  11AM – 9PM', 'Fri – Sat    11AM – 10PM', 'Sunday      12PM – 8PM'] },
    { label: 'Follow Us', lines: ['Instagram — @tasteofclove', 'Facebook — @tasteofclove'] },
  ]

  return (
    <footer className="bg-charcoal border-t border-linen-dark/15 pt-20 pb-8 px-8 md:px-16">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 mb-16">
        <div>
          <div className="flex items-center mb-5">
            <img
              src="/officiallogo.png"
              alt="CLOVE Logo"
              className="h-[32px] w-auto object-contain"
            />
          </div>
          <p className="font-playfair italic text-[15px] text-cream-dim leading-relaxed">
            Modern Fusion.<br/>Ancient Roots.
          </p>
        </div>
        {footerLinks.map(col => (
          <div key={col.label}>
            <p className="text-[11px] tracking-[4px] uppercase text-amber-spice font-medium mb-5">{col.label}</p>
            {col.lines.map(line => (
              <p key={line} className="text-cream-dim text-[14px] font-light leading-[2.1] font-inter">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-linen-dark/12 pt-7 text-center text-[11px] tracking-[2px] text-cream/20 font-inter">
        © 2024 CLOVE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  )
}
