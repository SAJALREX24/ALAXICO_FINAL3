# Alaxico - Medical Equipment E-Commerce Platform

## Project Overview
A professional, trustworthy, and scalable medical equipment e-commerce platform targeting hospitals, clinics, doctors, diagnostic centers, distributors, and individual buyers. **Branded as "Alaxico - Trusted Healthcare Partner"**.

## Original Problem Statement
Build a medical equipment e-commerce website inspired by Dr. Orgs with:
- Product catalog with category browsing
- Bulk order generation (B2B) for hospitals/clinics
- Retail cart & checkout with Razorpay integration
- Admin panel for full management
- User accounts with verification badges
- WhatsApp chat integration

## Target Users
- **Hospitals** - Bulk equipment purchases
- **Clinics** - Medium-scale equipment needs
- **Doctors** - Personal practice equipment
- **Distributors** - Wholesale purchases
- **Individual Buyers** - Retail medical devices

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI, Embla Carousel
- **Backend**: FastAPI (Python), Pydantic
- **Database**: MongoDB
- **Authentication**: JWT (72-hour expiry) + Emergent Google OAuth
- **Payments**: Razorpay (needs real API keys)
- **Charts**: Recharts (for admin dashboard)

## Design Theme
**Current Theme**: Professional Light Purple (#8B5CF6)
- Primary: Light purple (#8B5CF6)
- Background: White / Light purple tint (#FAF5FF, #F5F3FF)
- Borders: Purple-100 (#E9D5FF)
- Text: Gray-900, Gray-500, Gray-600
- Style: Clean, minimal, professional healthcare aesthetic

## Core Features Implemented

### ✅ User-Facing Features
| Feature | Status | Notes |
|---------|--------|-------|
| Homepage with Hero Slider | ✅ Complete | 6-slide carousel with Alaxico products |
| Product Catalog | ✅ Complete | Category filtering, search |
| Product Detail Page | ✅ Complete | Specifications, reviews, EMI calculator |
| Bulk Order Form (B2B) | ✅ Complete | Full form with submission to DB |
| Cart & Checkout | ✅ Complete | Add/remove items, quantity management |
| User Authentication | ✅ Complete | JWT + Google OAuth |
| User Dashboard | ✅ Complete | Orders history, PDF invoice download |
| Verification Badges | ✅ Complete | Hospital, Clinic, Doctor, Distributor |
| WhatsApp Integration | ✅ Complete | Floating chat button |
| Customer Reviews | ✅ Complete | With admin approval system |
| Recently Viewed Products | ✅ Complete | Local storage based |

### ✅ Admin Features
| Feature | Status | Notes |
|---------|--------|-------|
| Products Management | ✅ Complete | CRUD operations |
| Orders Management | ✅ Complete | View all orders |
| Bulk Enquiries Management | ✅ Complete | Status updates |
| Reviews Management | ✅ Complete | Approval/rejection |
| Verification Management | ✅ Complete | Approve/reject user verification |
| Sales Dashboard | ✅ Complete | Revenue charts, metrics |

## Pending/Blocked Items

### 🔴 Blocked
- **Razorpay Payment**: Non-functional - awaiting real API keys from user

### 🟡 Upcoming Tasks
- Add Alaxico products from catalog to database
- Deploy to alaxico.com domain

### 🔵 Future/Backlog
- Email notifications for order status
- Wishlist / "Save for Later"
- Product Comparison
- Advanced RFQ system for B2B
- Advanced search filters

## Test Credentials
- **Admin**: admin@medequipmart.com / admin123
- **User**: clinic@example.com / demo123

## API Endpoints
```
Auth:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google-callback

Products:
GET /api/products
GET /api/products/{id}
POST /api/products (admin)
DELETE /api/products/{id} (admin)

Cart:
GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/remove/{product_id}

Orders:
POST /api/orders/create-razorpay-order
POST /api/orders/verify-payment
GET /api/orders/my-orders
GET /api/orders/{id}/invoice

Bulk Enquiries:
POST /api/bulk-enquiries
GET /api/bulk-enquiries/my-enquiries

Reviews:
POST /api/reviews
GET /api/reviews/product/{product_id}
GET /api/reviews/featured
```

## Last Updated
February 4, 2026 - Applied professional light purple theme across all pages
