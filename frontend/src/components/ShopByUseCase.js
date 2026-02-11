import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Stethoscope, Home, FlaskConical, Siren, Heart, Baby, Dumbbell } from 'lucide-react';

const USE_CASES = [
  {
    id: 'hospitals',
    name: 'For Hospitals',
    description: 'Complete hospital equipment solutions',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    link: '/products?useCase=hospitals',
    products: ['Patient Monitors', 'Hospital Beds', 'Surgical Equipment']
  },
  {
    id: 'clinics',
    name: 'For Clinics',
    description: 'Essential clinic equipment',
    icon: Stethoscope,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    link: '/products?useCase=clinics',
    products: ['BP Monitors', 'Stethoscopes', 'Examination Tables']
  },
  {
    id: 'homecare',
    name: 'Home Care',
    description: 'Healthcare at your home',
    icon: Home,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    link: '/products?useCase=homecare',
    products: ['Nebulizers', 'BP Monitors', 'Thermometers']
  },
  {
    id: 'labs',
    name: 'For Labs',
    description: 'Laboratory equipment & supplies',
    icon: FlaskConical,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    link: '/products?useCase=labs',
    products: ['Microscopes', 'Centrifuges', 'Test Kits']
  },
  {
    id: 'emergency',
    name: 'Emergency',
    description: 'Emergency & first aid equipment',
    icon: Siren,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    link: '/products?useCase=emergency',
    products: ['First Aid Kits', 'Stretchers', 'Oxygen Equipment']
  },
  {
    id: 'elderly',
    name: 'Elderly Care',
    description: 'Senior citizen healthcare',
    icon: Heart,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    link: '/products?useCase=elderly',
    products: ['Walking Aids', 'BP Monitors', 'Wheelchairs']
  },
];

const ShopByUseCase = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white" data-testid="shop-by-usecase-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-2 sm:mb-4">
            Shop by <span className="text-purple-600">Use Case</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-500">
            Find the right equipment for your specific needs
          </p>
        </div>

        {/* Use Case Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {USE_CASES.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <Link
                key={useCase.id}
                to={useCase.link}
                className="group relative bg-white border-2 border-gray-100 hover:border-purple-200 rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                data-testid={`usecase-card-${useCase.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 ${useCase.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${useCase.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-center mb-1 group-hover:text-purple-600 transition-colors">
                  {useCase.name}
                </h3>
                <p className="text-xs text-gray-500 text-center hidden sm:block">
                  {useCase.description}
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <span className="text-purple-600 text-xs">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link 
            to="/products" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            View All Products
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByUseCase;
