import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, Package, X, Home, Grid, FileText, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { getMedicalAvatar } from '../utils/avatars';

const Navbar = ({ cartCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    logout();
    await new Promise(resolve => setTimeout(resolve, 50));
    navigate('/');
    setIsLoggingOut(false);
    setMobileMenuOpen(false);
  };

  const userAvatar = user ? getMedicalAvatar(user.id, user.email) : null;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="glass-nav sticky top-0 z-50" data-testid="main-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
              <Package className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-slate-900 hidden xs:inline">MedEquipMart</span>
              <span className="text-lg font-bold text-slate-900 xs:hidden">MEM</span>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medical equipment..."
                  className="w-full h-10 px-4 pr-10 text-sm border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  data-testid="search-input"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/products" className="text-slate-600 hover:text-slate-900 font-medium transition-colors" data-testid="products-nav-link">
                Products
              </Link>
              
              <Link to="/bulk-order" data-testid="bulk-enquiry-button">
                <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                  Bulk Enquiry
                </Button>
              </Link>

              <Link to="/cart" className="relative" data-testid="cart-link">
                <ShoppingCart className="h-6 w-6 text-slate-600 hover:text-slate-900 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none" data-testid="user-menu-trigger">
                      <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-blue-400 shadow-md hover:border-blue-500 transition-colors">
                        <img src={userAvatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>Admin Panel</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              )}
            </div>

            {/* Mobile Navigation Icons */}
            <div className="flex md:hidden items-center space-x-2">
              <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="p-2 text-slate-600 hover:text-slate-900">
                <Search className="h-5 w-5" />
              </button>
              
              <Link to="/cart" className="relative p-2" data-testid="cart-link-mobile">
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 text-slate-600 hover:text-slate-900"
                data-testid="mobile-menu-button"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medical equipment..."
                  className="w-full h-10 px-4 pr-10 text-sm border border-slate-200 rounded-lg focus:border-primary outline-none"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobileMenu}></div>
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Menu</span>
                <button onClick={closeMobileMenu} className="p-2 text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-400">
                    <img src={userAvatar} alt={user.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-2">
              <MobileMenuItem icon={Home} label="Home" onClick={() => { navigate('/'); closeMobileMenu(); }} />
              <MobileMenuItem icon={Grid} label="Products" onClick={() => { navigate('/products'); closeMobileMenu(); }} />
              <MobileMenuItem icon={FileText} label="Bulk Enquiry" onClick={() => { navigate('/bulk-order'); closeMobileMenu(); }} />
              <MobileMenuItem icon={ShoppingCart} label="Cart" badge={cartCount} onClick={() => { navigate('/cart'); closeMobileMenu(); }} />
              
              {user ? (
                <>
                  <div className="my-2 border-t border-slate-200"></div>
                  <MobileMenuItem icon={User} label="Dashboard" onClick={() => { navigate('/dashboard'); closeMobileMenu(); }} />
                  {user.role === 'admin' && (
                    <MobileMenuItem icon={Settings} label="Admin Panel" onClick={() => { navigate('/admin'); closeMobileMenu(); }} />
                  )}
                  <MobileMenuItem icon={LogOut} label="Logout" onClick={handleLogout} className="text-red-600" />
                </>
              ) : (
                <>
                  <div className="my-2 border-t border-slate-200"></div>
                  <div className="p-4">
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500">Login / Sign Up</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MobileMenuItem = ({ icon: Icon, label, badge, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${className}`}
  >
    <div className="flex items-center space-x-3">
      <Icon className="h-5 w-5 text-slate-600" />
      <span className="font-medium text-slate-900">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      {badge > 0 && (
        <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </div>
  </button>
);

export default Navbar;
