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

## Core Requirements

### User-Facing Features
- ✅ Homepage with professional medical design, hero carousel, featured products, trust indicators
- ✅ Product Catalog with category browsing and listings
- ✅ Rich Product Detail Page with galleries, feature highlights, specs, expandable sections
- ✅ Functional Like/Share buttons on product pages
- ✅ Bulk Order Generation (B2B) via form
- ✅ Search & Filter capabilities
- ✅ Retail Cart & Checkout
- ✅ Multiple Payment Methods (Razorpay, COD, Bank Transfer, EMI, Pay Later)
- ✅ User Accounts (Email/Password & Google Login)
- ✅ User Dashboard with order history
- ✅ Verified customer reviews and testimonials
- ✅ Floating WhatsApp chat integration
- ✅ EMI Calculator for high-value products

### Admin Panel Features
- ✅ Full Product Management (Create/Edit/Delete)
- ✅ Rich product content editing (galleries, highlights, specifications)
- ✅ Payment method configuration per product
- ✅ Category Management
- ✅ Order Management (Retail & Bulk)
- ✅ User and Verification Management
- ✅ Customer Reviews Management (Approve/Reject)
- ✅ Sales Analytics Dashboard

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn/UI, Lucide Icons
- **Backend**: FastAPI, Pydantic
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT + Emergent Google OAuth
- **Payments**: Razorpay (Cards, UPI, NetBanking), COD, Bank Transfer, EMI, Pay Later

## What's Been Implemented

### December 2025
- Complete UI overhaul to professional "light purple" theme
- Rich Product Detail Page v2 with:
  - Thumbnail gallery
  - Key features with checkmarks
  - Feature highlights with icons
  - Expandable description/specs/warranty/shipping sections
  - Functional Like button (wishlist)
  - Functional Share button (WhatsApp, Facebook, Twitter, Copy Link)
  - "You May Also Like" related products section
- Multi-Payment Method System:
  - Backend support for 5 payment methods
  - Admin panel toggles for per-product payment configuration
  - Checkout page with dynamic payment method display
  - COD, Bank Transfer, Pay Later order creation APIs
- Admin Panel Enhancements:
  - Edit existing products
  - Manage rich product content
  - Payment method configuration per product
- Full test suite for payment methods and like/share features

## Known Limitations
- **Razorpay Integration**: Uses placeholder test keys - requires user to provide real API keys for online payments
- **Product Data**: Currently using placeholder product data - needs real Alaxico catalog

## P0 - Critical (Completed)
- ✅ Multi-payment method feature
- ✅ Like/Share buttons on product detail page
- ✅ Admin product editing with payment methods

## P1 - High Priority (Pending)
- ⏳ Razorpay integration with real API keys (blocked on user input)
- ⏳ Add real Alaxico products from catalog with correct pricing/specs

## P2 - Medium Priority (Backlog)
- Email notifications for order status updates
- Wishlist / "Save for Later" functionality
- Product Comparison feature
- Invoice PDF downloads

## P3 - Low Priority (Future)
- Advanced "Request for Quote" (RFQ) system for B2B
- Advanced search with filters for price, brand, availability

## Test Credentials
- **Admin**: admin@medequipmart.com / admin123
- **User**: clinic@example.com / demo123

## Test Files
- `/app/backend/tests/test_payment_methods.py`
- `/app/backend/tests/test_medequipmart_api.py`

## API Endpoints

### Payment Methods
- `GET /api/payment-methods` - List all available payment methods
- `GET /api/cart/payment-methods` - Get available methods for cart items
- `POST /api/orders/create-cod-order` - Create COD/Bank Transfer/Pay Later order

### Product Features
- `POST /api/products/{id}/like` - Toggle like on product
- `GET /api/products/{id}/liked` - Check if user liked product
- `GET /api/products/{id}/related` - Get related products

### Admin
- `POST /api/admin/products` - Create product with payment methods
- `PUT /api/admin/products/{id}` - Update product with payment methods
