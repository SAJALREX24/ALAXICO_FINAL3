import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Alaxico Landscape Hero Banners
const SLIDES = [
  {
    id: 1,
    image: "https://static.prod-images.emergentagent.com/jobs/63efdd01-ddd2-4f30-9bfd-9187efddd23c/images/046f272b7b55875ce5c75dcca7e7d30ea767f99869090145cf5daf75b7eddcf0.png",
    alt: "Alaxico - Your Personal Healthcare Partner",
    title: "Your Personal Healthcare Partner",
    subtitle: "Premium medical equipment for home & clinical use",
    ctaLink: "/products",
    ctaText: "Shop Now",
  },
  {
    id: 2,
    image: "https://static.prod-images.emergentagent.com/jobs/63efdd01-ddd2-4f30-9bfd-9187efddd23c/images/a41e3b64fb9e5f4f884da5d726fdaec93c8c0dbbb406d94e98008c4f1aa7d4bc.png",
    alt: "Alaxico Nebulizers - Breathe Easy Live Fully",
    title: "Breathe Easy, Live Fully",
    subtitle: "Advanced nebulizers for respiratory care",
    ctaLink: "/products?category=Diagnostic%20Equipment",
    ctaText: "Shop Nebulizers",
  },
  {
    id: 3,
    image: "https://static.prod-images.emergentagent.com/jobs/63efdd01-ddd2-4f30-9bfd-9187efddd23c/images/46c296af5d11cbe2c6b8020dbccf3b1412fe8284e5c1103863ae48c38a53b1a7.png",
    alt: "Alaxico Blood Pressure Monitors - Your Heart's Best Friend",
    title: "Your Heart's Best Friend",
    subtitle: "Accurate digital BP monitors for daily monitoring",
    ctaLink: "/products?category=Patient%20Monitoring",
    ctaText: "Shop BP Monitors",
  },
  {
    id: 4,
    image: "https://static.prod-images.emergentagent.com/jobs/63efdd01-ddd2-4f30-9bfd-9187efddd23c/images/a4bcb4ffaece8705c66f815d98e3c5813aaf535d00b4fc86fa615d94d4896134.png",
    alt: "Alaxico Hot Water Bags - Technology for Healthy Life",
    title: "Technology for Healthy Life",
    subtitle: "Safe electric hot water bags for pain relief",
    ctaLink: "/products?category=Hospital%20Furniture",
    ctaText: "Shop Now",
  },
];

const HeroSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden bg-gray-100" data-testid="hero-slider">
      {/* Main Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
              {/* Image Container - Taller on mobile for breathing room */}
              <div className="relative w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[450px] xl:h-[520px]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading={slide.id === 1 ? "eager" : "lazy"}
                />
                {/* Gradient Overlay - Stronger on mobile for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent sm:from-black/50 sm:via-black/30" />
                
                {/* Content Overlay - Centered vertically with more space */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
                    <div className="max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg">
                      {/* Title - Larger on mobile, better line height */}
                      <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 drop-shadow-lg leading-snug">
                        {slide.title}
                      </h2>
                      {/* Subtitle - Now visible on mobile too */}
                      <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 md:mb-6 drop-shadow-md line-clamp-2">
                        {slide.subtitle}
                      </p>
                      {/* CTA Button - Larger touch target on mobile */}
                      <Link to={slide.ctaLink}>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-full text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                          {slide.ctaText}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Smaller on mobile */}
      <button
        onClick={scrollPrev}
        className="absolute left-1 sm:left-3 lg:left-6 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 hover:bg-white transition-all z-10 shadow-md"
        aria-label="Previous slide"
        data-testid="hero-prev-button"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-1 sm:right-3 lg:right-6 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 hover:bg-white transition-all z-10 shadow-md"
        aria-label="Next slide"
        data-testid="hero-next-button"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </button>

      {/* Dots Indicator - Smaller on mobile */}
      <div className="absolute bottom-2 sm:bottom-3 lg:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 lg:gap-2 z-10">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? 'w-4 sm:w-6 lg:w-8 h-1.5 sm:h-2 lg:h-2.5 bg-purple-600'
                : 'w-1.5 sm:w-2 lg:w-2.5 h-1.5 sm:h-2 lg:h-2.5 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`hero-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
