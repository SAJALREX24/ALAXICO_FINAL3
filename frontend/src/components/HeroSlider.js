import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Alaxico Catalog Images as Hero Banners
const SLIDES = [
  {
    id: 1,
    image: "https://customer-assets.emergentagent.com/job_alaxico-store/artifacts/nr9rh3hz_1000158422.jpg",
    alt: "Alaxico Piston Compressor Nebulizer",
    ctaLink: "/products?category=Diagnostic%20Equipment",
  },
  {
    id: 2,
    image: "https://customer-assets.emergentagent.com/job_alaxico-store/artifacts/w8w3chjb_1000158424.jpg",
    alt: "Alaxico Electronic Blood Pressure Monitor",
    ctaLink: "/products?category=Patient%20Monitoring",
  },
  {
    id: 3,
    image: "https://customer-assets.emergentagent.com/job_alaxico-store/artifacts/zh92ftef_1000158426.jpg",
    alt: "Alaxico Flexible Digital Thermometer",
    ctaLink: "/products?category=Diagnostic%20Equipment",
  },
  {
    id: 4,
    image: "https://customer-assets.emergentagent.com/job_alaxico-store/artifacts/scah1m8u_1000158428.jpg",
    alt: "Alaxico Electric Hot Water Bag",
    ctaLink: "/products?category=Hospital%20Furniture",
  },
  {
    id: 5,
    image: "https://customer-assets.emergentagent.com/job_alaxico-store/artifacts/jsjdjfz5_1000158430.jpg",
    alt: "Alaxico Steamer Cum Vaporizer",
    ctaLink: "/products?category=Diagnostic%20Equipment",
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
    <section className="relative overflow-hidden" data-testid="hero-slider">
      {/* Main Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
              </div>

              {/* Content */}
              <div className="relative min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-full mb-4 sm:mb-6 animate-fade-in">
                      <slide.badgeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2" />
                      <span className="text-xs sm:text-sm font-semibold text-white">{slide.badge}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                      {slide.title}{' '}
                      <span className="text-yellow-300">{slide.highlight}</span>{' '}
                      {slide.subtitle}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Link to={slide.ctaLink}>
                        <Button
                          size="lg"
                          className="w-full sm:w-auto bg-white text-slate-900 hover:bg-white/90 shadow-xl text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6"
                        >
                          {slide.cta}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </Link>
                      <Link to={slide.secondaryLink}>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6"
                        >
                          {slide.secondaryCta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Desktop */}
      <button
        onClick={scrollPrev}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        aria-label="Previous slide"
        data-testid="hero-prev-button"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        aria-label="Next slide"
        data-testid="hero-next-button"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-10">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? 'w-8 sm:w-10 h-2.5 sm:h-3 bg-white'
                : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`hero-dot-${index}`}
          />
        ))}
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="hidden sm:flex justify-center gap-6 md:gap-12 lg:gap-16 text-white/90">
            <div className="text-center">
              <div className="text-lg md:text-xl lg:text-2xl font-bold">1000+</div>
              <div className="text-xs md:text-sm">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl lg:text-2xl font-bold">5000+</div>
              <div className="text-xs md:text-sm">Products Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl lg:text-2xl font-bold">50+</div>
              <div className="text-xs md:text-sm">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl lg:text-2xl font-bold">24/7</div>
              <div className="text-xs md:text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
