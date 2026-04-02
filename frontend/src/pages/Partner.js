import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Handshake, Users, Store, GraduationCap, ArrowRight, CheckCircle2, IndianRupee, TrendingUp, Gift, Phone, Mail, Building2, Award, Target, Star, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import api from '../utils/api';
import { validators, inputFilters } from '../utils/formValidation';

const PARTNER_PROGRAMS = [
  {
    id: 'distributor',
    title: 'Become a Distributor',
    icon: Store,
    color: 'from-blue-500 to-blue-600',
    description: 'Join our network of authorized distributors and resellers',
    benefits: [
      'Wholesale pricing with up to 30% margins',
      'Exclusive territory rights',
      'Marketing & promotional support',
      'Training and product knowledge',
      'Priority stock allocation'
    ],
    requirements: [
      'Valid business registration (GST)',
      'Minimum order commitment',
      'Storage facility for inventory',
      'Sales team or retail outlet'
    ]
  },
  {
    id: 'affiliate',
    title: 'Affiliate Program',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    description: 'Earn commissions by referring customers to Alaxico',
    benefits: [
      '5-10% commission on every sale',
      'Real-time tracking dashboard',
      'Monthly payouts via bank transfer',
      'Promotional materials provided',
      'No investment required'
    ],
    requirements: [
      'Active social media or website',
      'Healthcare professional or influencer',
      'Bank account for payouts',
      'Agreement to terms & conditions'
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare Professional',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    description: 'Special program for doctors, nurses, and medical staff',
    benefits: [
      'Exclusive professional discounts',
      'Priority customer support',
      'Product recommendations for patients',
      'CPD/CME points (where applicable)',
      'Early access to new products'
    ],
    requirements: [
      'Valid medical license/degree',
      'Active practice or employment',
      'Professional ID verification',
      'Agreement to ethical guidelines'
    ]
  },
  {
    id: 'campus',
    title: 'Campus Ambassador',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    description: 'Represent Alaxico at medical colleges and universities',
    benefits: [
      'Monthly stipend + incentives',
      'Certificate of experience',
      'Networking opportunities',
      'Product samples for demos',
      'Internship/job opportunities'
    ],
    requirements: [
      'Medical/Nursing/Pharmacy student',
      'Active social media presence',
      'Good communication skills',
      'Commitment for 6+ months'
    ]
  }
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

const Partner = () => {
  const [activeProgram, setActiveProgram] = useState('distributor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program_type: 'distributor',
    organization: '',
    city: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = (name, value) => {
    let result = { isValid: true, error: null };
    
    switch (name) {
      case 'name':
        result = validators.name(value, 'Full name');
        break;
      case 'email':
        result = validators.email(value);
        break;
      case 'phone':
        result = validators.phone(value);
        break;
      case 'program_type':
        result = validators.required(value, 'Program');
        break;
      case 'organization':
        // Optional field, but validate if provided
        if (value && value.trim()) {
          result = validators.businessName(value, 'Organization');
        }
        break;
      case 'city':
        result = validators.city(value);
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
      case 'name':
        filteredValue = inputFilters.nameOnly(value);
        break;
      case 'phone':
        filteredValue = inputFilters.phoneOnly(value);
        break;
      case 'city':
        filteredValue = inputFilters.cityOnly(value);
        break;
      case 'organization':
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
    const requiredFields = ['name', 'email', 'phone', 'program_type', 'city'];
    
    requiredFields.forEach(field => {
      const result = validateField(field, formData[field]);
      if (!result.isValid) {
        newErrors[field] = result.error;
        isValid = false;
      }
    });

    // Optional fields validation (only if they have values)
    ['organization', 'message'].forEach(field => {
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
      await api.post('/partner/apply', formData);
      toast.success('Application submitted successfully!', {
        description: 'Our partnership team will contact you soon.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        program_type: 'distributor',
        organization: '',
        city: '',
        message: ''
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
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

  const selectedProgram = PARTNER_PROGRAMS.find(p => p.id === activeProgram);

  return (
    <div className="min-h-screen bg-white" data-testid="partner-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 rounded-full mb-6">
            <Handshake className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-medium">Partner Programs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
            Grow with Alaxico
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Join our partner ecosystem and be part of India's growing healthcare equipment market
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-purple-200">Active Partners</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-purple-200">Cities Covered</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 text-center">
              <p className="text-3xl font-bold text-white">₹10L+</p>
              <p className="text-sm text-purple-200">Monthly Payouts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Program
            </h2>
            <p className="text-gray-500 text-lg">Multiple ways to partner with Alaxico</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {PARTNER_PROGRAMS.map((program) => (
              <button
                key={program.id}
                onClick={() => setActiveProgram(program.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  activeProgram === program.id
                    ? 'bg-white shadow-xl border-2 border-purple-500 -translate-y-1'
                    : 'bg-white border border-gray-100 hover:border-purple-200 hover:shadow-md'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4`}>
                  <program.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-sm text-gray-500">{program.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Program Details */}
          {selectedProgram && (
            <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${selectedProgram.color} p-6 sm:p-8`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <selectedProgram.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedProgram.title}</h3>
                    <p className="text-white/80">{selectedProgram.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-600" />
                      Benefits
                    </h4>
                    <ul className="space-y-3">
                      {selectedProgram.benefits.map((benefit) => (
                        <li key={`benefit-${benefit.substring(0, 20)}`} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Requirements
                    </h4>
                    <ul className="space-y-3">
                      {selectedProgram.requirements.map((req, idx) => (
                        <li key={`req-${req.substring(0, 20)}`} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-purple-600">{idx + 1}</span>
                          </div>
                          <span className="text-gray-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Apply Now
            </h2>
            <p className="text-gray-500">Fill out the form and our team will get in touch</p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 sm:p-8" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('name')}
                  placeholder="Enter your full name"
                  maxLength={50}
                  data-testid="name-input"
                />
                <ValidationError error={touched.name && errors.name} />
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
                  placeholder="your@email.com"
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
                  Program <span className="text-red-500">*</span>
                </label>
                <select
                  name="program_type"
                  value={formData.program_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${getInputClass('program_type')} bg-white`}
                  data-testid="program-select"
                >
                  {PARTNER_PROGRAMS.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <ValidationError error={touched.program_type && errors.program_type} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization/College</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('organization')}
                  placeholder="Enter organization name"
                  maxLength={100}
                  data-testid="organization-input"
                />
                <ValidationError error={touched.organization && errors.organization} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('city')}
                  placeholder="Enter your city"
                  maxLength={50}
                  data-testid="city-input"
                />
                <ValidationError error={touched.city && errors.city} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to partner with us?</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={`${getInputClass('message')} resize-none`}
                  placeholder="Tell us about yourself and why you want to partner with Alaxico..."
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
                data-testid="submit-partner-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Partner;
