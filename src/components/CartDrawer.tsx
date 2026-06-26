'use client'
import { useEffect, useState } from 'react'
import { ShoppingBag, X, Minus, Plus, ArrowLeft } from 'lucide-react'
import { CartItem } from '../types'
import LoadingSpinner from './LoadingSpinner'
import { supabase } from '../lib/supabase'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  changeQty: (id: string, delta: number) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
  timeSlots: string[]
  showNotification?: (msg: string) => void
  isLoggedIn: boolean
  openLoginModal: () => void
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  changeQty,
  selectedTime,
  setSelectedTime,
  timeSlots,
  showNotification,
  isLoggedIn,
  openLoginModal
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})

  const subtotal = cart.reduce((acc, i) => acc + parseFloat(i.price) * i.qty, 0)

  // Reset guest form when drawer opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowGuestForm(false)
      setGuestName('')
      setGuestEmail('')
      setGuestPhone('')
      setErrors({})
    }
  }, [isOpen])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const formatPhoneNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    if (cleanValue.length === 0) return ''
    if (cleanValue.length <= 3) return `(${cleanValue}`
    if (cleanValue.length <= 6) return `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3)}`
    return `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 10)}`
  }

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phone?: string } = {}
    if (!guestName.trim()) newErrors.name = 'Name is required'
    if (!guestEmail.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(guestEmail)) {
      newErrors.email = 'Invalid email address'
    }
    const cleanPhone = guestPhone.replace(/\D/g, '')
    if (!guestPhone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = async () => {
    if (!isLoggedIn && !showGuestForm) {
      setShowGuestForm(true)
      return
    }

    if (!isLoggedIn && showGuestForm) {
      if (!validateForm()) return
    }

    if (cart.length === 0 || isCheckingOut) return

    setIsCheckingOut(true)
    try {
      const checkoutUrl = '/api/checkout'
      const customerEmail = isLoggedIn 
        ? (await supabase.auth.getUser()).data.user?.email || "customer@clovekitchen.com"
        : guestEmail

      const payload = {
        customer: {
          email: customerEmail
        },
        shoppingCart: {
          lineItems: [
            ...cart.map(item => ({
              name: item.notes ? `${item.name} (${item.notes})` : item.name,
              unitQty: item.qty,
              price: Math.round(parseFloat(item.price) * 100)
            })),
            {
              name: `[Pickup Time: ${selectedTime}]`,
              unitQty: 1,
              price: 0
            }
          ]
        },
        redirectUrl: `${window.location.origin}/?checkout_success=true`
      }

      const res = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errText = await res.text()
        let parsedErr = errText
        try {
          const errObj = JSON.parse(errText)
          parsedErr = errObj.error || errObj.message || errText
        } catch (e) {}
        throw new Error(parsedErr || 'Failed to initialize Clover Checkout')
      }

      const data = await res.json()
      if (data.href) {
        let supabaseOrderId = null
        if (isLoggedIn) {
          const { data: userData } = await supabase.auth.getUser()
          if (userData.user) {
            const { data: insertedOrder, error: orderError } = await supabase
              .from('orders')
              .insert({
                user_id: userData.user.id,
                items: cart.map(item => ({
                  id: item.id,
                  name: item.notes ? `${item.name} (${item.notes})` : item.name,
                  price: item.price,
                  qty: item.qty,
                  img: item.img
                })),
                subtotal: parseFloat(subtotal.toFixed(2)),
                tax: 0,
                total: parseFloat(subtotal.toFixed(2)),
                pickup_time: selectedTime,
                status: 'pending'
              })
              .select()
              .single()
            
            if (orderError) {
              console.error('Error saving pending order:', orderError)
            } else if (insertedOrder) {
              supabaseOrderId = insertedOrder.id
            }
          }
        }

        // Save the pending order details locally so they can be processed
        // only when we receive the success callback in App.tsx
        const pendingOrder = {
          isLoggedIn,
          userId: isLoggedIn ? (await supabase.auth.getUser()).data.user?.id : null,
          supabaseOrderId,
          checkoutId: data.id,
          items: cart.map(item => ({
            id: item.id,
            name: item.notes ? `${item.name} (${item.notes})` : item.name,
            price: item.price,
            qty: item.qty,
            img: item.img
          })),
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: 0,
          total: parseFloat(subtotal.toFixed(2)),
          pickup_time: selectedTime,
          guest_info: isLoggedIn ? null : {
            name: guestName,
            email: guestEmail,
            phone: guestPhone
          },
          id: isLoggedIn ? null : 'GUEST_' + Math.random().toString(36).substr(2, 9).toUpperCase()
        }
        
        localStorage.setItem('clove_pending_order', JSON.stringify(pendingOrder))
        window.location.href = data.href
      } else {
        throw new Error('No checkout URL returned from Clover')
      }

    } catch (err: any) {
      console.error('Checkout error:', err)
      const errorMsg = `Checkout failed: ${err.message}`
      if (showNotification) {
        showNotification(errorMsg)
      } else {
        alert(errorMsg)
      }
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {isCheckingOut && <LoadingSpinner />}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[120] bg-charcoal/15 backdrop-blur-[2px] transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar Drawer */}
      <aside 
        data-lenis-prevent
        className={`w-full sm:w-[380px] fixed top-0 right-0 bottom-0 bg-linen border-l border-linen-dark/40 z-[130] transition-transform duration-500 shadow-2xl flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="px-6 py-5 border-b border-linen-dark/40 bg-linen flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showGuestForm && (
              <button 
                onClick={() => setShowGuestForm(false)}
                className="p-1 text-stone hover:text-charcoal transition-colors hover:bg-linen-dark/10 rounded-full"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <p className="text-[10px] tracking-[3px] uppercase text-amber-deep font-semibold">
                {showGuestForm ? 'Checkout Details' : 'Your Order'}
              </p>
              <p className="text-stone text-[12px] mt-1 font-light flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-spice"></span>
                Pickup · 3083 Breckinridge Blvd
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone hover:text-charcoal transition-colors hover:bg-linen-dark/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pickup Time Section */}
        <div className="px-6 py-4 border-b border-linen-dark/20 bg-linen-light/30 flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] uppercase tracking-widest text-stone font-medium">Pickup Time</p>
            <span className="text-[11px] font-bold text-amber-deep bg-amber-spice/10 px-2 py-0.5 rounded leading-none">{selectedTime}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {timeSlots.map(slot => (
              <button 
                key={slot} 
                onClick={() => setSelectedTime(slot)}
                className={`flex-shrink-0 px-3 py-1.5 text-[11px] border rounded-md transition-all duration-200 ${
                  selectedTime === slot
                    ? 'bg-charcoal text-cream border-charcoal font-medium'
                    : 'border-linen-dark/40 text-stone hover:border-charcoal hover:bg-white/50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Items / Guest Form Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {showGuestForm ? (
            <div className="space-y-5 py-2">
              <div className="text-center pb-2">
                <button
                  onClick={() => {
                    onClose()
                    openLoginModal()
                  }}
                  className="w-full py-2.5 border border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cream text-[10px] tracking-[2px] uppercase font-bold transition-all duration-300 rounded"
                >
                  Sign In with Google
                </button>
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-linen-dark/30"></div>
                  <span className="flex-shrink mx-3 text-stone text-[10px] tracking-widest uppercase font-medium">or continue as guest</span>
                  <div className="flex-grow border-t border-linen-dark/30"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-[2.5px] uppercase text-stone font-semibold mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value)
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                    }}
                    placeholder="John Doe"
                    className={`w-full bg-white/70 border px-4 py-3 text-[13px] text-charcoal rounded focus:outline-none focus:bg-white transition-all ${
                      errors.name ? 'border-red-500' : 'border-linen-dark/40 focus:border-charcoal'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] tracking-[2.5px] uppercase text-stone font-semibold mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value)
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                    }}
                    placeholder="johndoe@example.com"
                    className={`w-full bg-white/70 border px-4 py-3 text-[13px] text-charcoal rounded focus:outline-none focus:bg-white transition-all ${
                      errors.email ? 'border-red-500' : 'border-linen-dark/40 focus:border-charcoal'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] tracking-[2.5px] uppercase text-stone font-semibold mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      setGuestPhone(formatted)
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }))
                    }}
                    placeholder="(555) 000-0000"
                    className={`w-full bg-white/70 border px-4 py-3 text-[13px] text-charcoal rounded focus:outline-none focus:bg-white transition-all ${
                      errors.phone ? 'border-red-500' : 'border-linen-dark/40 focus:border-charcoal'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-5 border border-linen-dark/20">
                <ShoppingBag className="text-linen-dark opacity-30" size={28} />
              </div>
              <p className="text-stone text-[14px] font-light leading-[1.8]">
                Your cart is empty.<br/>
                <span className="text-[12px] opacity-60">Add some delicious dishes!</span>
              </p>
            </div>
          ) : (
            <div className="divide-y divide-linen-dark/20">
              {cart.map(item => (
                <div key={item.id} className="py-5 flex items-start gap-4 group">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-linen-dark/20 relative">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-charcoal leading-tight truncate group-hover:text-amber-deep transition-colors">{item.name}</p>
                    {item.notes && (
                      <p className="text-[11px] text-stone font-light italic mt-1 leading-snug">
                        Note: {item.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2.5">
                       <div className="flex items-center border border-linen-dark/30 rounded bg-white/50">
                          <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 text-stone hover:text-charcoal hover:bg-linen-dark/10 transition-colors flex items-center justify-center text-xs">−</button>
                          <span className="text-charcoal text-[12px] font-bold w-6 text-center">{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 text-stone hover:text-charcoal hover:bg-linen-dark/10 transition-colors flex items-center justify-center text-xs">+</button>
                       </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair font-bold text-[14px] text-charcoal">
                      ${(parseFloat(item.price) * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-linen-dark/35 bg-linen/50 flex-shrink-0">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-[13px] text-stone">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[16px] font-semibold text-charcoal border-t border-linen-dark/20 pt-3 mt-3">
              <span className="font-playfair">Total</span>
              <span className="font-playfair">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className={`w-full py-4 text-[11px] tracking-[3px] uppercase font-bold transition-all duration-400 group ${
              cart.length > 0 && !isCheckingOut
              ? 'bg-charcoal text-cream hover:bg-amber-spice hover:text-charcoal shadow-lg hover:shadow-amber-spice/20' 
              : 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed border border-linen-dark/20'
            }`}
          >
            <span className="group-hover:tracking-[5px] transition-all duration-500">
              {isCheckingOut ? 'Processing...' : (showGuestForm ? 'Proceed to Payment' : 'Checkout Now')}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}

