import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Activity, ShieldCheck, Truck, UserCheck, ArrowRight, Star, Stethoscope, BedDouble, Scissors, Heart, Microscope, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import VerificationBadge from '../components/VerificationBadge';

const categoryIcons = {
  'Diagnostic Equipment': Stethoscope,
  'Hospital Furniture': BedDouble,
  'Surgical Instruments': Scissors,
  'Patient Monitoring': Heart,
  'Lab Equipment': Microscope,
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchData();
    
    // Mouse move handler for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, reviewsRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/reviews/featured'),
      ]);
      
      setFeaturedProducts(productsRes.data.slice(0, 8));
      setCategories(categoriesRes.data);
      setFeaturedReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.post('/cart/add', {
        product_id: product.id,
        quantity: 1,
      });
      toast.success('Added to cart!', {
        description: product.name,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error('Failed to add to cart');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" data-testid="home-page">
      {/* 3D Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* 3D Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"></div>
        
        {/* Animated Medical Cross - 3D Center */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
          style={{
            transform: `translate(-50%, -50%) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* 3D Medical Cross */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div className="relative w-64 h-64">
              {/* Vertical bar */}
              <div 
                className="absolute left-1/2 top-0 w-20 h-64 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg -translate-x-1/2"
                style={{
                  transform: `translateX(-50%) translateZ(30px)`,
                  boxShadow: '0 25px 50px rgba(59, 130, 246, 0.4)',
                }}
              ></div>
              {/* Horizontal bar */}
              <div 
                className="absolute top-1/2 left-0 w-64 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-lg -translate-y-1/2"
                style={{
                  transform: `translateY(-50%) translateZ(30px)`,
                  boxShadow: '0 25px 50px rgba(16, 185, 129, 0.4)',
                }}
              ></div>
              {/* Center Circle */}
              <div 
                className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  transform: `translate(-50%, -50%) translateZ(60px)`,
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Plus className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating 3D Medical Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => {
            const icons = [Stethoscope, Heart, Activity, Microscope, Scissors];
            const Icon = icons[i % icons.length];
            const positions = [
              { top: '15%', left: '10%', delay: 0 },
              { top: '20%', right: '15%', delay: 1 },
              { bottom: '25%', left: '8%', delay: 2 },
              { bottom: '30%', right: '12%', delay: 3 },
              { top: '45%', left: '5%', delay: 4 },
              { top: '50%', right: '8%', delay: 5 },
              { top: '70%', left: '15%', delay: 6 },
              { bottom: '15%', right: '20%', delay: 7 },
            ];
            const pos = positions[i];
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  ...pos,
                  transform: `translateZ(${(i % 3) * 20}px) rotateY(${mousePosition.x * (i % 2 ? 1 : -1)}deg)`,
                  transformStyle: 'preserve-3d',
                  animation: `float3d ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${pos.delay * 0.5}s`,
                }}
              >
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm"
                  style={{
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 
              className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6"
              data-testid="hero-title"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              Premium Medical
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Equipment Hub
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
              Trusted by 1000+ hospitals, clinics, and healthcare professionals across India.
              <br />
              Quality equipment with certified standards.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link to="/products" data-testid="browse-products-button">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/bulk-order" data-testid="hero-bulk-enquiry-button">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Bulk Orders
                </Button>
              </Link>
            </div>
            
            {/* 3D Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { Icon: ShieldCheck, text: 'ISO Certified', color: 'blue' },
                { Icon: Truck, text: 'Fast Delivery', color: 'green' },
                { Icon: UserCheck, text: 'Verified Sellers', color: 'teal' },
                { Icon: Activity, text: '24/7 Support', color: 'blue' },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="relative group"
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <div 
                    className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-${badge.color}-100 to-${badge.color}-200 rounded-xl flex items-center justify-center`}>
                      <badge.Icon className={`h-7 w-7 text-${badge.color}-600`} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{badge.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-blue-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4" data-testid="categories-title">
              Browse by Category
            </h2>
            <p className="text-slate-600">Find the right equipment for your healthcare facility</p>
          </div>
          
          <div className="category-scroll">
            <div className="flex gap-4 pb-4" style={{minWidth: 'max-content'}}>
              {categories.map((category, index) => {
                const IconComponent = categoryIcons[category] || Activity;
                return (
                  <Link
                    key={category}
                    to={`/products?category=${category}`}
                    className="category-card group bg-gradient-to-br from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all duration-300 hover:shadow-xl min-w-[220px] flex-shrink-0"
                    data-testid={`category-card-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <IconComponent className="h-10 w-10 text-blue-600 mx-auto mb-3 group-hover:scale-105 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-center">
                      {category}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 text-center">Explore products</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16" data-testid="featured-products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4" data-testid="featured-products-title">
              Featured Products
            </h2>
            <p className="text-slate-600">Top-quality medical equipment for professionals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="featured-product" style={{animationDelay: `${index * 0.1}s`}}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      {featuredReviews.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50" data-testid="reviews-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4" data-testid="reviews-title">
                What Our Customers Say
              </h2>
              <p className="text-slate-600">Trusted by healthcare professionals across India</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredReviews.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  data-testid={`review-card-${review.id}`}
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{review.user?.name}</p>
                      {review.product && (
                        <p className="text-sm text-slate-500">{review.product.name}</p>
                      )}
                    </div>
                    {review.user && (
                      <VerificationBadge
                        verification_status={review.user.verification_status}
                        buyer_type={review.user.buyer_type}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 cta-section" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="cta-title">
            Need Bulk Orders?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Get special pricing for hospitals, clinics, and distributors. Contact us for custom quotes.
          </p>
          <Link to="/bulk-order" data-testid="cta-bulk-enquiry-button">
            <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Request Bulk Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;