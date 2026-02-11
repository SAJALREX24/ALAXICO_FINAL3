import React from 'react';
import { ExternalLink, Newspaper, Award, TrendingUp } from 'lucide-react';

const PRESS_ITEMS = [
  {
    id: 1,
    publication: 'Healthcare Today',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=50&fit=crop',
    headline: 'Alaxico Emerges as Trusted Healthcare Partner for Home Medical Equipment',
    date: 'January 2026',
    link: '#',
    type: 'feature'
  },
  {
    id: 2,
    publication: 'Medical Business Weekly',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&h=50&fit=crop',
    headline: 'How Alaxico is Making Quality Healthcare Equipment Accessible',
    date: 'December 2025',
    link: '#',
    type: 'interview'
  },
  {
    id: 3,
    publication: 'India Health Report',
    logo: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=100&h=50&fit=crop',
    headline: 'Top 10 Medical Equipment Suppliers in India - Alaxico Featured',
    date: 'November 2025',
    link: '#',
    type: 'ranking'
  },
  {
    id: 4,
    publication: 'Business Standard',
    logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=100&h=50&fit=crop',
    headline: 'Alaxico Expands Home Healthcare Product Range with 3-Year Warranty',
    date: 'October 2025',
    link: '#',
    type: 'news'
  },
];

const STATS = [
  { number: '10,000+', label: 'Products Sold' },
  { number: '500+', label: 'Happy Clinics' },
  { number: '4.8', label: 'Customer Rating' },
  { number: '50+', label: 'Cities Covered' },
];

const PressSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" data-testid="press-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Newspaper className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-700">In The News</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-2 sm:mb-4">
            Featured in <span className="text-purple-600">Press & Media</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-500">
            See what leading publications are saying about Alaxico
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stat.number}
                </p>
                <p className="text-sm sm:text-base text-purple-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Press Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PRESS_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={item.link}
              className="group bg-white rounded-xl border border-gray-200 hover:border-purple-200 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              data-testid={`press-card-${item.id}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Publication Logo Placeholder */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-24 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500 truncate px-2">{item.publication}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>

              {/* Headline */}
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 line-clamp-3 group-hover:text-purple-600 transition-colors">
                {item.headline}
              </h3>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.date}</span>
                <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded capitalize">
                  {item.type}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Awards/Certifications */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted & Certified</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <Award className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">ISO Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">100% Genuine Products</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Award className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">3 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressSection;
