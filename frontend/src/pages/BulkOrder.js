import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Package, Building2, Stethoscope, Warehouse, CheckCircle, Heart, Shield, Activity, Truck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { FullPageLoader } from '../components/MedicalLoader';
import { validators, inputFilters } from '../utils/formValidation';

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

const BulkOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [selectedProductId, setSelectedProductId] = useState(productId || '');
  const [buyerType, setBuyerType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsRes = await api.get('/products');
      setProducts(productsRes.data);
      
      if (productId) {
        const productRes = await api.get(`/products/${productId}`);
        setProduct(productRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validate a single field
  const validateField = (name, value) => {
    let result = { isValid: true, error: null };
    
    switch (name) {
      case 'selectedProductId':
        result = validators.required(value, 'Product');
        break;
      case 'buyerType':
        result = validators.required(value, 'Buyer type');
        break;
      case 'quantity':
        result = validators.quantity(value);
        break;
      case 'organizationName':
        result = validators.businessName(value, 'Organization name');
        break;
      case 'contactName':
        result = validators.name(value, 'Contact person name');
        break;
      case 'contactPhone':
        result = validators.phone(value);
        break;
      case 'contactEmail':
        result = validators.email(value);
        break;
      case 'message':
        result = validators.message(value);
        break;
      default:
        break;
    }
    
    return result;
  };

  // Handle blur for validation
  const handleBlur = (fieldName, value) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const result = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: result.error }));
  };

  // Handle input change with validation
  const handleInputChange = (fieldName, value, setter, filter = null) => {
    const filteredValue = filter ? filter(value) : value;
    setter(filteredValue);
    
    if (touched[fieldName]) {
      const result = validateField(fieldName, filteredValue);
      setErrors(prev => ({ ...prev, [fieldName]: result.error }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const fieldsToValidate = [
      { name: 'selectedProductId', value: selectedProductId },
      { name: 'buyerType', value: buyerType },
      { name: 'quantity', value: quantity },
      { name: 'organizationName', value: organizationName },
      { name: 'contactName', value: contactName },
      { name: 'contactPhone', value: contactPhone },
      { name: 'contactEmail', value: contactEmail },
    ];

    fieldsToValidate.forEach(({ name, value }) => {
      const result = validateField(name, value);
      if (!result.isValid) {
        newErrors[name] = result.error;
        isValid = false;
      }
    });

    // Optional message field
    if (message) {
      const messageResult = validateField('message', message);
      if (!messageResult.isValid) {
        newErrors.message = messageResult.error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    // Mark all fields as touched
    setTouched({
      selectedProductId: true,
      buyerType: true,
      quantity: true,
      organizationName: true,
      contactName: true,
      contactPhone: true,
      contactEmail: true,
      message: true,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit bulk enquiry');
      navigate('/login?redirect=/bulk-order');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      await api.post('/bulk-enquiries', {
        product_id: selectedProductId,
        buyer_type: buyerType,
        quantity: parseInt(quantity),
        organization_name: organizationName,
        contact_details: {
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
        },
        message,
      });
      
      toast.success('Bulk enquiry submitted successfully!', {
        description: 'Our team will contact you soon',
      });
      
      navigate('/dashboard?tab=bulk-enquiries');
    } catch (error) {
      toast.error('Failed to submit enquiry');
    }
  };

  // Helper to get input class based on error state
  const getInputClass = (fieldName, value) => {
    const baseClass = "mt-2 border-gray-200 focus:border-purple-500";
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} border-red-400 focus:border-red-400 focus:ring-red-100`;
    }
    if (touched[fieldName] && !errors[fieldName] && value) {
      return `${baseClass} border-green-400 focus:border-green-400 focus:ring-green-100`;
    }
    return baseClass;
  };

  if (loading) {
    return <FullPageLoader text="Loading bulk order form..." />;
  }

  return (
    <div className="min-h-screen bg-purple-50" data-testid="bulk-order-page">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-2xl mb-6">
              <Package className="h-10 w-10 text-purple-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-testid="bulk-order-title">
              Request <span className="text-purple-600">Bulk Order</span> Quote
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Get special pricing for hospitals, clinics, and distributors. Fill out the form below and our team will contact you within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Benefits Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Benefits Card */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <h3 className="font-semibold text-xl text-gray-900 mb-6">Why Choose Bulk Orders?</h3>
                <div className="space-y-5">
                  {[
                    { icon: CheckCircle, title: 'Special Pricing', desc: 'Competitive rates for bulk purchases', color: 'text-purple-600' },
                    { icon: Shield, title: 'Priority Support', desc: 'Dedicated account manager', color: 'text-purple-600' },
                    { icon: Truck, title: 'Fast Delivery', desc: 'Express shipping for bulk orders', color: 'text-purple-600' },
                    { icon: Activity, title: 'Flexible Payment', desc: 'Custom payment terms available', color: 'text-purple-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Product Card */}
              {product && (
                <div className="bg-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-sm opacity-90 mb-2">Selected Product</p>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-3xl font-bold">₹{product.price.toLocaleString()}</p>
                  <p className="text-sm opacity-90 mt-1">per unit</p>
                </div>
              )}

              {/* Trust Stats */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">1000+</div>
                    <div className="text-sm text-gray-500">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <div className="text-sm text-gray-500">Cities</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-purple-100 p-8 space-y-6 shadow-sm" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Product <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={selectedProductId} 
                      onValueChange={(value) => handleInputChange('selectedProductId', value, setSelectedProductId)}
                    >
                      <SelectTrigger 
                        className={getInputClass('selectedProductId', selectedProductId)} 
                        data-testid="product-select"
                        onBlur={() => handleBlur('selectedProductId', selectedProductId)}
                      >
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ValidationError error={touched.selectedProductId && errors.selectedProductId} />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">
                      Buyer Type <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={buyerType} 
                      onValueChange={(value) => handleInputChange('buyerType', value, setBuyerType)}
                    >
                      <SelectTrigger 
                        className={getInputClass('buyerType', buyerType)} 
                        data-testid="buyer-type-select"
                        onBlur={() => handleBlur('buyerType', buyerType)}
                      >
                        <SelectValue placeholder="Select buyer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hospital">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>Hospital</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Clinic">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4" />
                            <span>Clinic</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Doctor">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4" />
                            <span>Doctor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Distributor">
                          <div className="flex items-center space-x-2">
                            <Warehouse className="h-4 w-4" />
                            <span>Distributor</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <ValidationError error={touched.buyerType && errors.buyerType} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Organization Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value, setOrganizationName, inputFilters.businessNameOnly)}
                      onBlur={() => handleBlur('organizationName', organizationName)}
                      className={getInputClass('organizationName', organizationName)}
                      placeholder="Enter organization name"
                      maxLength={100}
                      data-testid="organization-input"
                    />
                    <ValidationError error={touched.organizationName && errors.organizationName} />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">
                      Quantity Required <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value, setQuantity)}
                      onBlur={() => handleBlur('quantity', quantity)}
                      className={getInputClass('quantity', quantity)}
                      placeholder="Enter quantity"
                      data-testid="quantity-input"
                    />
                    <ValidationError error={touched.quantity && errors.quantity} />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium">
                    Contact Person Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value, setContactName, inputFilters.nameOnly)}
                    onBlur={() => handleBlur('contactName', contactName)}
                    className={getInputClass('contactName', contactName)}
                    placeholder="Enter contact person name"
                    maxLength={50}
                    data-testid="contact-name-input"
                  />
                  <ValidationError error={touched.contactName && errors.contactName} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Contact Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value, setContactPhone, inputFilters.phoneOnly)}
                      onBlur={() => handleBlur('contactPhone', contactPhone)}
                      className={getInputClass('contactPhone', contactPhone)}
                      placeholder="+91 98765 43210"
                      maxLength={15}
                      data-testid="contact-phone-input"
                    />
                    <ValidationError error={touched.contactPhone && errors.contactPhone} />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">
                      Contact Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value, setContactEmail)}
                      onBlur={() => handleBlur('contactEmail', contactEmail)}
                      className={getInputClass('contactEmail', contactEmail)}
                      placeholder="email@example.com"
                      data-testid="contact-email-input"
                    />
                    <ValidationError error={touched.contactEmail && errors.contactEmail} />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium">Additional Message</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => handleInputChange('message', e.target.value, setMessage)}
                    onBlur={() => handleBlur('message', message)}
                    className={getInputClass('message', message)}
                    placeholder="Any specific requirements or questions?"
                    rows={4}
                    maxLength={1000}
                    data-testid="message-textarea"
                  />
                  <ValidationError error={touched.message && errors.message} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow-md"
                    data-testid="submit-bulk-enquiry"
                  >
                    Submit Enquiry
                  </Button>
                  <Button 
                    type="button" 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/products')}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-gray-500 hover:text-purple-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrder;
