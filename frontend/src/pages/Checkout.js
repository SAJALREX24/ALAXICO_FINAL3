import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [cartRes, configRes] = await Promise.all([
        api.get('/cart'),
        api.get('/config'),
      ]);
      setCart(cartRes.data);
      setRazorpayKey(configRes.data.razorpay_key_id);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessing(false);
        return;
      }
      
      // Create order
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product_id,
          product_name: item.product?.name,
          quantity: item.quantity,
          price: item.product?.price,
        })),
        total_amount: calculateTotal(),
        delivery_address: address,
      };
      
      const response = await api.post('/orders/create-razorpay-order', orderData);
      
      // Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'Alaxico',
        description: 'Medical Equipment Purchase',
        order_id: response.data.razorpay_order_id,
        handler: async (razorpayResponse) => {
          try {
            await api.post('/orders/verify-payment', {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });
            
            toast.success('Payment successful!', {
              description: 'Your order has been placed',
            });
            navigate('/dashboard?tab=orders');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: address.phone,
        },
        theme: {
          color: '#7C3AED',
        },
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => {
        toast.error('Payment failed');
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      
      if (error.response?.status === 500 || error.response?.data?.detail?.includes('Authentication')) {
        toast.error('Payment Gateway Configuration Required', {
          description: 'Please contact admin to configure valid Razorpay API keys.',
          duration: 8000,
        });
      } else {
        toast.error('Failed to process payment', {
          description: error.response?.data?.detail || 'Please try again',
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
          <p className="mt-4 text-purple-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" data-testid="checkout-page">
      {/* Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
              <CreditCard className="h-8 w-8 text-teal-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" data-testid="checkout-title">
              Secure <span className="text-teal-400">Checkout</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Delivery Address Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <Truck className="h-6 w-6 text-teal-400 mr-3" />
                  <h2 className="text-xl font-semibold text-white">Delivery Address</h2>
                </div>
                
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <Label htmlFor="street" className="text-white">Street Address *</Label>
                    <Textarea
                      id="street"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      required
                      rows={2}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="Enter your street address"
                      data-testid="street-input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-white">City *</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                        placeholder="City"
                        data-testid="city-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state" className="text-white">State *</Label>
                      <Input
                        id="state"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        required
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                        placeholder="State"
                        data-testid="state-input"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode" className="text-white">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        required
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                        placeholder="PIN Code"
                        data-testid="pincode-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        required
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                        placeholder="+91 XXXXX XXXXX"
                        data-testid="phone-input"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full mt-6 h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg shadow-lg shadow-teal-500/30"
                    disabled={processing}
                    data-testid="place-order-button"
                  >
                    {processing ? 'Processing...' : `Pay ₹${calculateTotal().toLocaleString()}`}
                  </Button>
                </form>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-6 text-purple-200 text-sm">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-1 text-teal-400" />
                      Secure Payment
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1 text-teal-400" />
                      Free Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sticky top-24" data-testid="checkout-summary">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.product_id} className="flex justify-between" data-testid={`checkout-item-${item.product_id}`}>
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{item.product?.name}</p>
                        <p className="text-purple-200 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-teal-400">
                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/20 pt-4 space-y-3">
                  <div className="flex justify-between text-purple-200">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-purple-200">
                    <span>Shipping</span>
                    <span className="text-teal-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/20">
                    <span className="text-white">Total</span>
                    <span className="text-teal-400" data-testid="checkout-total">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
