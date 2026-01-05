# Viswam OTT - Setup Guide

## Project Structure

```
Viswam OTT/
├── backend/              # Backend API (Node.js/Express)
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── src/                 # Frontend (React/Vite)
│   ├── components/      # React components
│   ├── pages/           # Page components
│   └── ...
└── package.json         # Frontend dependencies
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Create `.env` file in `backend/` folder:
```env
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb+srv://akhileshsamayamanthula:rxvIPIT4Bzobk9Ne@cluster0.4ej8ne2.mongodb.net/LMS?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=viswam_ott_super_secret_key_change_in_production
```

4. Start the backend server:
```bash
npm start
```

Or from root directory:
```bash
npm run server
```

The server will run on `http://localhost:3001`

### 2. Frontend Setup

1. From root directory, install dependencies (if not already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## Running Both Servers

### Option 1: Separate Terminals
- Terminal 1: `npm run server` (backend)
- Terminal 2: `npm run dev` (frontend)

### Option 2: Background Process
- Backend: `npm run server` (runs in background)
- Frontend: `npm run dev` (in another terminal)

## Access Points

- **Homepage**: http://localhost:8080/
- **Login Page**: http://localhost:8080/login
- **School Dashboard**: http://localhost:8080/dashboard
- **Super Admin Dashboard**: http://localhost:8080/super-admin
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## API Endpoints

### Authentication
- `POST /api/auth/school/login` - School login
- `POST /api/auth/super-admin/login` - Super admin login

### Videos
- `GET /api/videos` - Get all videos (School Admin)
- `POST /api/videos` - Create video (Super Admin)
- `GET /api/videos/:id` - Get video details

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject (Super Admin)

### Schools
- `GET /api/schools` - Get all schools (Super Admin)
- `GET /api/schools/dashboard` - Get dashboard stats (School Admin)

### Reports
- `GET /api/reports` - Get usage reports (School Admin)

### Downloads
- `GET /api/downloads/requests` - Get download requests
- `POST /api/downloads/requests` - Create download request

## Default Credentials

You'll need to create these in the database first:

### Super Admin
- Email: admin@viswam.com
- Password: (set in database)

### School
- Email: school@example.com
- Password: (set in database)

## Troubleshooting

### Backend won't start
1. Check if MongoDB connection string is correct in `.env`
2. Ensure port 3001 is not in use
3. Check backend console for errors

### Frontend won't connect to backend
1. Ensure backend is running on port 3001
2. Check CORS settings in backend
3. Verify API endpoints in frontend code

### Module errors
- Backend uses CommonJS (require/module.exports)
- Frontend uses ES modules (import/export)
- Each has its own package.json

## Next Steps

1. Create initial Super Admin account in database
2. Create test schools in database
3. Upload test videos through Super Admin dashboard
4. Test School Admin login and video viewing



