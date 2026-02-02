# Memoria - Personal Memory & Moments Tracker

![Memoria Logo](frontend/public/logo.png)

A full-stack web application for capturing, organizing, and analyzing personal memories and moments with rich media support and analytics.

## Team

- **Samat Zharylkap** - Backend Development & Database Design
- **Bekarys Kunussov** - Frontend Development & UI/UX

**Course:** Advanced Databases (NoSQL) Final project

---

## Features

- Create moments with text, images, videos (up to 5 files)
- Mood tracking with 8 different moods
- Tag-based organization
- Memory collections (group related moments)
- Advanced search and filtering
- Personal analytics dashboard
- Responsive design (mobile, tablet, desktop)
- Dark/Light theme support

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios
- Custom CSS

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB v6.0+

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/memoria
JWT_SECRET=your-secret-key-here
EOF

# Start MongoDB
mongod

# Run backend
npm run dev

# Backend runs on http://localhost:5000
```
### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev

# Frontend runs on http://localhost:5173
```
## Project Structure

memoria/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, upload
│   │   └── config/         # DB, Swagger
│   └── uploads/            # Media files
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # 11 pages
│   │   ├── components/     # Reusable components
│   │   └── api.js          # HTTP client
│   └── public/
│
├── README.md               # This file
└── TECHNICAL_REPORT.md     # Detailed documentation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Moments
- `POST /api/moments` - Create moment
- `GET /api/moments` - List moments (with filters)
- `GET /api/moments/:id` - Get moment
- `PATCH /api/moments/:id` - Update moment
- `DELETE /api/moments/:id` - Delete moment
- `POST /api/moments/:id/view` - Increment views

### Memories
- `POST /api/memories` - Create memory
- `GET /api/memories` - List memories
- `GET /api/memories/:id` - Get memory
- `PATCH /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `PATCH /api/memories/:id/add-moment` - Add moment
- `PATCH /api/memories/:id/remove-moment` - Remove moment

### Analytics
- `GET /api/analytics` - Get statistics

## Database Collections

- **users** - User accounts
- **moments** - Individual entries with media
- **memories** - Collections of moments

## Academic Project

This project demonstrates:
- MongoDB CRUD operations
- Embedded & Referenced documents
- Advanced operators ($set, $push, $pull, $inc)
- Aggregation pipelines (4+ stages)
- Compound indexes
- RESTful API design
- JWT authentication
- Full-stack integration


## Documentation

- `README.md` - Quick start guide 
- `TECHNICAL_REPORT.md` - Comprehensive technical documentation


## Contact

- **Samat Zharylkap** - 241851@astanait.edu.kz
- **Bekarys Kunussov** - 241421@astanait.edu.kz






