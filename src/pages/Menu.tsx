import { useState, useRef, useEffect, useMemo } from 'react'
import { Plus, Minus, ShoppingBag, X, Search, Info, Bike, Utensils, MapPin, Clock, ChevronRight, Phone, Mail, Facebook, Instagram } from 'lucide-react'
import { MenuItem } from '../types'
import { useLenis } from '../components/SmoothScroll'
import LoadingSpinner from '../components/LoadingSpinner'
import DishDetailModal from '../components/DishDetailModal'
import { motion, AnimatePresence } from 'motion/react'

// Types
interface MenuCategory {
  name: string
  items: MenuItem[]
}

interface MenuProps {
  addToCart: (item: MenuItem, qty?: number, notes?: string) => void
}

const categoryImageMap: Record<string, string> = {
  'Drinks': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&q=85',
  'Desserts': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=85',
  'Parda Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=85',
  'Heritage Plates': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=85',
  'Small Plates': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=85',
  'Soups': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=85',
  'Breads': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=85',
  'Sides': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=85',
  'Signature Curries - Veg': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=85',
  'Signature Curries - NonVeg': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=85'
}

const exactItemImageMap: Record<string, string> = {
  'angara kadahi paneer': '/Angara Kadahi Paneer.jpg',
  'banana leaf enveloped fish': '/Banana Leaf Enveloped Fish.jpg',
  'braised crimson lamb': '/Braised Crimson Lamb.jpg',
  'butter paneer velvet': '/Butter Paneer Velvet.jpg',
  'carrot confit & glacé cream with medley of nuts & caramel': '/CarrotConfit.jpg',
  'carrot confit': '/CarrotConfit.jpg',
  'cauliflower carnival': '/Cauliflower Carnival.jpg',
  'chicken tikka mashup': '/Chicken Tikka Mashup.jpg',
  'chicken tikka trilogy': '/ChickenTikkaTrilogy.jpg',
  'chili paneer crisp': '/Chili Paneer Crisp.jpg',
  'clove bruschettas': '/Clove Bruschettas.jpg',
  'clove butter chicken': '/Clove Butter Chicken.jpg',
  'clove tacos': '/Clove Tacos.jpg',
  'clovedalmakhani': '/CloveDalMakhani.jpg',
  'clove dal makhani': '/CloveDalMakhani.jpg',
  'creamy paneer melt': '/Creamy Paneer Melt.jpg',
  'crispy golden samosa': '/Crispy Golden Samosa.jpg',
  'emarald palak royale': '/Emarald Palak Royale.jpg',
  'emerald palak royale': '/Emarald Palak Royale.jpg',
  'firecracker chicken': '/Firecracker Chicken.jpg',
  'golden dal tadka': '/Golden Dal Tadka.jpg',
  'guac n’ crunch bhel': '/Guac n’ Crunch Bhel .jpg',
  'guac n crunch bhel': '/Guac n’ Crunch Bhel .jpg',
  'heritage g.o.a.t': '/Heritage G.O.A.T.jpg',
  'imperial kofta sphere': '/Imperial Kofta Sphere.jpg',
  'monchow soup': '/Monchow Soup.jpg',
  'paneer pocket rocket': '/Paneer Pocket Rocket.jpg',
  'paneer triple play': '/Paneer Triple Play .jpg',
  'parda biryani': '/Parda Biryani .jpg',
  'punjabi pop-fish': '/Punjabi Pop-Fish.jpg',
  'punjabi pop fish': '/Punjabi Pop-Fish.jpg',
  'rasmalai & coffee tiramisu martini': '/Rasmalai & Coffee Tiramisu Martini.jpg',
  'rasmalai': '/Rasmalai & Coffee Tiramisu Martini.jpg',
  'roadside dhaba chicken': '/Roadside Dhaba Chicken.jpg',
  'route 99 bites': '/Route 99 Bites.jpg',
  'saffron lamb-gheeni bites': '/Saffron Lamb-GheeNi Bites.jpg',
  'saffron lamb': '/Saffron Lamb-GheeNi Bites.jpg',
  'the cauliflower carnival': '/The Cauliflower Carnival.jpg',
  'the clove stack burger': '/The Clove Stack Burger.jpg',
  'the kebab affair': '/The Kebab Affair.jpg',
  'the okra onion orbit': '/The Okra Onion Orbit .jpg',
  'tomato velvet soup': '/Tomato Velvet Soup.jpg',
  'wok n_ roll noodles': '/Wok n_ Roll Noodles.jpg',
  'wok n roll noodles': '/Wok n_ Roll Noodles.jpg',
  'zesty eggplant delight': '/Zesty Eggplant Delight.jpg',
  
  // New dishes photos folder additions
  'amritsari kulcha': '/dishes photos/Amritsari Kulcha Medium.jpeg',
  'biryani rice': '/dishes photos/Biryani Rice.jpeg',
  'butter naan': '/dishes photos/Butter Naan Medium.jpeg',
  'chana masala': '/dishes photos/Chana Masala Medium.jpeg',
  'punjabi chana masala': '/dishes photos/Chana Masala Medium.jpeg',
  'chur chur roti': '/dishes photos/Chur Chur Roti Medium.jpeg',
  'crisp puri': '/dishes photos/Crisp Puri.jpeg',
  'firecracker chili naan': '/dishes photos/Firecracker Chili Naan.jpeg',
  'fries': '/dishes photos/Fries.jpeg',
  'garlic naan': '/dishes photos/Garlic Naan.jpeg',
  'goat cheese truffle naan': '/dishes photos/Goat Cheese Truffle Naan Medium.jpeg',
  'green salad': '/dishes photos/Green Salad.jpeg',
  'gulab jamun': '/dishes photos/Gulab Jamun.jpeg',
  'jeera rice': '/dishes photos/Jeera Rice.jpeg',
  'kids cheese naan': '/dishes photos/Kids Cheese Naan Medium.jpeg',
  'kids maggie': '/dishes photos/Kids Maggie .jpeg',
  'lamb chop': '/dishes photos/Lamb Chop.jpeg',
  'manchurian munchies': '/dishes photos/Manchurian Munchies Medium.jpeg',
  'mango lassi': '/dishes photos/Mango Lassi.jpeg',
  'masala rasso': '/dishes photos/Masala Rasso.jpeg',
  'masala soda': '/dishes photos/Masala Soda Medium.jpeg',
  'mint cucumber raita': '/dishes photos/Mint Cucumber Raita.jpeg',
  'mozarella fried cheese stick': '/dishes photos/Mozarella Fried cheese stick Medium.jpeg',
  'royal emperor chicken': '/dishes photos/Royal Emperor Chicken.jpeg',
  'salmon platter': '/dishes photos/Salmon Platter Medium.jpeg',
  'salted lassi': '/dishes photos/Salted Lassi.jpeg',
  'samosa exlosion': '/dishes photos/Samosa Exlosion.jpeg',
  'samosa explosion': '/dishes photos/Samosa Exlosion.jpeg',
  'spring scrolls': '/dishes photos/Spring Scrolls Medium.jpeg',
  'tandoori shrimp': '/dishes photos/Tandoori Shrimp Medium.jpeg',
  'veg scroll': '/dishes photos/Veg Scroll.jpeg',
  'heritage goat': '/dishes photos/Heritage Goat.jpeg',
  'tacos': '/dishes photos/Tacos.PNG'
}

