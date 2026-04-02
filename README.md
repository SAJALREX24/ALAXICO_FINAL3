# Alaxico - Medical Equipment E-Commerce Platform

A professional, trustworthy, and scalable medical equipment e-commerce platform targeting hospitals, clinics, doctors, diagnostic centers, distributors, and individual buyers.

![Alaxico](https://customer-assets.emergentagent.com/job_init-point/artifacts/zs61d4n7_M1.jpeg)

## 🚀 Features

### Customer Features
- 🏠 **Professional Homepage** - Hero slider, promotional banners, trust indicators
- 🛒 **Full E-Commerce** - Products, cart, checkout with multiple payment methods
- 💳 **Multiple Payments** - Razorpay (Cards, UPI, NetBanking), COD, Bank Transfer, Pay Later
- 👤 **User Accounts** - Registration, login, order history
- ⭐ **Reviews System** - Verified reviews with photo/video uploads
- 📱 **Fully Responsive** - Works on all devices
- 💬 **WhatsApp Integration** - Floating chat widget for support

### Business Features
- 💼 **B2B Section** - Bulk pricing tiers (10-25% discounts), enquiry form
- 🤝 **Partner Programs** - Distributor, Affiliate, Healthcare, Campus Ambassador
- 📍 **Store Locator** - Find Alaxico locations
- 🔧 **Product Comparison** - Compare up to 4 products
- 📊 **Equipment Quiz** - Recommendation tool

### Admin Panel
- 📦 **Product Management** - Full CRUD with rich content editing
- 📋 **Order Management** - Track and manage all orders
- 💼 **B2B Enquiries** - View and respond to business enquiries
- 🤝 **Partner Applications** - Manage partner requests
- ⭐ **Review Moderation** - Approve/reject customer reviews
- 📈 **Analytics Dashboard** - Sales stats and insights

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Tailwind CSS, Shadcn/UI, Lucide Icons |
| **Backend** | FastAPI, Pydantic, Python 3.11+ |
| **Database** | MongoDB (Motor async driver) |
| **Auth** | JWT + Google OAuth |
| **Payments** | Razorpay |

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB 6.0+
- Yarn

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/alaxico.git
cd alaxico

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Edit with your values
python seed_data.py       # Seed database
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend setup (new terminal)
cd frontend
yarn install
cp .env.example .env      # Edit if needed
yarn start
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api
- **API Docs**: http://localhost:8001/docs

## 🔑 Configuration

### Backend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | ✅ | MongoDB connection string |
| `DB_NAME` | ✅ | Database name |
| `JWT_SECRET` | ✅ | Secret for JWT tokens |
| `CORS_ORIGINS` | ✅ | Allowed origins (comma-separated) |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay Key Secret |
| `WHATSAPP_NUMBER` | ✅ | Support WhatsApp number |
| `CLOUDINARY_*` | ❌ | For image uploads (optional) |

### Frontend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_BACKEND_URL` | ✅ | Backend API URL |

## 🧪 Test Credentials

After running `seed_data.py`:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@medequipmart.com | admin123 |
| **User** | hospital@example.com | demo1234 |
| **User** | doctor@example.com | demo1234 |

### Razorpay Test Cards

| Card Number | Expiry | CVV | OTP |
|-------------|--------|-----|-----|
| 4111 1111 1111 1111 | Any future | Any 3 digits | 1234 |

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py           # FastAPI application
│   ├── seed_data.py        # Database seeding
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   └── lib/            # Utilities
│   ├── package.json        # Node dependencies
│   └── .env.example        # Environment template
├── memory/
│   └── PRD.md              # Product requirements
├── README.md               # This file
└── SETUP.md                # Detailed setup guide
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `CORS_ORIGINS` to your domain(s)
- [ ] Switch Razorpay to Live Mode keys
- [ ] Configure Cloudinary for image uploads
- [ ] Set up production MongoDB (Atlas recommended)
- [ ] Enable HTTPS

## 📞 Support

- **WhatsApp**: +91 7617617178
- **Email**: alaxicohealthcare@gmail.com
- **Address**: UG-6, Rajnandini Plaza, Shastripuram Road, Agra, UP

## 📄 License

Proprietary - Alaxico Healthcare © 2026
