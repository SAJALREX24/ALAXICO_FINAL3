import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Package, Percent, Phone, Mail, ArrowRight, CheckCircle2, FileText, Truck, ShieldCheck, HeadphonesIcon, IndianRupee, Clock, Award, Target, Handshake, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import api from '../utils/api';
import { validators, inputFilters } from '../utils/formValidation';

const BULK_PRICING_TIERS = [
  { id: 'tier-10-50', quantity: '10-50 units', discount: '10%', savings: 'Save up to ₹5,000' },
  { id: 'tier-51-100', quantity: '51-100 units', discount: '15%', savings: 'Save up to ₹15,000' },
  { id: 'tier-101-500', quantity: '101-500 units', discount: '20%', savings: 'Save up to ₹50,000' },
  { id: 'tier-500+', quantity: '500+ units', discount: '25%+', savings: 'Custom pricing' },
];

const B2B_BENEFITS = [
  { id: 'discount', icon: Percent, title: 'Exclusive Discounts', description: 'Up to 25% off on bulk orders' },
  { id: 'shipping', icon: Truck, title: 'Priority Shipping', description: 'Free express delivery on orders above ₹10,000' },
  { id: 'invoice', icon: FileText, title: 'GST Invoice', description: 'Proper documentation for tax benefits' },
  { id: 'manager', icon: HeadphonesIcon, title: 'Dedicated Manager', description: 'Personal account manager for your business' },
  { id: 'payment', icon: Clock, title: 'Flexible Payment', description: 'Credit terms up to 30 days for verified businesses' },
  { id: 'warranty', icon: ShieldCheck, title: 'Extended Warranty', description: 'Additional 1-year warranty on bulk purchases' },
];

const CUSTOMER_TYPES = [
  { id: 'hospitals', icon: Building2, title: 'Hospitals', description: 'Complete equipment solutions for healthcare facilities' },
  { id: 'clinics', icon: Users, title: 'Clinics & Nursing Homes', description: 'Essential equipment for small to medium practices' },
  { id: 'distributors', icon: Package, title: 'Distributors', description: 'Wholesale pricing for resellers and dealers' },
  { id: 'corporate', icon: Target, title: 'Corporate', description: 'Employee wellness and first aid equipment' },
];

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

