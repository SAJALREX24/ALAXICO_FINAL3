import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div 
      className="product-card bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full" 
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Container - Fixed Aspect Ratio */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            data-testid="product-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80';
            }}
          />
        </div>
      </Link>
      
      {/* Content Container */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 
            className="font-medium text-xs sm:text-sm text-gray-900 mb-1 hover:text-purple-600 transition-colors line-clamp-2 h-8 sm:h-10 leading-4 sm:leading-5" 
            data-testid="product-name"
          >
            {product.name}
          </h3>
        </Link>
        
        {/* Brand/Category */}
        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2 line-clamp-1">
          By {product.brand || 'Alaxico'}
        </p>
        
        {/* Price Section - Push to bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
            <span className="text-sm sm:text-base font-semibold text-gray-900" data-testid="product-price">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.discount_percentage > 0 && (
              <span className="text-[8px] sm:text-[10px] text-green-600 font-medium bg-green-50 px-1 sm:px-1.5 py-0.5 rounded">
                {product.discount_percentage}% OFF
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span 
              className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full ${
                product.availability 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`} 
              data-testid="product-availability"
            >
              {product.availability ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.availability}
            className="w-full text-[10px] sm:text-xs h-7 sm:h-9 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300"
            data-testid="add-to-cart-button"
          >
            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
