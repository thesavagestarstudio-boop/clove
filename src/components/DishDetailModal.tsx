'use client'
import React, { useEffect, useState, useRef } from 'react'
import { X, Info, Minus, Plus } from 'lucide-react'
import { MenuItem } from '../types'
import { motion, AnimatePresence } from 'motion/react'

interface DishDetailModalProps {
  isOpen: boolean
  onClose: () => void
  item: MenuItem | null
  onAddToCart: (item: MenuItem, qty: number, notes: string) => void
}

export default function DishDetailModal({
  isOpen,
  onClose,
  item,
  onAddToCart
}: DishDetailModalProps) {
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      setQty(1)
      setNotes('')
      setShowStickyHeader(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, item])

  if (!item) return null

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    // Show sticky header when scrolled past the image (approx 250px)
    if (scrollTop > 220) {
      setShowStickyHeader(true)
    } else {
      setShowStickyHeader(false)
    }
  }

  const handleAddClick = () => {
    onAddToCart(item, qty, notes)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/85 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            data-lenis-prevent
            className="bg-white max-w-[520px] w-full h-[100vh] sm:h-[88vh] sm:max-h-[750px] flex flex-col sm:rounded-2xl overflow-hidden shadow-2xl relative z-10"
          >
            {/* Sticky Header when Scrolled */}
            <div
              className={`absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-linen-dark/20 px-6 py-4 flex items-center justify-between z-20 transition-all duration-300 ${
                showStickyHeader ? 'opacity-100 translate-y-0 shadow-sm' : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}
            >
              <h3 className="font-playfair font-bold text-charcoal uppercase text-[15px] tracking-wider truncate max-w-[340px]">
                {item.name}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-stone hover:text-charcoal transition-colors hover:bg-linen-dark/15 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              data-lenis-prevent
              className="flex-1 overflow-y-auto pb-[90px] hide-scrollbar"
            >
              {/* Image Header */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/10] relative overflow-hidden bg-linen-dark/15">
                {/* Floating Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-charcoal w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all z-10 hover:scale-105"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Price */}
              <div className="px-6 pt-6">
                <h2 className="font-playfair font-normal uppercase text-charcoal text-[22px] tracking-wide leading-tight">
                  {item.name}
                </h2>
                <p className="font-playfair font-bold text-[18px] text-amber-deep mt-2">
                  ${parseFloat(item.price).toFixed(2)}
                </p>
                <p className="font-inter font-light text-[13px] text-stone/90 leading-relaxed mt-3.5">
                  {item.desc}
                </p>
              </div>

              <div className="border-t border-linen-dark/20 mt-6 mx-6" />

              {(() => {
                const nameLower = item.name.toLowerCase();
                const isBread = nameLower.includes('naan') || 
                                nameLower.includes('roti') || 
                                nameLower.includes('paratha') || 
                                nameLower.includes('kulcha') || 
                                nameLower.includes('bread');
                const isBreadRestricted = isBread && nameLower.trim() !== 'butter naan' && nameLower.trim() !== 'garlic naan';
                const dineInOnly = nameLower.includes('bruschetta') || 
                                   nameLower.includes('midnight cacao') ||
                                   isBreadRestricted;

                if (dineInOnly) {
                  return (
                    <div className="px-6 py-10 text-center">
                      <div className="inline-block bg-amber-spice/10 border border-amber-spice/30 text-amber-deep rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[2px] mb-4">
                        {isBreadRestricted ? 'Unavailable' : 'Dine-in Only'}
                      </div>
                      <p className="text-[14px] text-stone/80 font-light leading-relaxed max-w-[380px] mx-auto">
                        {isBreadRestricted 
                          ? "No other naan’s are available this weekend only Butter Naan and Garlic Naan."
                          : "This item is crafted exclusively for our dine-in guests to preserve its texture, temperature, and presentation. It is not available for takeout."
                        }
                      </p>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Special Instructions Section */}
                    <div className="px-6 pt-6">
                      <label className="block text-[11px] tracking-[2px] uppercase text-charcoal font-bold mb-2.5">
                        Special Instructions
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add a note (e.g. no nuts, no onions)."
                        className="w-full bg-white border border-linen-dark/40 rounded-xl px-4 py-3 text-[13px] text-charcoal focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal/10 transition-all min-h-[100px] placeholder:text-stone/40 resize-none"
                      />

                      {/* Request Advisory disclaimer */}
                      <div className="flex items-start gap-3 bg-linen-light/20 border border-linen-dark/15 rounded-xl p-4 mt-3">
                        <Info size={16} className="text-stone/60 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-stone uppercase tracking-wider leading-none mb-1">
                            Request advisory
                          </p>
                          <p className="text-[11px] text-stone/70 font-light leading-relaxed">
                            We'll do our best to accommodate special requests but may not be able to honor all substitutes. Extra charges may apply.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-linen-dark/20 mt-6 mx-6" />

                    {/* Quantity Section */}
                    <div className="px-6 py-6 flex justify-between items-center">
                      <span className="text-[13px] font-bold tracking-[1.5px] uppercase text-charcoal">
                        Quantity
                      </span>
                      <div className="flex items-center gap-4 bg-linen-light/35 border border-linen-dark/20 rounded-full px-3 py-1.5">
                        <button
                          onClick={() => setQty(prev => Math.max(1, prev - 1))}
                          disabled={qty <= 1}
                          className="w-8 h-8 rounded-full border border-linen-dark/30 bg-white flex items-center justify-center text-charcoal hover:bg-linen-light hover:border-charcoal transition-colors disabled:opacity-30 disabled:hover:bg-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-[14px] text-charcoal w-6 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(prev => prev + 1)}
                          className="w-8 h-8 rounded-full border border-linen-dark/30 bg-white flex items-center justify-center text-charcoal hover:bg-linen-light hover:border-charcoal transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-linen-dark/25 bg-white/95 backdrop-blur-md z-10">
              {(() => {
                const nameLower = item.name.toLowerCase();
                const isBread = nameLower.includes('naan') || 
                                nameLower.includes('roti') || 
                                nameLower.includes('paratha') || 
                                nameLower.includes('kulcha') || 
                                nameLower.includes('bread');
                const isBreadRestricted = isBread && nameLower.trim() !== 'butter naan' && nameLower.trim() !== 'garlic naan';
                const dineInOnly = nameLower.includes('bruschetta') || 
                                   nameLower.includes('midnight cacao') ||
                                   isBreadRestricted;

                if (dineInOnly) {
                  return (
                    <div className="w-full py-4 bg-stone/10 text-stone/50 rounded-full text-center text-[11px] tracking-[3px] uppercase font-bold border border-stone/20 select-none">
                      {isBreadRestricted ? 'Unavailable' : 'Not Available for Takeout'}
                    </div>
                  );
                }

                return (
                  <button
                    onClick={handleAddClick}
                    className="w-full py-4 bg-charcoal text-cream hover:bg-[#00503D] hover:text-white transition-all duration-300 rounded-full flex justify-between items-center px-8 text-[11px] tracking-[3px] uppercase font-bold shadow-lg hover:shadow-[#00503D]/20"
                  >
                    <span>Add to Cart</span>
                    <span className="font-playfair text-[14px] font-bold">
                      ${(parseFloat(item.price) * qty).toFixed(2)}
                    </span>
                  </button>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
