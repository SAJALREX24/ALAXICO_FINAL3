import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';
import { Package, Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL hash
        const hash = location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);
        
        if (!sessionIdMatch) {
          toast.error('Authentication failed - no session ID');
          navigate('/login');
          return;
        }

        const sessionId = sessionIdMatch[1];

        // Exchange session_id for session token
        const response = await api.post('/auth/google/session', {
          session_id: sessionId
        });

        const { token, user } = response.data;

        // Store JWT token for compatibility
        if (token) {
          localStorage.setItem('token', token);
        }

        // Fetch user to update auth context
        await fetchUser();

        toast.success(`Welcome, ${user.name}!`);
        
        // Redirect to dashboard
        navigate('/', { state: { user } });
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error(error.response?.data?.detail || 'Authentication failed');
        navigate('/login');
      }
    };

    processAuth();
  }, [location.hash, navigate, fetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Package className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="text-lg text-slate-600">Completing sign in...</span>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
