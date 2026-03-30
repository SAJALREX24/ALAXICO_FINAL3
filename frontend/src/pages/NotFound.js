import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-purple-600 mb-4">404</h1>
          <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
            <Link to="/products">
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Back Link */}
        <button 
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact us at{' '}
          <a href="mailto:info@alaxico.com" className="text-purple-600 hover:underline">
            info@alaxico.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
