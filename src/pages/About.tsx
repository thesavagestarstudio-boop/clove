'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

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

    // Arrow Reveal
    gsap.from('.arrow-reveal', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: 'power2.out'
    })

    // Parallax hero image
    gsap.to('.hero-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // Staggered Text Reveal in Story Section
    gsap.from('.story-text-reveal > *', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top 80%'
      }
    })

    // Image Reveal in Story Section (Fade + Scale)
    gsap.from('.story-image-reveal', {
      scale: 1.08,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top 80%'
      }
    })

    // Staggered Text Reveal in Chef Section
    gsap.from('.chef-text-reveal > *', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.chef-section',
        start: 'top 80%'
      }
    })

    // Image Reveal in Chef Section (Fade + Scale)
    gsap.from('.chef-image-reveal', {
      scale: 1.08,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.chef-section',
        start: 'top 80%'
      }
    })

    // Staggered Text Reveal in Vision Section
    gsap.from('.vision-text-reveal > *', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.vision-section',
        start: 'top 80%'
      }
    })

    // Staggered Images Reveal in Vision Section
    gsap.from('.vision-image-reveal', {
      y: 30,
      scale: 1.05,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.vision-section',
        start: 'top 80%'
      }
    })
  }, { scope: containerRef })

  return (
    <motion.div
      ref={containerRef}
      className="overflow-x-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* SECTION 1 — HERO */}
      <section ref={heroRef} className="relative h-[100dvh] flex items-center justify-center overflow-hidden [perspective:1200px]">
        <div className="absolute inset-0 z-0">
          <img
            src="/Clove Bruschettas.jpg"
            alt="CLOVE cuisine"
            className="hero-img w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-charcoal/65" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center justify-center">
          <h1 className="font-playfair font-normal uppercase leading-[1.05] mb-8 select-none [transform-style:preserve-3d]"
              style={{ fontSize: 'clamp(58px, 7.5vw, 80px)', color: '#b6a68b' }}>
            {"ABOUT US".split("").map((char, idx) => (
              <span
                key={idx}
                className="inline-block letter-reveal origin-bottom"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <div className="arrow-reveal text-cream/30 text-3xl mt-16 animate-bounce">↓</div>
        </div>
      </section>

      {/* SECTION 3 — STORY */}
      <section className="story-section bg-linen py-20 px-8 sm:px-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 story-text-reveal">
            <h2 className="font-playfair text-[32px] sm:text-[44px] font-bold text-charcoal leading-[1.1]">
              WELCOME TO CLOVE
            </h2>
            <div className="w-14 h-0.5 bg-amber-spice my-6 animate-width" />
            <div className="space-y-6">
              <p className="font-inter text-[16px] text-stone font-normal leading-[1.9]">
                Clove is a Indian fusion restaurant where tradition meets innovation, bringing together the rich flavors of India with contemporary culinary creativity. Our culinary team combines traditional Indian techniques with contemporary presentation to craft dishes that feel both familiar and exciting. Every ingredient, flavor, and detail is thoughtfully chosen to create a modern interpretation of Indian dining. Located in Duluth, Georgia, Clove is redefining Indian fusion cuisine by offering a sophisticated yet approachable experience designed for today’s generation of food lovers.
              </p>
              <p className="font-inter text-[18px] text-amber-deep font-medium italic mt-8">
                Clove — where flavor, culture, and creativity come together.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 story-image-reveal">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-spice translate-x-6 translate-y-6 -z-10" />
              <img src="/Rasmalai & Coffee Tiramisu Martini.jpg"
                alt="Rasmalai & Coffee Tiramisu Martini" loading="lazy" decoding="async" className="w-full h-[500px] sm:h-[600px] object-cover relative z-10 will-change-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CHEF */}
      <section className="chef-section flex flex-col md:flex-row min-h-[600px] overflow-hidden">
        <div className="w-full md:w-1/2 bg-[#2A2623] px-8 sm:px-16 md:px-24 py-20 flex flex-col justify-center chef-text-reveal">
          <h2 className="font-playfair text-[32px] sm:text-[44px] font-bold leading-[1.1] uppercase" style={{ color: '#D49653' }}>
            Meet Executive Chef<br/>Parveen K. Sharma
          </h2>
          <p className="font-inter text-[14px] tracking-[4px] uppercase text-amber-spice mt-4 mb-2 font-bold">
            CULINARY VISIONARY
          </p>
          <div className="w-14 h-0.5 bg-amber-spice my-6" />
          <div className="space-y-6 max-w-[500px]">
            <p className="font-inter text-[15px] text-cream/80 font-normal leading-[1.8]">
              At the heart of Clove’s culinary experience is Executive Chef Parveen K. Sharma — an internationally experienced chef and culinary visionary known for blending authentic Indian flavors with refined modern presentation.
            </p>
            <p className="font-inter text-[15px] text-cream/80 font-normal leading-[1.8]">
              With over two decades of experience across luxury hotels, acclaimed restaurant concepts, and global hospitality ventures, Chef Parveen has built a reputation for creating bold and memorable dining experiences rooted in tradition while embracing innovation.
            </p>
          </div>
          <a href="/menu" className="mt-10 inline-flex items-center gap-2 text-cream text-[12px] tracking-[2px] uppercase font-medium border-b border-cream/30 pb-1 hover:border-cream transition-all duration-300 w-fit">
            Taste the Signature <span className="text-[10px]">↗</span>
          </a>
        </div>
        
        <div className="w-full md:w-1/2 h-[450px] md:h-[600px] lg:h-auto relative overflow-hidden chef-image-reveal border-[12px] border-[#D49653] md:border-0">
          <img
            src="/CHEF.jpeg"
            alt="Executive Chef Parveen K. Sharma"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </section>

      {/* SECTION 5 — CULINARY VISION */}
      <section className="vision-section bg-[#BFB4A3] py-24 px-8 sm:px-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Centered Heading with labels */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 mb-8 vision-text-reveal">
            <span className="font-inter text-[11px] tracking-[4px] uppercase text-charcoal/60 font-semibold">
              EXCEPTIONAL FOOD
            </span>
            <h2 className="font-playfair text-[32px] sm:text-[52px] font-bold text-charcoal leading-[1.05] uppercase text-center max-w-[800px]">
              Sophisticated Vision
            </h2>
            <span className="font-inter text-[11px] tracking-[4px] uppercase text-charcoal/60 font-semibold">
              CRAFTED EXPERIENCE
            </span>
          </div>

          {/* Centered bio vision text */}
          <div className="max-w-[800px] mx-auto text-center mb-16 vision-text-reveal">
            <p className="font-inter text-[15px] sm:text-[17px] text-charcoal/80 font-normal leading-[1.9]">
              At Clove, Chef Parveen K. Sharma brings a fresh and sophisticated vision to modern Indian dining — where authenticity meets innovation, and every plate is crafted to leave a lasting impression.
            </p>
          </div>

          {/* 3 columns of vertical culinary images */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {[
              { img: '/Paneer Pocket Rocket.jpg', alt: 'Paneer Pocket Rocket' },
              { img: '/Saffron Lamb-GheeNi Bites.jpg', alt: 'Saffron Lamb-GheeNi Bites' },
              { img: '/The Clove Stack Burger.jpg', alt: 'The Clove Stack Burger' }
            ].map((item, idx) => (
              <div key={idx} className="overflow-hidden shadow-2xl aspect-[4/5] bg-charcoal/10 border border-charcoal/5 vision-image-reveal">
                <img
                  src={item.img}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </motion.div>
  )
}
