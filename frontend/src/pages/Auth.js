import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Login successful!');
      } else {
        await register(name, email, password, phone);
        toast.success('Registration successful!');
      }
      
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4" data-testid="auth-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Package className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-slate-900">MedEquipMart</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 mb-2" data-testid="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-600">
            {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 border-2 border-slate-200 focus:border-blue-500"
                  data-testid="name-input"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 border-2 border-slate-200 focus:border-blue-500"
                data-testid="email-input"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 border-2 border-slate-200 focus:border-blue-500"
                data-testid="password-input"
              />
            </div>
            
            {!isLogin && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 border-2 border-slate-200 focus:border-blue-500"
                  data-testid="phone-input"
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              size="lg"
              disabled={loading}
              data-testid="auth-submit-button"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              data-testid="toggle-auth-mode-button"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;