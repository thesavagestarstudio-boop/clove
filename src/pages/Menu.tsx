import { useState, useRef, useEffect, useMemo } from 'react'
import { Plus, Minus, ShoppingBag, X, Search, Info, Bike, Utensils, MapPin, Clock, ChevronRight } from 'lucide-react'
import { MenuItem } from '../types'
import { useLenis } from '../components/SmoothScroll'
import LoadingSpinner from '../components/LoadingSpinner'
import DishDetailModal from '../components/DishDetailModal'

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
  'zesty eggplant delight': '/Zesty Eggplant Delight.jpg'
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
  
  const mainRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
          .filter(cat => cat.items.length > 0) // Only show categories with items

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
  }, [filteredMenuData, menuData])

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
    <div className="flex min-h-screen pt-[76px] bg-white font-inter">
      {isLoading && <LoadingSpinner />}
      {/* SIDEBAR */}
      <aside className="w-[220px] hidden lg:flex flex-shrink-0 bg-charcoal flex-col sticky top-[76px] h-[calc(100vh-76px)] overflow-y-auto border-r border-linen-dark/10">
        <div className="px-6 py-5 border-b border-linen-dark/15">
          <p className="text-[10px] tracking-[3px] uppercase text-amber-spice font-medium">Order Pickup</p>
          <p className="text-cream/45 text-[13px] mt-1 font-light truncate">3083 Breckinridge Blvd</p>
        </div>
        <nav className="flex-1 py-3">
          {isLoading ? (
            <div className="space-y-4 px-6 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-24 bg-cream/10 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            filteredMenuData.map(cat => (
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
            ))
          )}
        </nav>
      </aside>

      {/* MOBILE TABS */}
      <div 
        ref={tabsRef}
        className="lg:hidden fixed top-[76px] left-0 right-0 z-40 bg-linen/95 backdrop-blur-md border-b border-linen-dark/30 overflow-x-auto whitespace-nowrap px-4 py-3 hide-scrollbar"
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
                  : 'border-linen-dark/50 text-stone bg-white/30'
              }`}
            >
              {cat.name}
            </button>
          ))
        )}
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
          </div>

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
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2].map((group) => (
              <div key={group} className="space-y-6">
                <div className="h-8 w-48 bg-linen-dark/20 rounded animate-pulse" />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-linen-light/30 rounded-2xl border border-linen-dark/15 h-[180px] flex items-center p-4 gap-4 animate-pulse">
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
            <p className="text-stone text-[14px] mt-1 font-light">{error}</p>
          </div>
        ) : filteredMenuData.length > 0 ? (
          filteredMenuData.map(category => (
            <section key={category.name} id={`cat-${category.name.replace(/[^a-zA-Z0-9]/g, '')}`} className="mb-14 scroll-mt-[140px] lg:scroll-mt-[100px]">
              <h2 className="font-playfair text-[28px] sm:text-[34px] font-bold text-charcoal mb-1">{category.name}</h2>
              <div className="w-10 h-0.5 bg-amber-spice mb-6" />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {category.items.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setSelectedItemForModal(item)
                      setIsDetailOpen(true)
                    }}
                    className="bg-[#D8CBB8] rounded-2xl border border-linen-dark/15 sm:border-linen-dark/35 hover:border-amber-spice/60 transition-all duration-300 group flex flex-row items-center sm:items-stretch h-auto sm:h-[180px] py-4 sm:py-0 sm:overflow-hidden px-4 sm:px-0 cursor-pointer"
                  >
                    {/* Mobile/Desktop Text Content */}
                    <div className="flex-1 pr-4 sm:p-4 flex flex-col justify-center sm:justify-start order-1 sm:order-2">
                      <div className="flex-1">
                        <h3 className="font-playfair font-bold uppercase text-[18px] sm:normal-case sm:font-sans sm:font-semibold sm:text-[16px] text-charcoal tracking-wide sm:tracking-normal">{item.name}</h3>
                        <p className="text-[15px] sm:text-[13px] text-charcoal/80 sm:text-stone font-light mt-1 sm:mt-1.5 leading-[1.3] sm:leading-[1.6] line-clamp-2">{item.desc}</p>
                      </div>
                      <div className="mt-3 sm:mt-4 flex items-center justify-between">
                        <span className="font-sans sm:font-playfair text-[15px] sm:text-[20px] text-charcoal sm:font-bold">${item.price}</span>
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

      <DishDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedItemForModal}
        onAddToCart={addToCart}
      />
    </div>
  )
}