const B2B = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    contact_person: '',
    email: '',
    phone: '',
    business_type: '',
    estimated_quantity: '',
    products_interested: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = (name, value) => {
    let result = { isValid: true, error: null };
    
    switch (name) {
      case 'business_name':
        result = validators.businessName(value, 'Business name');
        break;
      case 'contact_person':
        result = validators.name(value, 'Contact person');
        break;
      case 'email':
        result = validators.email(value);
        break;
      case 'phone':
        result = validators.phone(value);
        break;
      case 'business_type':
        result = validators.required(value, 'Business type');
        break;
      case 'products_interested':
        result = validators.productsInterested(value);
        break;
      case 'message':
        result = validators.message(value);
        break;
      default:
        break;
    }
    
    return result;
  };

  // Handle input change with filtering
  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    // Apply input filters based on field type
    switch (name) {
      case 'contact_person':
        filteredValue = inputFilters.nameOnly(value);
        break;
      case 'phone':
        filteredValue = inputFilters.phoneOnly(value);
        break;
      case 'business_name':
        filteredValue = inputFilters.businessNameOnly(value);
        break;
      default:
        filteredValue = value;
    }

    setFormData(prev => ({ ...prev, [name]: filteredValue }));
    
    // Validate on change if field was already touched
    if (touched[name]) {
      const result = validateField(name, filteredValue);
      setErrors(prev => ({ ...prev, [name]: result.error }));
    }
  };

  // Handle field blur - mark as touched and validate
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const result = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: result.error }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = ['business_name', 'contact_person', 'email', 'phone', 'business_type'];
    
    requiredFields.forEach(field => {
      const result = validateField(field, formData[field]);
      if (!result.isValid) {
        newErrors[field] = result.error;
        isValid = false;
      }
    });

    // Optional fields validation (only if they have values)
    ['products_interested', 'message'].forEach(field => {
      if (formData[field]) {
        const result = validateField(field, formData[field]);
        if (!result.isValid) {
          newErrors[field] = result.error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.post('/b2b/enquiry', formData);
      toast.success('Enquiry submitted successfully!', {
        description: 'Our team will contact you within 24 hours.'
      });
      setFormData({
        business_name: '',
        contact_person: '',
        email: '',
        phone: '',
        business_type: '',
        estimated_quantity: '',
        products_interested: '',
        message: ''
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get input class based on error state
  const getInputClass = (fieldName) => {
    const baseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-colors";
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} border-red-400 focus:border-red-400 focus:ring-red-100`;
    }
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClass} border-green-400 focus:border-green-400 focus:ring-green-100`;
    }
    return `${baseClass} border-gray-200 focus:border-purple-400 focus:ring-purple-100`;
  };

  return (
    <div className="min-h-screen bg-white" data-testid="b2b-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 rounded-full mb-6">
              <Handshake className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-medium">Alaxico for Business</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
              Partner with India's Trusted<br />Healthcare Equipment Provider
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Special pricing, dedicated support, and exclusive benefits for hospitals, clinics, distributors, and corporate buyers
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#enquiry-form">
                <Button size="lg" className="w-full sm:w-auto bg-white text-purple-700 hover:bg-purple-50 font-semibold px-8 py-6 text-lg">
                  Request Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="tel:+917617617178">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  <Phone className="mr-2 w-5 h-5" />
                  Call: +91 7617617178
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Types */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Who We Serve
            </h2>
            <p className="text-gray-500 text-lg">Tailored solutions for every healthcare business</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CUSTOMER_TYPES.map((type) => (
              <div 
                key={type.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <type.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-500 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Pricing Tiers */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Bulk Pricing Tiers
            </h2>
            <p className="text-gray-500 text-lg">The more you buy, the more you save</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {BULK_PRICING_TIERS.map((tier, index) => (
              <div 
                key={tier.id}
                className={`rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 ${
                  index === 3 
                    ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white' 
                    : 'bg-purple-50 border border-purple-100'
                }`}
              >
                <p className={`text-sm font-medium mb-2 ${index === 3 ? 'text-purple-200' : 'text-purple-600'}`}>
                  {tier.quantity}
                </p>
                <p className={`text-4xl sm:text-5xl font-bold mb-2 ${index === 3 ? 'text-white' : 'text-gray-900'}`}>
                  {tier.discount}
                </p>
                <p className={`text-sm ${index === 3 ? 'text-purple-200' : 'text-gray-500'}`}>
                  {tier.savings}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              B2B Benefits
            </h2>
            <p className="text-gray-500 text-lg">Exclusive perks for business partners</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {B2B_BENEFITS.map((benefit) => (
              <div 
                key={benefit.id}
                className="bg-white rounded-xl p-5 sm:p-6 border border-gray-100 hover:border-purple-200 transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-500">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Request a Quote
            </h2>
            <p className="text-gray-500 text-lg">Fill out the form and our team will contact you within 24 hours</p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('business_name')}
                  placeholder="Your Hospital/Clinic Name"
                  maxLength={100}
                  data-testid="business-name-input"
                />
                <ValidationError error={touched.business_name && errors.business_name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('contact_person')}
                  placeholder="Full Name"
                  maxLength={50}
                  data-testid="contact-person-input"
                />
                <ValidationError error={touched.contact_person && errors.contact_person} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('email')}
                  placeholder="business@example.com"
                  data-testid="email-input"
                />
                <ValidationError error={touched.email && errors.email} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('phone')}
                  placeholder="+91 98765 43210"
                  maxLength={15}
                  data-testid="phone-input"
                />
                <ValidationError error={touched.phone && errors.phone} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${getInputClass('business_type')} bg-white`}
                  data-testid="business-type-select"
                >
                  <option value="">Select type</option>
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic/Nursing Home</option>
                  <option value="distributor">Distributor/Dealer</option>
                  <option value="corporate">Corporate</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="other">Other</option>
                </select>
                <ValidationError error={touched.business_type && errors.business_type} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Quantity</label>
                <select
                  name="estimated_quantity"
                  value={formData.estimated_quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none bg-white"
                  data-testid="quantity-select"
                >
                  <option value="">Select quantity</option>
                  <option value="10-50">10-50 units</option>
                  <option value="51-100">51-100 units</option>
                  <option value="101-500">101-500 units</option>
                  <option value="500+">500+ units</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Products Interested In</label>
                <input
                  type="text"
                  name="products_interested"
                  value={formData.products_interested}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('products_interested')}
                  placeholder="e.g., Nebulizers, BP Monitors, Hospital Beds"
                  maxLength={500}
                  data-testid="products-input"
                />
                <ValidationError error={touched.products_interested && errors.products_interested} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={`${getInputClass('message')} resize-none`}
                  placeholder="Tell us more about your requirements..."
                  maxLength={1000}
                  data-testid="message-textarea"
                />
                <ValidationError error={touched.message && errors.message} />
              </div>
            </div>
            <div className="mt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 text-lg"
                data-testid="submit-b2b-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default B2B;
