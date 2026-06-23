"use client"
import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ShoppingBag, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Header from './components/Header'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import LoginModal from './components/LoginModal'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import About from './pages/About'
import Menu from './pages/Menu'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import Gallery from './pages/Gallery'
import Catering from './pages/Catering'
import { CartItem, MenuItem } from './types'
import WorkInProgress from './pages/WorkInProgress'

function getSlotsForDate(date: Date, isToday: boolean): string[] {
  const day = date.getDay()
  const slots: string[] = []
  
  if (day === 1) {
    return [] // Closed on Monday
  }
  
  let ranges: { start: number; end: number }[] = []
  if (day >= 2 && day <= 4) {
    // Tue, Wed, Thu: 11:00 AM - 2:45 PM, 4:45 PM - 9:30 PM
    ranges = [
      { start: 11 * 60, end: 14 * 60 + 45 },
      { start: 16 * 60 + 45, end: 21 * 60 + 30 }
    ]
  } else if (day === 5) {
    // Fri: 11:00 AM - 2:45 PM, 4:45 PM - 10:30 PM
    ranges = [
      { start: 11 * 60, end: 14 * 60 + 45 },
      { start: 16 * 60 + 45, end: 22 * 60 + 30 }
    ]
  } else if (day === 6) {
    // Sat: 11:00 AM - 10:30 PM
    ranges = [
      { start: 11 * 60, end: 22 * 60 + 30 }
    ]
  } else if (day === 0) {
    // Sun: 11:00 AM - 9:30 PM
    ranges = [
      { start: 11 * 60, end: 21 * 60 + 30 }
    ]
  }
  
  const prefix = isToday ? 'Today at ' : 'Tomorrow at '
  
  // For today, only show times at least 30 minutes in the future
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + 30
  
  ranges.forEach(range => {
    let current = range.start
    while (current <= range.end) {
      if (!isToday || current >= currentMinutes) {
        const hour24 = Math.floor(current / 60)
        const min = current % 60
        const ampm = hour24 >= 12 ? 'PM' : 'AM'
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
        const minStr = min < 10 ? `0${min}` : `${min}`
        slots.push(`${prefix}${hour12}:${minStr} ${ampm}`)
      }
      current += 30 // 30 minutes step
    }
  })
  
  return slots
}

function generateTimeSlots(): string[] {
  const today = new Date()
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  
  const todaySlots = getSlotsForDate(today, true)
  const tomorrowSlots = getSlotsForDate(tomorrow, false)
  
  const allSlots = [...todaySlots, ...tomorrowSlots]
  if (allSlots.length === 0) {
    return ['Next Available Slot']
  }
  return allSlots
}

