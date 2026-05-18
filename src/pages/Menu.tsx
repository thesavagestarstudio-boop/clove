import { useState, useRef, useEffect, useMemo } from 'react'
import { Plus, Minus, ShoppingBag, X, Search, Info, Bike, Utensils, MapPin, Clock, ChevronRight } from 'lucide-react'
import { MenuItem } from '../types'
import { useLenis } from '../components/SmoothScroll'

// Types
interface MenuCategory {
  name: string
  items: MenuItem[]
}

interface MenuProps {
  addToCart: (item: MenuItem) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
  timeSlots: string[]
}

// Data
const menuData: MenuCategory[] = [
  {
    name: 'Appetizers',
    items: [
      { id: 'app-1', name: 'Samosa Duo', price: '7.99', desc: 'Crispy pastry filled with spiced potatoes and peas', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=85' },
      { id: 'app-2', name: 'Onion Bhajia', price: '8.99', desc: 'Crispy onion fritters with chickpea flour and spices', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=85' },
      { id: 'app-3', name: 'Paneer Tikka', price: '12.99', desc: 'Grilled cottage cheese marinated in yogurt and spices', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=85' },
    ]
  },
  {
    name: 'Chicken',
    items: [
      { id: 'chk-1', name: 'Butter Chicken', price: '18.99', desc: 'Tender chicken in a creamy, aromatic tomato sauce', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=85' },
      { id: 'chk-2', name: 'Chicken Tikka Masala', price: '19.99', desc: 'Char-grilled chicken in a robustly spiced masala sauce', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=85' },
      { id: 'chk-3', name: 'Chicken Vindaloo', price: '18.99', desc: 'Spicy and tangy chicken curry with potatoes', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=85' },
    ]
  },
  {
    name: 'Vegetarian',
    items: [
      { id: 'veg-1', name: 'Palak Paneer', price: '16.99', desc: 'Fresh cottage cheese in vibrant spinach and garlic purée', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=85' },
      { id: 'veg-2', name: 'Dal Makhani', price: '15.99', desc: 'Slow-cooked black lentils, rich with butter and cream', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=85' },
      { id: 'veg-3', name: 'Chana Masala', price: '14.99', desc: 'Chickpeas cooked in a robust blend of spices and tomatoes', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=85' },
    ]
  },
  {
    name: 'Biryani & Rice',
    items: [
      { id: 'rice-1', name: 'Chicken Biryani', price: '17.99', desc: 'Fragrant basmati, saffron, and slow-cooked chicken', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=85' },
      { id: 'rice-2', name: 'Vegetable Biryani', price: '15.99', desc: 'Aromatic rice with garden fresh vegetables and spices', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=85' },
      { id: 'rice-3', name: 'Jeera Rice', price: '6.99', desc: 'Basmati rice tempered with cumin seeds', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=85' },
    ]
  },
  {
    name: 'Breads',
    items: [
      { id: 'brd-1', name: 'Garlic Naan', price: '4.99', desc: 'Traditional leavened bread topped with fresh garlic', img: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=85' },
      { id: 'brd-2', name: 'Butter Naan', price: '4.50', desc: 'Soft and pillowy bread glazed with melted butter', img: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=85' },
      { id: 'brd-3', name: 'Stuffed Paratha', price: '6.99', desc: 'Flaky whole wheat bread stuffed with spiced potatoes', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=85' },
    ]
  },
  {
    name: 'Lamb & Goat',
    items: [
      { id: 'lmb-1', name: 'Lamb Rogan Josh', price: '21.99', desc: 'Slow-braised lamb in rich yogurt and ginger gravy', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=85' },
      { id: 'lmb-2', name: 'Goat Curry', price: '22.99', desc: 'Traditional bone-in goat meat slow-cooked in a robust spice blend', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=85' },
    ]
  },
  {
    name: 'Seafood',
    items: [
      { id: 'sfd-1', name: 'Goan Fish Curry', price: '23.99', desc: 'Tender fish pieces in a coconut and tamarind base', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=85' },
      { id: 'sfd-2', name: 'Shrimp Masala', price: '24.99', desc: 'Succulent shrimp tossed in a spicy onion-tomato gravy', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=85' },
    ]
  },
  {
    name: 'Sides',
    items: [
      { id: 'sid-1', name: 'Raita', price: '3.99', desc: 'Refreshing yogurt with cucumber, carrots and light spices', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=85' },
      { id: 'sid-2', name: 'Mango Chutney', price: '2.50', desc: 'Sweet and tangy preserve made from semi-ripe mangoes', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=85' },
    ]
  },
  {
    name: 'Drinks',
    items: [
      { id: 'drk-1', name: 'Mango Lassi', price: '4.99', desc: 'Creamy yogurt drink blended with sweet mango pulp', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&q=85' },
      { id: 'drk-2', name: 'Masala Chai', price: '3.50', desc: 'Spiced Indian tea brewed with milk and aromatic herbs', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&q=85' },
    ]
  },
  {
    name: 'Desserts',
    items: [
      { id: 'dst-1', name: 'Gulab Jamun', price: '6.99', desc: 'Soft milk dumplings soaked in rose-scented syrup', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=85' },
      { id: 'dst-2', name: 'Gajar Halwa', price: '7.99', desc: 'Sweetened carrot pudding with nuts and aromatic cardamom', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=85' },
    ]
  }
]

export default function Menu({ addToCart, selectedTime, setSelectedTime, timeSlots }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState(menuData[0].name)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  
  const mainRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Filtered menu data based on search query
  const filteredMenuData = useMemo(() => {
    if (!searchQuery.trim()) return menuData
    
    return menuData.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0)
  }, [searchQuery])

  // Track scroll position to update active category
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('cat-', '')
            const found = menuData.find(c => c.name.replace(/[^a-zA-Z0-9]/g, '') === id)
            if (found) setActiveCategory(found.name)
          }
        })
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    )

    const sections = document.querySelectorAll('section[id^="cat-"]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [filteredMenuData])

  const lenis = useLenis()

  const scrollTo = (cat: string) => {
    isScrollingRef.current = true
    setActiveCategory(cat)
    
    const id = `cat-${cat.replace(/[^a-zA-Z0-9]/g, '')}`
    if (lenis) {
      try {
        lenis.scrollTo(`#${id}`, { offset: -100 })
      } catch (e) {
        // Fallback if Lenis fails
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 1000)
  }

  // Lock body scroll when time picker is open
  useEffect(() => {
    if (isTimePickerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isTimePickerOpen])

  return (
    <div className="flex min-h-screen pt-[76px] bg-white font-inter">
      {/* SIDEBAR */}
      <aside className="w-[220px] hidden lg:flex flex-shrink-0 bg-charcoal flex-col sticky top-[76px] h-[calc(100vh-76px)] overflow-y-auto border-r border-linen-dark/10">
        <div className="px-6 py-5 border-b border-linen-dark/15">
          <p className="text-[10px] tracking-[3px] uppercase text-amber-spice font-medium">Order Pickup</p>
          <p className="text-cream/45 text-[13px] mt-1 font-light truncate">3083 Breckinridge Blvd</p>
        </div>
        <nav className="flex-1 py-3">
          {filteredMenuData.map(cat => (
            <button 
               key={cat.name} 
               onClick={() => scrollTo(cat.name)}
              className={`w-full text-left px-6 py-3 text-[13px] transition-all duration-200 border-l-2 ${
                activeCategory === cat.name
                  ? 'border-amber-spice text-amber-spice bg-amber-spice/5'
                  : 'border-transparent text-cream/55 hover:text-cream hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE TABS */}
      <div 
        ref={tabsRef}
        className="lg:hidden fixed top-[76px] left-0 right-0 z-40 bg-linen/95 backdrop-blur-md border-b border-linen-dark/30 overflow-x-auto whitespace-nowrap px-4 py-3 hide-scrollbar"
      >
        {filteredMenuData.map(cat => (
          <button
            key={cat.name}
            onClick={() => scrollTo(cat.name)}
            data-active={activeCategory === cat.name}
            className={`inline-block px-4 py-1.5 rounded-full text-[12px] mr-2 border transition-all ${
              activeCategory === cat.name
                ? 'bg-amber-spice text-charcoal border-amber-spice font-medium shadow-sm'
                : 'border-linen-dark/50 text-stone bg-white/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main 
        className="flex-1 bg-white px-6 sm:px-10 py-10 lg:py-10 pt-24 lg:pt-10" 
        ref={mainRef}
      >
        {/* Info Banner */}
        <div className="bg-linen-light/50 border-b border-linen-dark/10 -mx-6 sm:-mx-10 -mt-10 mb-8 px-6 sm:px-10 py-3 flex items-center justify-center gap-2">
          <Info size={18} className="text-stone/60" />
          <p className="text-[13px] text-stone/80 font-light">Only accepting pickup orders</p>
        </div>

        {/* Store Header Info */}
        <div className="mb-10 max-w-4xl">
          <h1 className="font-playfair text-[36px] sm:text-[48px] font-bold text-charcoal leading-tight mb-1">Clove Kitchen</h1>
          <p className="text-stone font-light text-[15px] mb-8">3083 Breckinridge Blvd, Suite 210, Duluth GA 30096</p>

          {/* Location & Time Selection */}
          <div className="space-y-4 mb-10 border-b border-linen-dark/20 pb-10">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-linen-dark/10 flex items-center justify-center text-stone group-hover:bg-amber-spice group-hover:text-charcoal transition-colors">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-stone font-light">Pickup from <span className="font-semibold text-charcoal">3083 Breckinridge Blvd, Suite 210, Duluth GA 30096</span></p>
              </div>
            </div>
            <div 
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => setIsTimePickerOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-linen-dark/10 flex items-center justify-center text-stone group-hover:bg-amber-spice group-hover:text-charcoal transition-colors">
                <Clock size={20} />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <p className="text-[14px] text-stone font-light">Pickup <span className="font-semibold text-charcoal">{selectedTime}</span></p>
                <ChevronRight size={20} className="text-stone/40" />
              </div>
            </div>
          </div>

          {/* Simple Time Picker Modal */}
          {isTimePickerOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setIsTimePickerOpen(false)} />
              <div 
                data-lenis-prevent
                className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 flex flex-col p-6 max-h-[70vh]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-playfair text-[20px] font-bold">Select Pickup Time</h3>
                  <button onClick={() => setIsTimePickerOpen(false)} className="p-1 hover:bg-linen-dark/10 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="overflow-y-auto grid grid-cols-2 gap-2 pr-1 custom-scrollbar">
                   {timeSlots.map(time => (
                     <button
                        key={time}
                        onClick={() => { setSelectedTime(time); setIsTimePickerOpen(false); }}
                        className={`py-2.5 px-3 rounded-lg text-[13px] border transition-all ${
                          selectedTime === time 
                          ? 'bg-charcoal text-cream border-charcoal font-medium' 
                          : 'border-linen-dark/30 text-stone hover:border-charcoal'
                        }`}
                     >
                       {time}
                     </button>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone/40" size={20} />
            <input 
              type="text" 
              placeholder="Search for a dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-linen-light border border-linen-dark/30 rounded-xl py-3.5 pl-12 pr-10 text-[15px] text-charcoal focus:outline-none focus:border-amber-spice focus:ring-1 focus:ring-amber-spice/20 transition-all placeholder:text-stone/40"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone/40 hover:text-charcoal transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Menu Sections */}
        {filteredMenuData.length > 0 ? (
          filteredMenuData.map(category => (
            <section key={category.name} id={`cat-${category.name.replace(/[^a-zA-Z0-9]/g, '')}`} className="mb-14 scroll-mt-[140px] lg:scroll-mt-[100px]">
              <h2 className="font-playfair text-[28px] sm:text-[34px] font-bold text-charcoal mb-1">{category.name}</h2>
              <div className="w-10 h-0.5 bg-amber-spice mb-6" />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {category.items.map(item => (
                  <div key={item.id} className="bg-[#D8CBB8] rounded-2xl border border-linen-dark/15 sm:border-linen-dark/35 hover:border-amber-spice/60 transition-all duration-300 group flex flex-row items-center sm:items-stretch h-auto sm:h-[180px] py-4 sm:py-0 sm:overflow-hidden px-4 sm:px-0">
                    {/* Mobile Text Content (Left) */}
                    <div className="flex-1 pr-4 sm:p-4 flex flex-col justify-center sm:justify-start order-1 sm:order-2">
                      <div className="flex-1">
                        <h3 className="font-playfair font-bold uppercase text-[18px] sm:normal-case sm:font-sans sm:font-semibold sm:text-[16px] text-charcoal tracking-wide sm:tracking-normal">{item.name}</h3>
                        <p className="text-[15px] sm:text-[13px] text-charcoal/80 sm:text-stone font-light mt-1 sm:mt-1.5 leading-[1.3] sm:leading-[1.6] line-clamp-2">{item.desc}</p>
                      </div>
                      <div className="mt-3 sm:mt-4 flex items-center justify-between">
                        <span className="font-sans sm:font-playfair text-[15px] sm:text-[20px] text-charcoal sm:font-bold">${item.price}</span>
                        {/* Desktop add button */}
                        <button 
                          onClick={() => addToCart(item)}
                          className="hidden sm:block bg-amber-spice text-charcoal px-4 py-2 text-[11px] tracking-[2px] uppercase font-medium hover:bg-amber-deep transition-colors duration-200 rounded-lg"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Image Content (Right) */}
                    <div className="w-[110px] h-[110px] sm:w-[180px] sm:h-full relative flex-shrink-0 order-2 sm:order-1 sm:overflow-hidden rounded-2xl sm:rounded-none ml-2 sm:ml-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover sm:group-hover:scale-[1.07] transition-transform duration-700 rounded-2xl sm:rounded-none" />
                      {/* Mobile add button (floating +) */}
                      <button
                        onClick={() => addToCart(item)}
                        className="sm:hidden absolute -bottom-1 -right-1 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.15)] text-charcoal hover:bg-linen-light transition-colors z-10"
                      >
                        <Plus size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-stone text-[16px] font-light">No dishes found matching "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="text-amber-deep font-medium mt-2 hover:underline">Clear search</button>
          </div>
        )}
        
        {/* Padding for mobile FAB */}
        <div className="h-20 lg:hidden" />
      </main>
    </div>
  )
}
