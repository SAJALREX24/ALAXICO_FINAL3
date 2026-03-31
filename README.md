# Alaxico - Medical Equipment E-Commerce Platform

A professional, trustworthy, and scalable medical equipment e-commerce platform targeting hospitals, clinics, doctors, diagnostic centers, distributors, and individual buyers.

## 🚀 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Shadcn/UI, Lucide Icons
- **Backend**: FastAPI, Pydantic, Python 3.11+
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT + Google OAuth
- **Payments**: Razorpay (Cards, UPI, NetBanking), COD, Bank Transfer, Pay Later

## 📦 Features

### Customer Features
- 🏠 Professional homepage with hero slider, promotions, trust indicators
- 🛒 Full e-commerce: Products, Cart, Checkout
- 💳 Multiple payment methods (Razorpay, UPI, COD, Bank Transfer)
- 👤 User accounts with order history
- ⭐ Verified customer reviews with photo/video uploads
- 📱 Full mobile responsiveness
- 💬 WhatsApp chat integration

### Business Features
- 💼 B2B bulk order enquiries with tiered pricing
- 🤝 Partner programs (Distributor, Affiliate, Healthcare, Campus)
- 📍 Store locator
- 🔧 Product comparison tool
- 📊 Equipment recommendation quiz

### Admin Panel
- 📦 Product management (CRUD with rich content)
- 📋 Order management (Retail & Bulk)
- 👥 User & verification management
- ⭐ Review moderation
- 📈 Sales analytics dashboard
- 💼 B2B enquiries management
- 🤝 Partner applications management

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB 6.0+

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env
# Edit .env with your values

# Seed the database
python seed_data.py

# Run the server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your backend URL

# Run the development server
yarn start
```

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|----------|
| MONGO_URL | MongoDB connection string | mongodb://localhost:27017/medequip_db |
| DB_NAME | Database name | medequip_db |
| JWT_SECRET | Secret key for JWT tokens | your-secret-key |
| CORS_ORIGINS | Allowed origins (comma-separated) | https://alaxico.com |
| RAZORPAY_KEY_ID | Razorpay Key ID | rzp_test_xxx or rzp_live_xxx |
| RAZORPAY_KEY_SECRET | Razorpay Key Secret | your_secret |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your_cloud |
| CLOUDINARY_API_KEY | Cloudinary API key | your_key |
| CLOUDINARY_API_SECRET | Cloudinary API secret | your_secret |
| WHATSAPP_NUMBER | WhatsApp business number | +917617617178 |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|----------|
| REACT_APP_BACKEND_URL | Backend API URL | https://api.alaxico.com |

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medequipmart.com | admin123 |
| Hospital | hospital@example.com | demo1234 |
| Doctor | doctor@example.com | demo1234 |

## 💳 Razorpay Test Cards

| Card Number | Expiry | CVV | OTP |
|-------------|--------|-----|-----|
| 4111 1111 1111 1111 | Any future | Any 3 digits | 1234 |

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py          # FastAPI application
│   ├── seed_data.py       # Database seeding script
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/        # React page components
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (Auth, Cart)
│   │   └── lib/          # Utilities and helpers
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables
└── memory/
    └── PRD.md           # Product Requirements Document
```

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure CORS_ORIGINS with your domain
- [ ] Add Razorpay Live keys (after approval)
- [ ] Configure Cloudinary for image uploads
- [ ] Set up MongoDB Atlas or production database

### Deployment Options

1. **Emergent Platform** - One-click deploy
2. **Vercel** (Frontend) + **Railway** (Backend)
3. **Docker** - Containerized deployment
4. **VPS** - Traditional server deployment

## 📞 Support

- **WhatsApp**: +91 7617617178
- **Email**: alaxicohealthcare@gmail.com
- **Address**: UG-6, Rajnandini Plaza, Shastripuram Road, Agra, UP

## 📄 License

Proprietary - Alaxico Healthcare © 2026
