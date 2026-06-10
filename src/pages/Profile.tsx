'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, Clock, Receipt, Package, User } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'

interface OrderItem {
  id: string
  name: string
  price: string
  qty: number
  img?: string
}

interface Order {
  id: string
  user_id?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  pickup_time: string
  status: string
  created_at: string
  guest_info?: {
    name: string
    email: string
    phone: string
  }
}

export default function Profile() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // 3D Letter Reveal
    gsap.from('.letter-reveal', {
      y: 80,
      rotateX: -85,
      opacity: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: 'power4.out',
      transformOrigin: 'center bottom -30px'
    })

    // Subtitle reveal
    gsap.from('.reveal-subtitle', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: 'power2.out'
    })
  }, { scope: containerRef })

  useEffect(() => {
    async function checkSessionAndFetch() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
          
          if (error) throw error
          if (data) {
            setOrders(data)
          }
        } catch (err) {
          console.error('Error fetching orders:', err)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Read local guest orders
        const localOrdersRaw = localStorage.getItem('guest_orders')
        if (localOrdersRaw) {
          try {
            setOrders(JSON.parse(localOrdersRaw))
          } catch (e) {
            console.error('Error parsing guest orders:', e)
          }
        }
        setIsLoading(false)
      }
    }

    checkSessionAndFetch()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        setIsLoading(true)
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error && data) setOrders(data)
            setIsLoading(false)
          })
      } else {
        const localOrdersRaw = localStorage.getItem('guest_orders')
        if (localOrdersRaw) {
          try {
            setOrders(JSON.parse(localOrdersRaw))
          } catch (e) {
            setOrders([])
          }
        } else {
          setOrders([])
        }
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-linen pt-[100px] pb-20 px-6 sm:px-16 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* HERO TITLE */}
        <div className="text-center mb-16 [perspective:1200px]">
          <h1 className="font-playfair font-normal uppercase text-charcoal leading-[0.9] tracking-tighter text-[42px] sm:text-[75px] select-none [transform-style:preserve-3d] mb-4">
            {"MY ORDERS".split("").map((char, idx) => (
              <span key={idx} className="inline-block letter-reveal origin-bottom">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          {session?.user ? (
            <p className="reveal-subtitle font-inter text-[12px] tracking-[3px] uppercase text-amber-deep font-semibold">
              Account: {session.user.email}
            </p>
          ) : (
            <p className="reveal-subtitle font-inter text-[12px] tracking-[3px] uppercase text-amber-deep font-semibold">
              Guest Session
            </p>
          )}
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-spice border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-inter text-[12px] tracking-[2px] uppercase text-stone font-medium">Loading history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-md border border-linen-dark/30 rounded-2xl p-12 text-center shadow-lg">
            <div className="w-16 h-16 bg-linen-dark/20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone">
              <Package size={28} />
            </div>
            <h2 className="font-playfair text-[24px] font-bold text-charcoal mb-3">No Orders Found</h2>
            <p className="font-inter text-[14px] text-stone font-light leading-[1.8] max-w-sm mx-auto mb-8">
              {session 
                ? "You haven't placed any pickup orders yet. Explore our menu to place your first order."
                : "No orders found on this device. Sign in with Google or place an order to get started."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/menu"
                className="bg-charcoal text-cream px-8 py-3.5 text-[11px] tracking-[3px] uppercase font-bold hover:bg-amber-spice hover:text-charcoal transition-all duration-300 rounded-lg inline-block text-center"
              >
                View Menu
              </Link>
              {!session && (
                <button
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                  className="bg-transparent border border-charcoal/30 text-charcoal px-8 py-3.5 text-[11px] tracking-[3px] uppercase font-bold hover:bg-charcoal hover:text-cream transition-all duration-300 rounded-lg"
                >
                  Sign In Now
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Guest Banner */}
            {!session && (
              <div className="bg-amber-spice/10 border border-amber-spice/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-playfair text-[18px] font-bold text-charcoal">Viewing Guest Orders</h3>
                  <p className="font-inter text-[12px] text-stone font-light mt-1">
                    These orders are saved locally on this browser. Sign in with Google to sync future orders to your account.
                  </p>
                </div>
                <button
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                  className="bg-charcoal text-cream px-6 py-2.5 text-[10px] tracking-[2px] uppercase font-bold hover:bg-amber-spice hover:text-charcoal transition-all duration-300 rounded whitespace-nowrap"
                >
                  Sign In
                </button>
              </div>
            )}

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/70 backdrop-blur-md border border-linen-dark/30 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Order Header Info */}
                <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-linen-dark/20">
                  <div>
                    <p className="text-[10px] tracking-[2px] uppercase text-stone font-medium mb-1">Order ID</p>
                    <p className="font-mono text-[13px] font-bold text-charcoal">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-amber-deep" />
                    <span className="font-inter text-[13px] text-stone">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.guest_info && (
                      <span className="bg-charcoal/10 text-charcoal text-[9px] font-bold uppercase tracking-[1.5px] px-2.5 py-0.5 rounded-full">
                        Guest
                      </span>
                    )}
                    <span className="bg-amber-spice/20 text-stone font-bold text-[11px] uppercase tracking-[2px] px-3 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="py-6 border-b border-linen-dark/20 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        {item.img && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-linen-dark/25">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-inter font-semibold text-[14px] text-charcoal">{item.name}</p>
                          <p className="font-inter text-[12px] text-stone font-light">Qty: {item.qty} · ${item.price} each</p>
                        </div>
                      </div>
                      <span className="font-playfair font-bold text-[14px] text-charcoal">
                        ${(parseFloat(item.price) * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pickup & Cost Summary */}
                <div className="pt-6 flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-linen/30 px-4 py-3.5 rounded-xl border border-linen-dark/15 w-fit">
                      <Clock size={18} className="text-amber-deep" />
                      <div>
                        <p className="text-[10px] tracking-[1.5px] uppercase text-stone font-medium leading-none mb-1">Pickup Time</p>
                        <p className="font-inter text-[13px] font-bold text-charcoal leading-none">{order.pickup_time}</p>
                      </div>
                    </div>
                    {order.guest_info && (
                      <p className="text-[11px] text-stone font-light px-1">
                        Contact: {order.guest_info.name} · {order.guest_info.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-[200px] self-end sm:self-auto">
                    <div className="flex justify-between text-[13px] text-stone">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[12px] text-stone/70">
                      <span>Tax (8%):</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[16px] font-bold text-charcoal border-t border-linen-dark/20 pt-2 mt-2">
                      <span className="font-playfair">Total:</span>
                      <span className="font-playfair">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