export default function App() {
  // Toggle this to show/hide the Work in Progress page
  const showWorkInProgress = true

  if (showWorkInProgress) {
    return <WorkInProgress />
  }

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
 
  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }
 
  const fetchCart = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      if (data) {
        setCart(data.map(item => ({
          id: item.item_id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          img: item.img || ''
        })))
      }
    } catch (err) {
      console.error('Error fetching cart:', err)
    }
  }

  const syncLocalCartToSupabase = async (userId: string, localCart: CartItem[]) => {
    if (localCart.length === 0) {
      await fetchCart(userId)
      return
    }
    try {
      for (const item of localCart) {
        await supabase
          .from('cart_items')
          .upsert({
            user_id: userId,
            item_id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            img: item.img
          }, { onConflict: 'user_id,item_id' })
      }
      await fetchCart(userId)
    } catch (err) {
      console.error('Error syncing local cart to database:', err)
      await fetchCart(userId)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchCart(session.user.id)
      }
    })
 
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoginOpen(false)
        showNotification('Successfully logged in')
        syncLocalCartToSupabase(session.user.id, cart)
      } else if (event === 'SIGNED_OUT') {
        showNotification('Successfully logged out')
        setCart([])
      }
    })
 
    // Initialize time slots dynamically
    const slots = generateTimeSlots()
    setTimeSlots(slots)
    if (slots.length > 0) {
      setSelectedTime(slots[0])
    }

    // Verify and process pending Clover orders
    const checkPendingOrder = async () => {
      const pendingOrderRaw = localStorage.getItem('clove_pending_order')
      if (!pendingOrderRaw) {
        // If returning with checkout_success but no localStorage data (e.g. cleared cache), still clean URL
        const params = new URLSearchParams(window.location.search)
        if (params.get('checkout_success') === 'true') {
          const url = new URL(window.location.href)
          url.searchParams.delete('checkout_success')
          window.history.replaceState({}, document.title, url.pathname + url.search)
        }
        return
      }

      try {
        const pendingOrder = JSON.parse(pendingOrderRaw)
        if (!pendingOrder.checkoutId) {
          localStorage.removeItem('clove_pending_order')
          return
        }

        // Check the payment status on Vercel backend
        const res = await fetch(`/api/check-payment?checkoutId=${pendingOrder.checkoutId}`)
        if (!res.ok) {
          throw new Error('Failed to verify payment status')
        }

        const checkoutData = await res.json()
        const isPaid = checkoutData.status === 'PAID' || checkoutData.status === 'SUCCESS' || checkoutData.paymentState === 'PAID'

        if (isPaid) {
          if (pendingOrder.isLoggedIn && pendingOrder.supabaseOrderId) {
            // Update the existing pending order to completed
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'completed' })
              .eq('id', pendingOrder.supabaseOrderId)

            if (updateError) throw updateError

            // Clear database cart
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', pendingOrder.userId)
          } else if (!pendingOrder.isLoggedIn) {
            // Guest checkout: Save order to localStorage
            const guestOrder = {
              id: pendingOrder.id || 'GUEST_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
              items: pendingOrder.items,
              subtotal: pendingOrder.subtotal,
              tax: pendingOrder.tax,
              total: pendingOrder.total,
              pickup_time: pendingOrder.pickup_time,
              status: 'completed',
              created_at: new Date().toISOString(),
              guest_info: pendingOrder.guest_info
            }
            const existingOrdersRaw = localStorage.getItem('guest_orders')
            const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : []
            if (!existingOrders.some((o: any) => o.id === guestOrder.id)) {
              existingOrders.unshift(guestOrder)
              localStorage.setItem('guest_orders', JSON.stringify(existingOrders))
            }
          }

          setCart([])
          localStorage.removeItem('clove_pending_order')
          showNotification('Order placed successfully!')
        } else if (checkoutData.status === 'CANCELLED' || checkoutData.status === 'EXPIRED') {
          // Clean up pending Supabase order if payment failed/cancelled
          if (pendingOrder.isLoggedIn && pendingOrder.supabaseOrderId) {
            await supabase
              .from('orders')
              .delete()
              .eq('id', pendingOrder.supabaseOrderId)
          }
          localStorage.removeItem('clove_pending_order')
        }
      } catch (err) {
        console.error('Error verifying pending order:', err)
      } finally {
        const url = new URL(window.location.href)
        if (url.searchParams.get('checkout_success') === 'true') {
          url.searchParams.delete('checkout_success')
          window.history.replaceState({}, document.title, url.pathname + url.search)
        }
      }
    }

    checkPendingOrder()

    return () => subscription.unsubscribe()
  }, [])
 
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0)

  const addToCart = async (item: MenuItem, qtyToAdd = 1, notes?: string) => {
    let finalQty = qtyToAdd
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        finalQty = existing.qty + qtyToAdd
        const combinedNotes = [existing.notes, notes].filter(Boolean).join('; ')
        return prev.map(i => i.id === item.id ? { ...i, qty: finalQty, notes: combinedNotes || undefined } : i)
      }
      return [...prev, { ...item, qty: qtyToAdd, notes: notes || undefined }]
    })
    setIsCartOpen(true)

    if (session?.user?.id) {
      // Look up existing qty in local cart to make sure we send correct total qty
      const existing = cart.find(i => i.id === item.id)
      const qtyToSend = existing ? existing.qty + qtyToAdd : qtyToAdd
      try {
        await supabase
          .from('cart_items')
          .upsert({
            user_id: session.user.id,
            item_id: item.id,
            name: item.name,
            price: item.price,
            qty: qtyToSend,
            img: item.img
          }, { onConflict: 'user_id,item_id' })
      } catch (err) {
        console.error('Error syncing add to cart:', err)
      }
    }
  }

  const changeQty = async (id: string, delta: number) => {
    let finalQty = 0
    setCart(prev => {
      const updated = prev.map(i => {
        if (i.id === id) {
          finalQty = Math.max(0, i.qty + delta)
          return { ...i, qty: finalQty }
        }
        return i
      }).filter(i => i.qty > 0)
      return updated
    })

    if (session?.user?.id) {
      try {
        const targetItem = cart.find(i => i.id === id)
        if (targetItem) {
          const qtyToSend = Math.max(0, targetItem.qty + delta)
          if (qtyToSend === 0) {
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', session.user.id)
              .eq('item_id', id)
          } else {
            await supabase
              .from('cart_items')
              .update({ qty: qtyToSend })
              .eq('user_id', session.user.id)
              .eq('item_id', id)
          }
        }
      } catch (err) {
        console.error('Error syncing qty change:', err)
      }
    }
  }

  return (
    <BrowserRouter>
      <SmoothScroll>
        <div className="min-h-screen flex flex-col w-full">
          <Header
            onLoginClick={() => setIsLoginOpen(true)}
            onLogoutClick={handleLogout}
            onCartClick={() => setIsCartOpen(true)}
            cartCount={cartCount}
            session={session}
          />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={
                <Menu
                  addToCart={addToCart}
                />
              } />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/catering" element={<Catering />} />
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
            showNotification={showNotification}
            isLoggedIn={!!session}
            openLoginModal={() => setIsLoginOpen(true)}
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

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-charcoal text-cream px-6 py-3.5 rounded-full text-[11px] tracking-[2px] uppercase shadow-2xl flex items-center gap-3 border border-linen-dark/20 backdrop-blur-md"
            >
              <div className="w-5 h-5 rounded-full bg-amber-spice/20 flex items-center justify-center">
                <Check size={12} className="text-amber-spice" />
              </div>
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </SmoothScroll>
    </BrowserRouter>
  )
}
