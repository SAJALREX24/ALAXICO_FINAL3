import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ShoppingCart, Star, Package, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import EMICalculator from '../components/EMICalculator';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  
  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      const [productRes, reviewsRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`),
      ]);
      setProduct(productRes.data);
      setReviews(reviewsRes.data);
      
      // Add to recently viewed
      if (productRes.data) {
        addToRecentlyViewed(productRes.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', {
        product_id: product.id,
        quantity: 1,
      });
      toast.success('Added to cart!');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error('Failed to add to cart');
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit review');
      return;
    }
    
    try {
      await api.post('/reviews', {
        product_id: product.id,
        rating,
        comment,
      });
      
      toast.success('Review submitted! It will be visible after admin approval.');
      setReviewOpen(false);
      setRating(5);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <Package className="h-16 w-16 text-purple-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <Link to="/products">
            <Button className="bg-purple-600 hover:bg-purple-700">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-purple-50 py-8" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-purple-100 p-6 lg:p-8 shadow-sm mb-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-square rounded-xl overflow-hidden border border-purple-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="product-detail-image"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="product-detail-name">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-purple-600" data-testid="product-detail-price">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                  product.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`} data-testid="product-detail-availability">
                  {product.availability ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {reviews.length > 0 && (
                <div className="flex items-center mb-6" data-testid="product-ratings">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}
              
              <p className="text-gray-600 leading-relaxed mb-6" data-testid="product-detail-description">
                {product.description}
              </p>
              
              {product.specifications && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-6" data-testid="product-specifications">
                  <h3 className="font-semibold text-gray-900 mb-4">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.availability}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                  data-testid="add-to-cart-detail-button"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Link to={`/bulk-order?product=${product.id}`}>
                  <Button variant="outline" className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50" size="lg" data-testid="bulk-enquiry-link">
                    Request Bulk Order Quote
                  </Button>
                </Link>
              </div>

              {/* EMI Calculator for products >= ₹50,000 */}
              {product.price >= 50000 && (
                <EMICalculator 
                  productId={product.id} 
                  productPrice={product.price} 
                  productName={product.name}
                />
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl border border-purple-100 p-6 lg:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900" data-testid="reviews-section-title">
              Customer Reviews ({reviews.length})
            </h2>
            {user && (
              <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700" data-testid="write-review-button">
                    <Star className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white border border-purple-100 shadow-xl">
                  <DialogHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold text-gray-900">Write a Review</DialogTitle>
                        <p className="text-sm text-gray-500">Share your experience with this product</p>
                      </div>
                    </div>
                  </DialogHeader>
                  <form onSubmit={handleSubmitReview} className="space-y-6 pt-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Your Rating *</Label>
                      <div className="flex items-center space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRating(r)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`w-8 h-8 ${r <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">({rating} star{rating > 1 ? 's' : ''})</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium">Your Review *</Label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        required
                        placeholder="Share your thoughts about this product..."
                        className="mt-1 border-gray-200 focus:border-purple-500"
                        data-testid="review-comment-textarea"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                        data-testid="submit-review-button"
                      >
                        Submit Review
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setReviewOpen(false)}
                        className="border-gray-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8" data-testid="no-reviews-message">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-purple-50 border border-purple-100 rounded-xl p-6" data-testid={`review-${review.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{review.user?.name}</p>
                        {review.user && (
                          <VerificationBadge
                            verification_status={review.user.verification_status}
                            buyer_type={review.user.buyer_type}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
