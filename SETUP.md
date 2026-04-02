# Alaxico - Quick Setup Guide

This guide will help you get the Alaxico Medical Equipment E-Commerce platform running locally.

## Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **MongoDB** 6.0+ (database)
- **Yarn** (package manager)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/alaxico.git
cd alaxico
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your values (see Configuration section below)

# Seed the database with sample data
python seed_data.py

# Start the backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
yarn install

# Create environment file
cp .env.example .env

# Edit .env if needed (default points to localhost:8001)

# Start the frontend
yarn start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api
- **API Docs**: http://localhost:8001/docs

## Configuration

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| MONGO_URL | Yes | MongoDB connection string |
| DB_NAME | Yes | Database name |
| JWT_SECRET | Yes | Secret key for JWT tokens (change in production!) |
| CORS_ORIGINS | Yes | Allowed origins (* for dev, your domain for prod) |
| RAZORPAY_KEY_ID | Yes | Razorpay API Key ID |
| RAZORPAY_KEY_SECRET | Yes | Razorpay API Key Secret |
| CLOUDINARY_* | No | For image uploads (optional) |
| WHATSAPP_NUMBER | Yes | Customer support WhatsApp number |

### Frontend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| REACT_APP_BACKEND_URL | Yes | Backend API URL |

## Test Credentials

After running `seed_data.py`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medequipmart.com | admin123 |
| User | hospital@example.com | demo1234 |
| User | doctor@example.com | demo1234 |

## Razorpay Test Mode

For testing payments, use these test card details:

| Field | Value |
|-------|-------|
| Card Number | 4111 1111 1111 1111 |
| Expiry | Any future date (e.g., 12/26) |
| CVV | Any 3 digits (e.g., 123) |
| OTP | 1234 |

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod --bind_ip_all`
- Check MONGO_URL in .env

### Backend Won't Start
- Check if port 8001 is available
- Verify all dependencies installed: `pip install -r requirements.txt`

### Frontend Build Errors
- Clear node_modules: `rm -rf node_modules && yarn install`
- Check Node.js version: `node --version` (should be 18+)

### Razorpay Not Working
- Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
- Ensure using test keys (rzp_test_*) for development

## Production Deployment

See [README.md](./README.md) for production deployment instructions.

## Support

- **WhatsApp**: +91 7617617178
- **Email**: alaxicohealthcare@gmail.com
