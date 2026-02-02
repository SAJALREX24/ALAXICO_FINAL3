import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Activity, ShieldCheck, Truck, UserCheck, ArrowRight, Star, Stethoscope, BedDouble, Scissors, Heart, Microscope } from 'lucide-react';
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

  useEffect(() => {
    fetchData();
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 md:py-32" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6" data-testid="hero-title">
                Premium Medical Equipment for Healthcare Excellence
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed" data-testid="hero-description">
                Trusted by hospitals, clinics, and healthcare professionals across India. 
                Quality equipment with certified standards.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" data-testid="browse-products-button">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
                    Browse Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/bulk-order" data-testid="hero-bulk-enquiry-button">
                  <Button size="lg" variant="outline" className="border-2 hover:bg-blue-50 transition-all duration-300">
                    Bulk Orders
                  </Button>
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-7 w-7 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">ISO Certified</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="h-7 w-7 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center">
                    <UserCheck className="h-7 w-7 text-teal-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Verified Sellers</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-7 w-7 text-blue-700" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">24/7 Support</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1565594090530-d1ebc05b54b1?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="Medical Equipment"
                  className="w-full h-full object-cover"
                  data-testid="hero-image"
                />
              </div>
            </div>
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
                  className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
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
      <section className="py-16 bg-gradient-to-r from-blue-500 to-green-500" data-testid="cta-section">
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