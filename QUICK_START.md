# 🌟 Mavi-AstroVision Quick Start Guide

## ✅ Status: Fully Operational

### Running Servers

**Terminal 1 - Frontend (Vite Dev Server)**
```bash
cd client
npm run dev
```
📍 Access at: **http://localhost:5175**

**Terminal 2 - Backend (Express API)**
```bash
cd server
node server.js
# or with auto-reload:
npm run dev
```
🔗 API at: **http://localhost:5000/api**
🏥 Health check: **http://localhost:5000/api/health**

---

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@maviastrovision.com`
- Password: `Admin@1234`

---

## 📝 API Endpoints (Examples)

### Authentication
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",  
  "email": "john@example.com",
  "password": "Pass@123",
  "phone": "+1234567890",
  "gender": "male"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "Pass@123"
}

# Get Current User
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

### Horoscopes
```bash
# Get daily horoscope by zodiac sign
GET http://localhost:5000/api/horoscope/daily/aries

# Get personalized horoscope (requires auth)
GET http://localhost:5000/api/horoscope/me/daily
Authorization: Bearer <token>

# Get all horoscopes (paginated)
GET http://localhost:5000/api/horoscope?page=1&limit=10&sign=aries
```

### User Profile
```bash
# Get profile (requires auth)
GET http://localhost:5000/api/users/profile
Authorization: Bearer <token>

# Update profile
PUT http://localhost:5000/api/users/profile
Authorization: Bearer <token>
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321"
}

# Add birth details
POST http://localhost:5000/api/users/birth-details
Authorization: Bearer <token>
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "timeOfBirth": "14:30",
  "placeOfBirth": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Birth Chart
```bash
# Generate birth chart
POST http://localhost:5000/api/chart/generate
Authorization: Bearer <token>
{ "birthDetailId": "<birth_detail_id>" }

# Get user's birth charts
GET http://localhost:5000/api/chart/user/all
Authorization: Bearer <token>
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

**Backend** (`server/.env`):
```env
MONGO_URI=mongodb://localhost:27017/maviAstro
PORT=5000
JWT_SECRET=mavi_astrovision_super_secret_jwt_key_2024
CLIENT_URL=http://localhost:5175
ASTROLOGY_API_KEY=<your_key>
ASTROLOGY_API_BASE_URL=https://json.astrologyapi.com/v1
```

**Frontend** (`client/.env` - optional):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database

### MongoDB Setup

**Local MongoDB:**
- Install MongoDB Community from mongodb.com
- Run: `mongod`

**MongoDB Atlas (Cloud):**
1. Sign up at mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/mavi-astro`
4. Update `MONGO_URI` in `.env`

---

## 🧪 Testing the Application

### 1. Register a New User
- Visit http://localhost:5175
- Click "Register"
- Fill in details and submit

### 2. Login
- Use registered credentials
- JWT token automatically stored in localStorage

### 3. Add Birth Details
- Go to Profile page
- Add birth date, time, and location
- System auto-calculates zodiac signs

### 4. View Horoscopes
- Visit Horoscope page
- Browse by zodiac sign and time period
- Add favorites with heart icon

### 5. Generate Birth Chart
- Go to Birth Chart page
- Enter birth details
- View animated zodiac wheel visualization

### 6. Admin Panel (Admin only)
- Login with admin credentials
- View statistics dashboard
- Manage users and horoscopes

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Windows - Kill process using port
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or use different port
PORT=5001 node server.js
```

### "Cannot connect to MongoDB"
- Ensure MongoDB is running (`mongod`)
- OR update `MONGO_URI` with MongoDB Atlas connection string

### "Astrology API errors"
- Get free API key from astrologyapi.com
- Add to `.env` as `ASTROLOGY_API_KEY`

### CORS errors
- Ensure `CLIENT_URL` in `.env` matches frontend URL
- Default: `http://localhost:5175`

---

## 📦 Project Structure

```
mavi-astro/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Profile, Horoscope, etc.
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth & Theme context
│   │   └── utils/         # API client, helpers
│   └── package.json
│
└── server/                 # Express + MongoDB backend
    ├── models/            # Mongoose schemas
    ├── controllers/       # Route handlers
    ├── routes/            # API endpoints
    ├── middleware/        # Auth, admin checks
    ├── services/          # Business logic, API calls
    ├── config/            # Database connection
    └── server.js          # Entry point
```

---

## 📚 Tech Stack

**Frontend:**
- React 19, Vite, Tailwind CSS
- Framer Motion (animations)
- Axios (HTTP client)
- React Router v7

**Backend:**
- Node.js, Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for emails
- AstrologyAPI.com integration

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd client
vercel deploy
```

### Render/Railway (Backend)
1. Push code to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

---

## 📞 Support

For issues or questions, check:
- Error console (browser DevTools: F12)
- Terminal output
- `.env` configuration
- MongoDB connection status

**Happy stargazing! ⭐**
