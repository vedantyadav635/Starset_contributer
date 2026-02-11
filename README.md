# Starset Contributor Platform

A modern web platform for AI data contribution and task management.

## 🚀 Project Structure

```
starset-contributor/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Logo.tsx
│   ├── PublicLayout.tsx
│   └── Sidebar.tsx
├── pages/              # Application pages
│   ├── About.tsx
│   ├── AdminCreateTask.tsx
│   ├── AdminDashboard.tsx
│   ├── CompleteProfile.tsx
│   ├── Contributors.tsx
│   ├── Dashboard.tsx
│   ├── Earnings.tsx
│   ├── LandingPage.tsx
│   ├── Login.tsx
│   ├── Money.tsx
│   ├── Signup.tsx
│   ├── TaskExecution.tsx
│   └── TaskList.tsx
├── starset-backend/    # Express.js backend API
│   └── src/
│       ├── routes/
│       ├── db/
│       └── server.ts
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions
├── supabaseClient.ts   # Supabase configuration
└── .archive/           # Archived files (SQL scripts, old docs)
```

## 📦 Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Supabase** for authentication & database

### Backend
- **Node.js** with Express
- **TypeScript**
- **Supabase** for database operations

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create a `.env` file in `starset-backend/`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd starset-backend
npm install
cd ..
```

### Running the Application

1. **Start the backend server:**
```bash
cd starset-backend
npm run dev
```
Backend runs on `http://localhost:3000`

2. **Start the frontend (in a new terminal):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🎯 Features

### For Contributors
- ✅ User authentication (signup/login)
- ✅ Profile completion
- ✅ Browse available tasks
- ✅ Execute tasks (audio recording, image capture, text annotation)
- ✅ Track earnings
- ✅ View task history

### For Admins
- ✅ Admin dashboard
- ✅ Create new tasks
- ✅ View all tasks
- ✅ Delete tasks
- ✅ Monitor contributor activity

### Task Types
- 🎤 **Audio Collection** - Record voice samples
- 📷 **Image Collection** - Capture photos
- 🏷️ **Image Labeling** - Annotate images
- 📝 **Text Annotation** - Classify text
- 📊 **Survey** - Answer questions

## 📝 Database Schema

### Tables
- `profiles` - User profile information
- `tasks` - Task definitions and metadata

## 🔐 Authentication

Uses Supabase Authentication with email/password.

### User Roles
- `contributor` - Regular users who complete tasks
- `admin` - Administrators who manage tasks

## 🚧 Future Enhancements

- [ ] Cloud storage integration for audio/image uploads
- [ ] Payment processing
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Mobile app

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions, please contact the development team.
