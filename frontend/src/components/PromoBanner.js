import React, { useState, useEffect } from 'react';
import { X, Truck, Gift, CreditCard, Percent, Clock } from 'lucide-react';

const PROMO_MESSAGES = [
  {
    icon: Percent,
    text: "UP TO 50% OFF on Selected Products",
    highlight: "50% OFF",
    color: "text-yellow-300"
  },
  {
    icon: CreditCard,
    text: "Extra 5% OFF on Prepaid Orders",
    highlight: "5% OFF",
    color: "text-green-300"
  },
  {
    icon: Gift,
    text: "Free Gifts on Orders Above ₹1499",
    highlight: "Free Gifts",
    color: "text-pink-300"
  },
  {
    icon: Truck,
    text: "FREE Delivery on Orders Above ₹999",
    highlight: "FREE Delivery",
    color: "text-blue-300"
  },
  {
    icon: Clock,
    text: "Same Day Dispatch for Orders Before 2 PM",
    highlight: "Same Day",
    color: "text-orange-300"
  }
];

const PromoBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentPromo = PROMO_MESSAGES[currentIndex];
  const IconComponent = currentPromo.icon;

  return (
    <div 
      className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white py-2 relative overflow-hidden"
      data-testid="promo-banner"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-center">
          {/* Left dots indicator */}
          <div className="hidden sm:flex items-center space-x-1 mr-4">
            {PROMO_MESSAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to promo ${idx + 1}`}
              />
            ))}
          </div>

          {/* Promo content */}
          <div 
            className={`flex items-center justify-center space-x-2 transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${currentPromo.color} flex-shrink-0`} />
            <p className="text-xs sm:text-sm font-medium text-center">
              <span className={`font-bold ${currentPromo.color}`}>{currentPromo.highlight}</span>
              {' '}{currentPromo.text.replace(currentPromo.highlight, '').trim()}
            </p>
          </div>

          {/* Right dots indicator */}
          <div className="hidden sm:flex items-center space-x-1 ml-4">
            {PROMO_MESSAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to promo ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close promotional banner"
        data-testid="close-promo-banner"
      >
        <X className="w-4 h-4 text-white/70 hover:text-white" />
      </button>
    </div>
  );
};

export default PromoBanner;
