# Alaxico Medical Equipment E-Commerce Platform - PRD

## Project Title
Medical Equipment E-Commerce Website (Branded as "Alaxico")

## Original Problem Statement
Build a professional, trustworthy, and scalable medical equipment e-commerce platform targeting hospitals, clinics, doctors, diagnostic centers, distributors, and individual buyers.

## User Personas
- **Hospitals/Clinics**: Large volume B2B buyers needing bulk orders
- **Doctors/Healthcare Professionals**: Individual buyers for clinic equipment
- **Distributors**: B2B resellers needing wholesale pricing
- **Individual Buyers**: Home healthcare equipment purchasers

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI, Lucide Icons
- **Backend**: FastAPI, Pydantic, Python 3.11+
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT + Google OAuth
- **Payments**: Razorpay (Cards, UPI, NetBanking), COD, Bank Transfer, Pay Later

## ✅ Implemented Features

### Customer-Facing Features
- ✅ Homepage with professional medical design, hero carousel, featured products, trust indicators
- ✅ Promotional banner strip with rotating offers
- ✅ Product Catalog with category browsing and listings
- ✅ Rich Product Detail Page with galleries, feature highlights, specs
- ✅ Like/Share buttons on product pages
- ✅ Search & Filter capabilities
- ✅ Retail Cart & Checkout with coupon codes
- ✅ Multiple Payment Methods (Razorpay, UPI, COD, Bank Transfer, Pay Later)
- ✅ User Accounts (Email/Password & Google Login)
- ✅ User Dashboard with order history
- ✅ Verified customer reviews with photo/video uploads
- ✅ Floating WhatsApp chat integration
- ✅ Full Mobile Responsiveness

### Business Features
- ✅ B2B Bulk Order Section with tiered pricing (10-25% discounts)
- ✅ B2B Enquiry Form with backend integration
- ✅ Partner Programs (Distributor, Affiliate, Healthcare, Campus Ambassador)
- ✅ Partner Application Form with backend integration
- ✅ Store Locator (Agra - Head Office)
- ✅ Product Comparison Tool
- ✅ Equipment Recommendation Quiz

### Admin Panel
- ✅ Product Management (Create/Edit/Delete) - Mobile responsive
- ✅ Rich product content editing (galleries, highlights, specifications)
- ✅ Payment method configuration per product
- ✅ Order Management (Retail & Bulk)
- ✅ B2B Enquiries Management with status updates
- ✅ Partner Applications Management with status updates
- ✅ User and Verification Management
- ✅ Customer Reviews Management (with media preview)
- ✅ Sales Analytics Dashboard

## Store Information
- **Name**: Alaxico Agra - Head Office
- **Address**: UG-6, Rajnandini Plaza, Shastripuram Road, Agra, Uttar Pradesh
- **Phone**: +91 7617617178
- **Email**: alaxicohealthcare@gmail.com

## Products Catalog
1. Alaxico Compressor Nebulizer for Kids and Adults - ₹1,499
2. Alaxico 3-in-1 Steamer cum Vaporizer - ₹449
3. Alaxico Premium Non Woven Surgeon Cap (Pack of 100) - ₹299
4. Alaxico Rechargeable Blood Pressure Monitor - ₹1,299
5. Alaxico Hot Electric Gel Bag - ₹349
6. Alaxico Premium Hot Water Bottle - ₹249

## Test Credentials
- **Admin**: admin@medequipmart.com / admin123
- **Hospital User**: hospital@example.com / demo1234
- **Doctor User**: doctor@example.com / demo1234

## API Endpoints Summary

### Public APIs
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/categories` - List categories
- `GET /api/payment-methods` - List payment methods
- `GET /api/config` - Get WhatsApp & Razorpay config
- `POST /api/b2b/enquiry` - Submit B2B enquiry
- `POST /api/partner/apply` - Submit partner application

### Authentication APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google/session` - Google OAuth

### Cart & Orders APIs
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{id}` - Remove from cart
- `POST /api/orders/create-razorpay-order` - Create Razorpay order
- `POST /api/orders/verify-payment` - Verify payment
- `POST /api/orders/create-cod-order` - Create COD order
- `GET /api/orders/my-orders` - Get user orders

### Admin APIs
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/{id}/status` - Update order status
- `GET /api/admin/b2b-enquiries` - List B2B enquiries
- `PUT /api/admin/b2b-enquiries/{id}` - Update B2B enquiry status
- `GET /api/admin/partner-applications` - List partner applications
- `PUT /api/admin/partner-applications/{id}` - Update partner status
- `GET /api/admin/reviews` - List all reviews
- `GET /api/admin/dashboard/stats` - Get dashboard stats

## Deployment Checklist

### Environment Variables Required

**Backend (.env):**
```
MONGO_URL=your_mongodb_url
DB_NAME=medequip_db
JWT_SECRET=your_strong_secret_key
CORS_ORIGINS=https://yourdomain.com
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
WHATSAPP_NUMBER=+917617617178
```

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### Pre-Launch Checklist
- [ ] Set strong JWT_SECRET (not the default)
- [ ] Configure CORS_ORIGINS with production domain
- [ ] Switch Razorpay to Live Mode keys
- [ ] Configure Cloudinary for image uploads (optional)
- [ ] Set up production MongoDB (Atlas recommended)
- [ ] Enable HTTPS
- [ ] Test full checkout flow with Live Razorpay

### Post-Launch Tasks
- [ ] Implement httpOnly cookies for JWT (security enhancement)
- [ ] Add pagination to product/order lists
- [ ] Set up email notifications for orders
- [ ] Add invoice PDF downloads
- [ ] Implement wishlists

## Version History

### v1.0 - March 2026 (Current)
- Complete e-commerce platform
- B2B and Partner management
- Razorpay payment integration
- Admin panel with full management
- Mobile responsive design
