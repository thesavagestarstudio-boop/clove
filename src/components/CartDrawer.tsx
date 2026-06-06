'use client'
import { useEffect, useState } from 'react'
import { ShoppingBag, X, Minus, Plus } from 'lucide-react'
import { CartItem } from '../types'

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
  const subtotal = cart.reduce((acc, i) => acc + parseFloat(i.price) * i.qty, 0)

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

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      if (showNotification) {
        showNotification('Please log in to checkout')
      }
      onClose()
      openLoginModal()
      return
    }

    if (cart.length === 0 || isCheckingOut) return

    setIsCheckingOut(true)
    try {
      const checkoutUrl = '/api/checkout'

      const payload = {
        customer: {
          email: "customer@clovekitchen.com"
        },
        shoppingCart: {
          lineItems: cart.map(item => ({
            name: item.name,
            unitQty: item.qty,
            price: Math.round(parseFloat(item.price) * 100)
          }))
        },
        redirectUrl: `${window.location.origin}/`
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
          <div>
            <p className="text-[10px] tracking-[3px] uppercase text-amber-deep font-semibold">Your Order</p>
            <p className="text-stone text-[12px] mt-1 font-light flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-amber-spice"></span>
              Pickup · 3083 Breckinridge Blvd
            </p>
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

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {cart.length === 0 ? (
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
            <div className="flex justify-between text-[12px] text-stone">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-stone/60">
              <span>Tax (8%)</span><span>${(subtotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[16px] font-semibold text-charcoal border-t border-linen-dark/20 pt-3 mt-3">
              <span className="font-playfair">Total</span>
              <span className="font-playfair">${(subtotal * 1.08).toFixed(2)}</span>
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
              {isCheckingOut ? 'Processing...' : 'Checkout Now'}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
