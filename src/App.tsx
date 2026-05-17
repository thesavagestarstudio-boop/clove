'use client'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Header from './components/Header'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import LoginModal from './components/LoginModal'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import About from './pages/About'
import Menu from './pages/Menu'
import Contact from './pages/Contact'
import { CartItem, MenuItem } from './types'

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedTime, setSelectedTime] = useState('Today at 2:00 PM')

  // Generate time slots (same as in Menu before)
  const timeSlots = [
    'Today at 12:00 PM', 'Today at 1:00 PM', 'Today at 2:00 PM', 'Today at 3:00 PM', 
    'Tomorrow at 11:00 AM', 'Tomorrow at 12:00 PM', 'Tomorrow at 1:00 PM', 'Tomorrow at 2:00 PM'
  ]

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0)

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1 }]
    })
    setIsCartOpen(true)
  }

  const changeQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.qty + delta)
        return { ...i, qty: newQty }
      }
      return i
    }).filter(i => i.qty > 0))
  }

  return (
    <BrowserRouter>
      <SmoothScroll>
        <div className="min-h-screen flex flex-col">
          <Header 
            onLoginClick={() => setIsLoginOpen(true)} 
            onCartClick={() => setIsCartOpen(true)}
            cartCount={cartCount} 
          />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={
                <Menu 
                  addToCart={addToCart} 
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  timeSlots={timeSlots}
                />
              } />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          
          <Footer />
          
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
          />

          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            changeQty={changeQty}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots}
          />

          {/* Global Cart FAB */}
          {cartCount > 0 && !isCartOpen && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 right-6 bg-charcoal text-cream w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-[60] animate-bounce group"
            >
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-1 bg-amber-spice text-charcoal font-bold text-[12px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-linen">
                {cartCount}
              </span>
              <div className="absolute top-0 right-0 w-full h-full rounded-full animate-ping bg-amber-spice/20 -z-10 group-hover:hidden" />
            </button>
          )}
        </div>
      </SmoothScroll>
    </BrowserRouter>
  )
}
