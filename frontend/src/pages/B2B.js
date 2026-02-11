import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Package, Percent, Phone, Mail, ArrowRight, CheckCircle2, FileText, Truck, ShieldCheck, HeadphonesIcon, IndianRupee, Clock, Award, Target, Handshake } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import api from '../utils/api';

const BULK_PRICING_TIERS = [
  { quantity: '10-50 units', discount: '10%', savings: 'Save up to ₹5,000' },
  { quantity: '51-100 units', discount: '15%', savings: 'Save up to ₹15,000' },
  { quantity: '101-500 units', discount: '20%', savings: 'Save up to ₹50,000' },
  { quantity: '500+ units', discount: '25%+', savings: 'Custom pricing' },
];

const B2B_BENEFITS = [
  { icon: Percent, title: 'Exclusive Discounts', description: 'Up to 25% off on bulk orders' },
  { icon: Truck, title: 'Priority Shipping', description: 'Free express delivery on orders above ₹10,000' },
  { icon: FileText, title: 'GST Invoice', description: 'Proper documentation for tax benefits' },
  { icon: HeadphonesIcon, title: 'Dedicated Manager', description: 'Personal account manager for your business' },
  { icon: Clock, title: 'Flexible Payment', description: 'Credit terms up to 30 days for verified businesses' },
  { icon: ShieldCheck, title: 'Extended Warranty', description: 'Additional 1-year warranty on bulk purchases' },
];

const CUSTOMER_TYPES = [
  { icon: Building2, title: 'Hospitals', description: 'Complete equipment solutions for healthcare facilities' },
  { icon: Users, title: 'Clinics & Nursing Homes', description: 'Essential equipment for small to medium practices' },
  { icon: Package, title: 'Distributors', description: 'Wholesale pricing for resellers and dealers' },
  { icon: Target, title: 'Corporate', description: 'Employee wellness and first aid equipment' },
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            {CUSTOMER_TYPES.map((type, index) => (
              <div 
                key={index}
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
                key={index}
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
            {B2B_BENEFITS.map((benefit, index) => (
              <div 
                key={index}
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
          
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                  placeholder="Your Hospital/Clinic Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none bg-white"
                >
                  <option value="">Select type</option>
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic/Nursing Home</option>
                  <option value="distributor">Distributor/Dealer</option>
                  <option value="corporate">Corporate</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Quantity</label>
                <select
                  name="estimated_quantity"
                  value={formData.estimated_quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none bg-white"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                  placeholder="e.g., Nebulizers, BP Monitors, Hospital Beds"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                  placeholder="Tell us more about your requirements..."
                />
              </div>
            </div>
            <div className="mt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 text-lg"
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
