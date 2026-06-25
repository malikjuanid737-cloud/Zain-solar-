import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../data/products';

interface HeroProps {
  onStartShopping: () => void;
  onViewKits: () => void;
}

export default function Hero({ onStartShopping, onViewKits }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Get rid of electricity bills permanently!",
      subtitle: "Zain Solar Smart Systems",
      highlight: "Reduce your electricity bill to 0 PKR!",
      desc: "Get Pakistan's premium, high-quality monocrystalline solar panels and complete systems at the most affordable market rates with a 25-year performance warranty.",
      ctaText: "Shop Now",
      secondaryCtaText: "Compare Kits",
      badge: "Summer Special Offer 🔥",
      image: HERO_BANNER_IMAGE,
      darkBg: true
    },
    {
      title: "Modern Lithium Batteries - Long Backup",
      subtitle: "Zain Solar Li-Ultra Series",
      highlight: "6000+ Life Cycles, 10-Year Warranty",
      desc: "Forget old lead-acid tubular batteries and upgrade to the world's most advanced Lithium Iron Phosphate (LiFePO4) batteries that run for years without any maintenance issues.",
      ctaText: "View Batteries",
      secondaryCtaText: "Free Consultation",
      badge: "Most Durable Backup ⚡",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1920",
      darkBg: false
    },
    {
      title: "Net-Metering Ready Hybrid Inverters",
      subtitle: "Smart Inverters with Wifi App",
      highlight: "Sell excess electricity back to the grid!",
      desc: "Our three-phase smart hybrid inverters are fully certified for net-metering and feature Wi-Fi app monitoring so you can track your energy production in real time from anywhere.",
      ctaText: "Find Inverters",
      secondaryCtaText: "Net Metering Guide",
      badge: "Government Approved 🛡️",
      image: "https://images.unsplash.com/photo-1620038650424-85e6512a7a24?auto=format&fit=crop&q=80&w=1920",
      darkBg: true
    }
  ];

  // Auto scroll slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="hero-slider" className="relative h-[500px] md:h-[600px] w-full bg-[#121212] overflow-hidden select-none">
      
      {/* Slides container */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background image overlay */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transform scale-105 transition-transform duration-[7000ms]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/95 via-[#1A1A1A]/80 to-transparent"></div>
              </div>

              {/* Slider Content */}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 text-white">
                <div className="max-w-2xl space-y-6">
                  
                  {/* Promo Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    <span>{slide.badge}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-brand-red font-mono font-bold tracking-widest text-xs md:text-sm uppercase">{slide.subtitle}</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight tracking-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-yellow-400">
                      {slide.highlight}
                    </p>
                  </div>

                  <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans font-normal">
                    {slide.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={onStartShopping}
                      className="px-8 py-3 bg-brand-red hover:bg-[#CC0000] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-brand-red/20 transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4 fill-white text-white" />
                      <span>{slide.ctaText}</span>
                    </button>
                    <button
                      onClick={onViewKits}
                      className="px-8 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold rounded-full transition-all backdrop-blur-sm cursor-pointer"
                    >
                      {slide.secondaryCtaText}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-brand-red border border-white/10 text-white transition-colors cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-brand-red border border-white/10 text-white transition-colors cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-brand-red' : 'w-2.5 bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
