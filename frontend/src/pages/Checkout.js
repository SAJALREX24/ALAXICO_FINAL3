import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  CreditCard, Truck, ShieldCheck, Banknote, Building, Clock, Check, Smartphone,
  MapPin, Lock, Package, ChevronRight, BadgeCheck, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { FullPageLoader } from '../components/MedicalLoader';
import { validators, inputFilters } from '../utils/formValidation';

const PAYMENT_METHOD_ICONS = {
  razorpay: CreditCard,
  upi: Smartphone,
  cod: Banknote,
  bank_transfer: Building,
  pay_later: Clock,
};

const PAYMENT_METHOD_DETAILS = {
  razorpay: { name: 'Card Payment', description: 'Pay via Debit/Credit Cards, NetBanking', color: 'purple' },
  upi: { name: 'UPI Payment', description: 'GPay, PhonePe, Paytm, BHIM UPI', color: 'green' },
  cod: { name: 'Cash on Delivery', description: 'Pay when you receive', color: 'green' },
  bank_transfer: { name: 'Bank Transfer', description: 'Direct bank transfer (NEFT/RTGS)', color: 'blue' },
  pay_later: { name: 'Pay Later', description: 'Buy now, pay within 30 days', color: 'teal' },
};

// Validation Error Component
const ValidationError = ({ error }) => {
  if (!error) return null;
  return (
    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{error}</span>
    </div>
  );
};

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || '',
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Memoize fetchData to fix hook dependency
  const fetchData = useCallback(async () => {
    try {
      const [cartRes, configRes, paymentMethodsRes] = await Promise.all([
        api.get('/cart'),
        api.get('/config'),
        api.get('/cart/payment-methods'),
      ]);
      setCart(cartRes.data);
      setRazorpayKey(configRes.data.razorpay_key_id);
      setAvailablePaymentMethods(paymentMethodsRes.data.payment_methods || []);
      
      if (paymentMethodsRes.data.payment_methods?.length > 0) {
        setSelectedPaymentMethod(paymentMethodsRes.data.payment_methods[0]);
      }
    } catch (error) {
      // Log error for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching checkout data:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    fetchData();
  }, [user, authLoading, navigate, fetchData]);

  // Validate a single field
  const validateField = (name, value) => {
    let result = { isValid: true, error: null };
    
    switch (name) {
      case 'street':
        if (!value || !value.trim()) {
          result = { isValid: false, error: 'Full address is required' };
        } else if (value.trim().length < 10) {
          result = { isValid: false, error: 'Please enter a complete address (at least 10 characters)' };
        } else if (value.trim().length > 200) {
          result = { isValid: false, error: 'Address cannot exceed 200 characters' };
        }
        break;
      case 'city':
        result = validators.city(value);
        break;
      case 'state':
        if (!value || !value.trim()) {
          result = { isValid: false, error: 'State is required' };
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          result = { isValid: false, error: 'State should only contain letters' };
        } else if (value.trim().length < 2) {
          result = { isValid: false, error: 'State must be at least 2 characters' };
        }
        break;
      case 'pincode':
        if (!value || !value.trim()) {
          result = { isValid: false, error: 'PIN code is required' };
        } else if (!/^\d{6}$/.test(value.trim())) {
          result = { isValid: false, error: 'Please enter a valid 6-digit PIN code' };
        }
        break;
      case 'phone':
        result = validators.phone(value);
        break;
      default:
        break;
    }
    
    return result;
  };

  // Handle input change with filtering
  const handleAddressChange = (field, value) => {
    let filteredValue = value;

    // Apply input filters based on field type
    switch (field) {
      case 'city':
        filteredValue = inputFilters.cityOnly(value);
        break;
      case 'state':
        filteredValue = inputFilters.cityOnly(value); // Same filter as city - letters only
        break;
      case 'pincode':
        filteredValue = value.replace(/\D/g, '').slice(0, 6);
        break;
      case 'phone':
        filteredValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      default:
        filteredValue = value;
    }

    setAddress(prev => ({ ...prev, [field]: filteredValue }));
    
    // Validate on change if field was already touched
    if (touched[field]) {
      const result = validateField(field, filteredValue);
      setErrors(prev => ({ ...prev, [field]: result.error }));
    }
  };

  // Handle field blur - mark as touched and validate
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const result = validateField(field, address[field]);
    setErrors(prev => ({ ...prev, [field]: result.error }));
  };

  // Validate entire address form
  const validateAddressForm = () => {
    const newErrors = {};
    let isValid = true;

    const fields = ['street', 'city', 'state', 'pincode', 'phone'];
    
    fields.forEach(field => {
      const result = validateField(field, address[field]);
      if (!result.isValid) {
        newErrors[field] = result.error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
    const allTouched = {};
    fields.forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    return isValid;
  };

  // Helper to get input class based on error state
  const getInputClass = (fieldName) => {
    const baseClass = "mt-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors";
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} border-red-400 focus:border-red-400 focus:ring-red-100`;
    }
    if (touched[fieldName] && !errors[fieldName] && address[fieldName]) {
      return `${baseClass} border-green-400 focus:border-green-400 focus:ring-green-100`;
    }
    return baseClass;
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const isAddressValid = () => {
    return address.street.trim().length >= 10 && 
           address.city.trim().length >= 2 && 
           /^[a-zA-Z\s]+$/.test(address.city.trim()) &&
           address.state.trim().length >= 2 && 
           /^[a-zA-Z\s]+$/.test(address.state.trim()) &&
           /^\d{6}$/.test(address.pincode.trim()) && 
           /^[6-9]\d{9}$/.test(address.phone.trim());
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

  const handleRazorpayPayment = async (preferredMethod = null) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }
      
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
            
            toast.success('Payment successful!', { description: 'Your order has been placed' });
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
        theme: { color: '#8B5CF6' },
      };
      
      if (preferredMethod === 'upi') {
        options.config = {
          display: {
            blocks: {
              utib: {
                name: "Pay using UPI",
                instruments: [{ method: "upi", flows: ["qrcode", "collect", "intent"], apps: ["google_pay", "phonepe", "paytm"] }]
              },
              other: {
                name: "Other Payment Methods",
                instruments: [{ method: "card" }, { method: "netbanking" }, { method: "wallet" }]
              }
            },
            sequence: ["block.utib", "block.other"],
            preferences: { show_default_blocks: false }
          }
        };
      }
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => toast.error('Payment failed'));
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment', { description: error.response?.data?.detail || 'Please try again' });
    }
  };

  const handleCODPayment = async () => {
    try {
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product_id,
          product_name: item.product?.name,
          quantity: item.quantity,
          price: item.product?.price,
        })),
        total_amount: calculateTotal(),
        delivery_address: address,
        payment_method: selectedPaymentMethod,
      };
      
      const response = await api.post('/orders/create-cod-order', orderData);
      toast.success('Order placed successfully!', { description: response.data.message });
      navigate('/dashboard?tab=orders');
    } catch (error) {
      toast.error('Failed to place order', { description: error.response?.data?.detail || 'Please try again' });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!isAddressValid()) {
      toast.error('Please fill all address fields correctly');
      setCurrentStep(1);
      return;
    }
    
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    setProcessing(true);
    
    try {
      if (selectedPaymentMethod === 'razorpay') {
        await handleRazorpayPayment();
      } else if (selectedPaymentMethod === 'upi') {
        await handleRazorpayPayment('upi');
      } else {
        await handleCODPayment();
      }
    } finally {
      setProcessing(false);
    }
  };

  const proceedToPayment = () => {
    if (!validateAddressForm()) {
      toast.error('Please fix the errors in the address form');
      return;
    }
    if (!isAddressValid()) {
      toast.error('Please fill all address fields correctly');
      return;
    }
    setCurrentStep(2);
  };

  if (loading) {
    return <FullPageLoader text="Preparing secure checkout..." />;
  }

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white" data-testid="checkout-page">
      {/* Header with Progress */}
      <div className="bg-white border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="hidden sm:inline">Secure</span> Checkout
            </h1>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="hidden sm:inline">SSL</span> Encrypted
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-3 sm:mt-4 gap-0">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                {currentStep > 1 ? <Check className="w-3 h-3 sm:w-5 sm:h-5" /> : '1'}
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline">Delivery</span>
            </div>
            <div className={`w-8 sm:w-16 md:w-24 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline">Payment</span>
            </div>
            <div className={`w-8 sm:w-16 md:w-24 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Steps */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              
              {/* Step 1: Delivery Address */}
              <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border ${currentStep === 1 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-100'}`}>
                <div 
                  className={`p-3 sm:p-4 flex items-center justify-between cursor-pointer ${currentStep === 1 ? 'bg-purple-50' : 'bg-gray-50'}`}
                  onClick={() => setCurrentStep(1)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStep === 1 ? 'bg-purple-600' : isAddressValid() ? 'bg-green-600' : 'bg-gray-400'}`}>
                      {isAddressValid() && currentStep !== 1 ? <Check className="w-5 h-5 text-white" /> : <MapPin className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Delivery Address</h2>
                      {isAddressValid() && currentStep !== 1 && (
                        <p className="text-sm text-gray-500">{address.street}, {address.city}</p>
                      )}
                    </div>
                  </div>
                  {currentStep !== 1 && <Button variant="ghost" size="sm" className="text-purple-600">Edit</Button>}
                </div>
                
                {currentStep === 1 && (
                  <div className="p-6 space-y-4">
                    <div>
                      <Label className="text-gray-700 font-medium">
                        Full Address <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        value={address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        onBlur={() => handleBlur('street')}
                        rows={2}
                        className={getInputClass('street')}
                        placeholder="House/Flat No., Building Name, Street, Area"
                        maxLength={200}
                        data-testid="street-input"
                      />
                      <ValidationError error={touched.street && errors.street} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 font-medium">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={address.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          onBlur={() => handleBlur('city')}
                          className={getInputClass('city')}
                          placeholder="Mumbai"
                          maxLength={50}
                          data-testid="city-input"
                        />
                        <ValidationError error={touched.city && errors.city} />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={address.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          onBlur={() => handleBlur('state')}
                          className={getInputClass('state')}
                          placeholder="Maharashtra"
                          maxLength={50}
                          data-testid="state-input"
                        />
                        <ValidationError error={touched.state && errors.state} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 font-medium">
                          PIN Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={address.pincode}
                          onChange={(e) => handleAddressChange('pincode', e.target.value)}
                          onBlur={() => handleBlur('pincode')}
                          className={getInputClass('pincode')}
                          placeholder="400001"
                          maxLength={6}
                          data-testid="pincode-input"
                        />
                        <ValidationError error={touched.pincode && errors.pincode} />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">
                          Mobile Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={address.phone}
                          onChange={(e) => handleAddressChange('phone', e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          className={getInputClass('phone')}
                          placeholder="9876543210"
                          maxLength={10}
                          data-testid="phone-input"
                        />
                        <ValidationError error={touched.phone && errors.phone} />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={proceedToPayment}
                      className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold mt-4"
                      data-testid="continue-to-payment-button"
                    >
                      Continue to Payment
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Step 2: Payment Method */}
              <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border ${currentStep === 2 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-100'}`}>
                <div 
                  className={`p-4 flex items-center justify-between ${currentStep === 2 ? 'bg-purple-50' : 'bg-gray-50'} ${currentStep < 2 ? 'opacity-50' : 'cursor-pointer'}`}
                  onClick={() => currentStep >= 2 && setCurrentStep(2)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}>
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Payment Method</h2>
                      {selectedPaymentMethod && currentStep !== 2 && (
                        <p className="text-sm text-gray-500">{PAYMENT_METHOD_DETAILS[selectedPaymentMethod]?.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {currentStep === 2 && (
                  <div className="p-6">
                    <div className="grid gap-3">
                      {availablePaymentMethods.map((methodId) => {
                        const method = PAYMENT_METHOD_DETAILS[methodId];
                        const IconComponent = PAYMENT_METHOD_ICONS[methodId] || CreditCard;
                        
                        if (!method) return null;
                        
                        return (
                          <div
                            key={methodId}
                            onClick={() => setSelectedPaymentMethod(methodId)}
                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all ${
                              selectedPaymentMethod === methodId
                                ? 'border-purple-500 bg-purple-50 shadow-sm'
                                : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                            }`}
                            data-testid={`payment-method-${methodId}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                selectedPaymentMethod === methodId ? 'bg-purple-600' : 'bg-gray-100'
                              }`}>
                                <IconComponent className={`w-6 h-6 ${
                                  selectedPaymentMethod === methodId ? 'text-white' : 'text-gray-600'
                                }`} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{method.name}</p>
                                <p className="text-sm text-gray-500">{method.description}</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedPaymentMethod === methodId
                                ? 'border-purple-600 bg-purple-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === methodId && <Check className="w-4 h-4 text-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Payment Info Messages */}
                    {selectedPaymentMethod === 'upi' && (
                      <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 flex items-start gap-3">
                        <Smartphone className="w-5 h-5 text-green-600 mt-0.5" />
                        <p className="text-sm text-green-700">Pay instantly using GPay, PhonePe, Paytm, or any UPI app.</p>
                      </div>
                    )}
                    
                    {selectedPaymentMethod === 'cod' && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                        <Banknote className="w-5 h-5 text-amber-600 mt-0.5" />
                        <p className="text-sm text-amber-700">Pay in cash when your order is delivered. Keep exact change ready.</p>
                      </div>
                    )}

                    <form onSubmit={handlePayment}>
                      <Button
                        type="submit"
                        className="w-full mt-6 h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg shadow-lg"
                        disabled={processing || !selectedPaymentMethod}
                        data-testid="place-order-button"
                      >
                        {processing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <>
                            {selectedPaymentMethod === 'razorpay' || selectedPaymentMethod === 'upi'
                              ? `Pay ₹${calculateTotal().toLocaleString()}`
                              : `Place Order - ₹${calculateTotal().toLocaleString()}`
                            }
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-36 overflow-hidden" data-testid="checkout-summary">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-4 max-h-64 overflow-y-auto border-b border-gray-100">
                  {cart.items.map((item) => (
                    <div key={item.product_id} className="flex gap-3 mb-3 last:mb-0" data-testid={`checkout-item-${item.product_id}`}>
                      <img 
                        src={item.product?.image} 
                        alt={item.product?.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-purple-600">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-purple-600" data-testid="total-amount">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Free Delivery on All Orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BadgeCheck className="w-4 h-4 text-purple-600" />
                    <span>Genuine Products Only</span>
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