function getItemImage(itemName: string, categoryName: string): string {
  const name = itemName.toLowerCase().trim().normalize('NFC')
  
  // Check our exact mapping list
  for (const [key, value] of Object.entries(exactItemImageMap)) {
    const normalizedKey = key.normalize('NFC')
    if (name.includes(normalizedKey) || normalizedKey.includes(name)) {
      return value
    }
  }

  // Fallback to keyword-based Unsplash placeholders
  if (name.includes('taco')) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=85'
  if (name.includes('samosa')) return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=85'
  if (name.includes('tikka masala') || name.includes('butter chicken') || name.includes('murgh') || name.includes('curry')) return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=85'
  if (name.includes('naan') || name.includes('roti') || name.includes('bread') || name.includes('paratha')) return 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=85'
  if (name.includes('biryani') || name.includes('rice') || name.includes('jeera')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=85'
  if (name.includes('chai') || name.includes('lassi') || name.includes('drink') || name.includes('coke') || name.includes('soda')) return 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&q=85'
  if (name.includes('jamun') || name.includes('halwa') || name.includes('dessert') || name.includes('kheer')) return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=85'
  if (name.includes('soup') || name.includes('shorba') || name.includes('lentil')) return 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=85'

  return categoryImageMap[categoryName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=85'
}

export default function Menu({ addToCart }: MenuProps) {
  const [menuData, setMenuData] = useState<MenuCategory[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  
  const mainRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Welcome screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  // Lock scroll during welcome overlay
  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showWelcome])

  // Fetch Clover menu data
  useEffect(() => {
    async function fetchMenu() {
      const menuUrl = '/api/menu'

      try {
        setIsLoading(true)
        
        const res = await fetch(menuUrl, {
          headers: {
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          throw new Error('Failed to fetch data from menu API')
        }

        const data = await res.json()
        const rawCategories = data.categories?.elements || []
        const rawItems = data.items?.elements || []

        // Sort categories by sortOrder ascending
        const sortedCats = rawCategories
          .filter((cat: any) => !cat.deleted)
          .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

        // Build categories mapping
        const categoriesMap: Record<string, MenuItem[]> = {}
        sortedCats.forEach((cat: any) => {
          categoriesMap[cat.id] = []
        })

        // Populate items into their categories
        rawItems.forEach((item: any) => {
          // Skip if item is hidden, unavailable, or deleted
          if (item.hidden || !item.available || item.deleted) return

          // Match items to categories
          const itemCats = item.categories?.elements || []
          itemCats.forEach((itemCat: any) => {
            if (categoriesMap[itemCat.id]) {
              // Convert cents to price string
              const priceString = item.priceType === 'FIXED' 
                ? (item.price / 100).toFixed(2) 
                : '0.00'

              categoriesMap[itemCat.id].push({
                id: item.id,
                name: item.name,
                price: priceString,
                desc: item.description || '',
                img: getItemImage(item.name, itemCat.name)
              })
            }
          })
        })

        // Map to standard MenuCategory array format
        const structuredMenu: MenuCategory[] = sortedCats
          .map((cat: any) => ({
            name: cat.name,
            items: categoriesMap[cat.id] || []
          }))
          // Only show categories with items and exclude 'Alcoholic Drinks'
          .filter(cat => cat.items.length > 0 && cat.name.toLowerCase().trim() !== 'alcoholic drinks')

        setMenuData(structuredMenu)
        if (structuredMenu.length > 0) {
          setActiveCategory(structuredMenu[0].name)
        }
      } catch (err: any) {
        console.error('Error fetching Clover menu:', err)
        setError(err.message || 'Failed to load menu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [])

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
  }, [searchQuery, menuData])

  // Track scroll position to update active category
  useEffect(() => {
    if (filteredMenuData.length === 0) return

    const handleScroll = () => {
      if (isScrollingRef.current) return

      const sections = document.querySelectorAll('section[id^="cat-"]')
      let currentActive = activeCategory

      // The vertical point where categories switch (below the sticky header/tabs, ~140px)
      const scrollThreshold = 145

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        // If the top of the section has scrolled past the threshold, it is active
        if (rect.top <= scrollThreshold) {
          const id = section.id.replace('cat-', '')
          const found = menuData.find(c => c.name.replace(/[^a-zA-Z0-9]/g, '') === id)
          if (found) {
            currentActive = found.name
          }
        }
      })

      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Run once initially
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [filteredMenuData, menuData, activeCategory])

  // Reset window scroll to top when welcome screen hides
  useEffect(() => {
    if (!showWelcome) {
      window.scrollTo(0, 0)
    }
  }, [showWelcome])

  // Automatically scroll active category button into view horizontally without page scroll jumps
  useEffect(() => {
    if (activeCategory && tabsRef.current) {
      const activeBtn = tabsRef.current.querySelector('[data-active="true"]') as HTMLElement
      if (activeBtn) {
        const container = tabsRef.current
        const containerWidth = container.clientWidth
        const btnLeft = activeBtn.offsetLeft
        const btnWidth = activeBtn.clientWidth
        
        container.scrollTo({
          left: btnLeft - (containerWidth / 2) + (btnWidth / 2),
          behavior: 'smooth'
        })
      }
    }
  }, [activeCategory])

  const lenis = useLenis()

  const scrollTo = (cat: string) => {
    isScrollingRef.current = true
    setActiveCategory(cat)
    
    const id = `cat-${cat.replace(/[^a-zA-Z0-9]/g, '')}`
    if (lenis) {
      try {
        lenis.scrollTo(`#${id}`, { offset: -100 })
      } catch (e) {
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



  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999] bg-[#0c0c0c] flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.h2
                initial={{ 
                  opacity: 0, 
                  clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' 
                }}
                animate={{ 
                  opacity: 1, 
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' 
                }}
                transition={{ 
                  delay: 0.3, 
                  duration: 2.0, 
                  ease: [0.25, 1, 0.5, 1] 
                }}
                className="font-script text-[76px] sm:text-[100px] text-amber-spice leading-none select-none px-10"
              >
                Welcome
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row min-h-screen pt-[76px] bg-black font-inter text-cream">
      {!showWelcome && isLoading && <LoadingSpinner />}
      {/* SIDEBAR */}
      <aside className="w-[220px] hidden lg:flex flex-shrink-0 bg-[#00503D] flex-col sticky top-[76px] h-[calc(100vh-76px)] overflow-y-auto border-r border-white/10">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-[10px] tracking-[3px] uppercase text-amber-light font-medium">Order Pickup</p>
          <p className="text-cream/70 text-[13px] mt-1 font-light truncate">3083 Breckinridge Blvd</p>
        </div>
        <nav className="flex-1 py-3">
          {isLoading ? (
            <div className="space-y-4 px-6 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            filteredMenuData.map(cat => (
              <button 
                 key={cat.name} 
                 onClick={() => scrollTo(cat.name)}
                className={`w-full text-left px-6 py-3 text-[13px] transition-all duration-200 border-l-2 ${
                  activeCategory === cat.name
                    ? 'border-amber-spice text-amber-spice bg-white/5 font-semibold'
                    : 'border-transparent text-cream/75 hover:text-cream hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main 
        className="flex-1 bg-black px-6 sm:px-10 py-10" 
        ref={mainRef}
      >
        {/* Info Banner */}
        <div className="bg-charcoal/40 border-b border-linen-dark/10 -mx-6 sm:-mx-10 -mt-10 mb-8 px-6 sm:px-10 py-3 flex items-center justify-center gap-2">
          <Info size={18} className="text-cream/40" />
          <p className="text-[13px] text-cream/75 font-light">Only accepting pickup orders</p>
        </div>

        {/* Store Header Info */}
        <div className="mb-6 max-w-4xl">
          <h1 className="font-playfair text-[36px] sm:text-[48px] font-bold text-cream leading-tight mb-1">Clove Kitchen</h1>
          <p className="text-cream/55 font-light text-[15px] mb-8">3083 Breckinridge Blvd, Suite 210, Duluth GA 30096</p>

          {/* Location & Time Selection */}
          <div className="space-y-4 mb-6 border-b border-linen-dark/20 pb-6">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-charcoal/50 flex items-center justify-center text-cream/70 group-hover:bg-amber-spice group-hover:text-charcoal transition-colors">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-cream/70 font-light">Pickup from <span className="font-semibold text-cream">3083 Breckinridge Blvd, Suite 210, Duluth GA 30096</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE TABS */}
        <div 
          ref={tabsRef}
          className="lg:hidden sticky top-0 lg:top-[76px] left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-linen-dark/10 overflow-x-auto whitespace-nowrap py-3 hide-scrollbar -mx-6 sm:-mx-10 px-6 sm:px-10 mb-6"
        >
          {isLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block w-20 h-7 rounded-full bg-linen-dark/20 animate-pulse" />
              ))}
            </div>
          ) : (
            filteredMenuData.map(cat => (
              <button
                key={cat.name}
                onClick={() => scrollTo(cat.name)}
                data-active={activeCategory === cat.name}
                className={`inline-block px-4 py-1.5 rounded-full text-[12px] mr-2 border transition-all ${
                  activeCategory === cat.name
                    ? 'bg-amber-spice text-charcoal border-amber-spice font-medium shadow-sm'
                    : 'border-linen-dark/20 text-cream/70 bg-charcoal/50'
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/35" size={20} />
          <input 
            type="text" 
            placeholder="Search for a dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0c0c0c] border border-linen-dark/15 rounded-xl py-3.5 pl-12 pr-10 text-[15px] text-cream focus:outline-none focus:border-amber-spice focus:ring-1 focus:ring-amber-spice/20 transition-all placeholder:text-cream/35"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/35 hover:text-cream transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Menu Sections */}
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2].map((group) => (
              <div key={group} className="space-y-6">
                <div className="h-8 w-48 bg-linen-dark/20 rounded animate-pulse" />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-[#0c0c0c] rounded-2xl border border-linen-dark/15 h-[180px] flex items-center p-4 gap-4 animate-pulse">
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-1/2 bg-linen-dark/20 rounded" />
                        <div className="h-3 w-full bg-linen-dark/20 rounded" />
                        <div className="h-3 w-2/3 bg-linen-dark/20 rounded" />
                        <div className="h-6 w-16 bg-linen-dark/20 rounded mt-4" />
                      </div>
                      <div className="w-[180px] h-full bg-linen-dark/20 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-[16px] font-medium">Failed to load the menu</p>
            <p className="text-cream/55 text-[14px] mt-1 font-light">{error}</p>
          </div>
        ) : filteredMenuData.length > 0 ? (
          filteredMenuData.map(category => (
            <section key={category.name} id={`cat-${category.name.replace(/[^a-zA-Z0-9]/g, '')}`} className="mb-14 scroll-mt-[140px] lg:scroll-mt-[100px]">
              <h2 className="font-playfair text-[28px] sm:text-[34px] font-bold text-cream mb-1">{category.name}</h2>
              <div className="w-10 h-0.5 bg-amber-spice mb-6" />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {category.items.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setSelectedItemForModal(item)
                      setIsDetailOpen(true)
                    }}
                    className="bg-[#0c0c0c] rounded-2xl border border-linen-dark/15 hover:border-amber-spice/40 transition-all duration-300 group flex flex-row items-center sm:items-stretch h-auto sm:h-[180px] py-4 sm:py-0 sm:overflow-hidden px-4 sm:px-0 cursor-pointer"
                  >
                    {/* Mobile/Desktop Text Content */}
                    <div className="flex-1 pr-4 sm:p-4 flex flex-col justify-center sm:justify-start order-1 sm:order-2">
                      <div className="flex-1">
                        <h3 className="font-playfair font-bold uppercase text-[18px] sm:normal-case sm:font-sans sm:font-semibold sm:text-[16px] text-cream tracking-wide sm:tracking-normal">{item.name}</h3>
                        <p className="text-[15px] sm:text-[13px] text-cream/70 font-light mt-1 sm:mt-1.5 leading-[1.3] sm:leading-[1.6] line-clamp-2">{item.desc}</p>
                      </div>
                      <div className="mt-3 sm:mt-4 flex items-center justify-between">
                        <span className="font-sans sm:font-playfair text-[15px] sm:text-[20px] text-amber-spice sm:font-bold">${item.price}</span>
                        {/* Add button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItemForModal(item)
                            setIsDetailOpen(true)
                          }}
                          className="hidden sm:block bg-amber-spice text-charcoal px-4 py-2 text-[11px] tracking-[2px] uppercase font-medium hover:bg-amber-deep transition-colors duration-200 rounded-lg"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Image Content */}
                    <div className="w-[110px] h-[110px] sm:w-[180px] sm:h-full relative flex-shrink-0 order-2 sm:order-1 sm:overflow-hidden rounded-2xl sm:rounded-none ml-2 sm:ml-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover sm:group-hover:scale-[1.07] transition-transform duration-700 rounded-2xl sm:rounded-none" />
                      {/* Mobile add button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedItemForModal(item)
                          setIsDetailOpen(true)
                        }}
                        className="sm:hidden absolute -bottom-1 -right-1 bg-amber-spice w-9 h-9 rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.15)] text-charcoal hover:bg-amber-deep transition-colors z-10"
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
            <p className="text-cream/55 text-[16px] font-light">No dishes found matching "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="text-amber-spice font-medium mt-2 hover:underline">Clear search</button>
          </div>
        )}
        
        {/* Padding for mobile FAB */}
        <div className="h-20 lg:hidden" />
      </main>

      <DishDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedItemForModal}
        onAddToCart={addToCart}
      />
      </div>
    </>
  )
}
