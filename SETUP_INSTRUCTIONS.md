# Mavi-AstroVision Setup Guide

## Phase 1 & 2: Installation & Backend Setup

### Prerequisites
- Node.js 16+ (download from nodejs.org)
- MongoDB (local or Atlas cloud)
- Git

### Server Setup

1. **Configure Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Server will run on: `http://localhost:5000`
   
   Health check: `http://localhost:5000/api/health`

### MongoDB Setup

**Local Installation:**
- Download from: https://www.mongodb.com/try/download/community
- Follow platform-specific installation

**Cloud (Atlas):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string and add to `.env` as `MONGODB_URI`

---

## Phase 3: Frontend Setup

1. **Configure Environment Variables**
   ```bash
   cd client
   cp .env.example .env.local
   # Keep VITE_API_URL=http://localhost:5000/api for local development
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Client will run on: `http://localhost:5173`

---

## Phase 4: Testing

### Testing Flow

1. **Landing Page** (`/`)
   - View without authentication
   - Explore features overview

2. **Register** (`/register`)
   - Create new account
   - Required: First Name, Last Name, Email, Password
   
3. **Login** (`/login`)
   - Login with created account
   - Redirects to dashboard on success

4. **Dashboard** (`/dashboard`)
   - View horoscope for your sign
   - Quick stats overview
   - Navigation to other features

5. **Birth Chart** (`/birth-chart`)
   - Add birth details (date, time, location)
   - View celestial wheel visualization
   - Save multiple charts

6. **Horoscopes** (`/horoscope`)
   - Browse all zodiac signs
   - Select daily/weekly/monthly
   - Save to favorites

7. **Profile** (`/profile`)
   - Edit personal information
   - View account details
   - Logout

8. **Admin Panel** (`/admin`)
   - Only visible if role = admin
   - Manage users
   - Create/edit/delete horoscopes
   - View dashboard statistics

### API Testing Endpoints

**Authentication:**
```bash
POST   http://localhost:5000/api/auth/register
POST   http://localhost:5000/api/auth/login
GET    http://localhost:5000/api/auth/me          # Protected
```

**Users:**
```bash
GET    http://localhost:5000/api/users/profile    # Protected
PUT    http://localhost:5000/api/users/profile    # Protected
POST   http://localhost:5000/api/users/birth-details  # Protected
```

**Horoscope:**
```bash
GET    http://localhost:5000/api/horoscope/daily/:sign
GET    http://localhost:5000/api/horoscope               # Get all
GET    http://localhost:5000/api/horoscope/me/daily      # Protected
POST   http://localhost:5000/api/horoscope/:id/favorite  # Protected
```

**Charts:**
```bash
POST   http://localhost:5000/api/chart/generate   # Protected
GET    http://localhost:5000/api/chart/:chartId   # Protected
GET    http://localhost:5000/api/chart/user/all   # Protected
```

**Admin (requires admin role):**
```bash
GET    http://localhost:5000/api/admin/stats
GET    http://localhost:5000/api/admin/users
POST   http://localhost:5000/api/admin/horoscopes
```

---

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in .env
- Verify credentials for cloud connection

**CORS Errors**
- Backend CORS should allow `http://localhost:5173`
- Check `CLIENT_URL` in server `.env`

**Port Already in Use**
- Server port 5000: `lsof -i :5000` then kill process
- Client port 5173: Vite will use 5174 automatically

**API Not Connecting**
- Ensure backend is running on `:5000`
- Check `VITE_API_URL` in client `.env.local`
- Look at browser network tab for errors

---

## Deployment

### Server Deployment
- Recommended: Railway, Render, Fly.io, Google Cloud
- Set environment variables in hosting platform
- Use MongoDB Atlas for cloud database
- Build: `npm run build` or deploy from git directly

### Client Deployment
- Recommended: Vercel, Netlify, GitHub Pages
- Build: `npm run build`
- Deploy `dist/` folder
- Set `VITE_API_URL` to production backend URL

---

## Generated Project Structure

```
Mavi-Astro/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.local
│   └── package.json
└── README.md
```

---

## Features Implemented

✅ **Backend**
- Express.js REST API
- MongoDB with Mongoose
- JWT Authentication
- User Management
- Birth Details Tracking
- Horoscope Management
- Admin Panel
- Email Service Integration
- Astrology API Integration

✅ **Frontend**
- React with Vite
- React Router for navigation
- Context API for state management
- Tailwind CSS with custom theme
- Framer Motion animations
- Responsive design
- Dark/Light theme toggle
- Real-time toast notifications
- Birth chart visualization
- Chat bot integration

---

For support and updates, visit: https://github.com/yourusername/mavi-astrovision
