<div align="center">
  <h1>Starset Contributor Platform</h1>
  <p>A modern, full-stack web platform for scalable AI data contribution, task management, and data validation.</p>
</div>

---

## Overview

The **Starset Contributor Platform** is a specialized platform designed to streamline the crowdsourcing of AI training data. It connects administrators managing data collection campaigns with contributors who execute these tasks to earn rewards. The platform supports various data types including audio recordings, image capture and labeling, text annotation, and surveys, complete with AI-powered validation systems.

## Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** for optimized builds
- **Tailwind CSS** 
- **shadcn/ui** & **Lucide React** 
- **Supabase Client** for authentication & real-time data

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for robust server-side logic
- **Supabase (PostgreSQL)** 
---

## 📂 Project Structure

```text
starset-contributer/
├── frontend/             # React application frontend
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions and shared logic
│   ├── App.tsx           # Main application routing
│   ├── supabaseClient.ts # Supabase configuration
│   └── types.ts          # TypeScript type definitions
├── backend/              # Express.js API server
│   ├── src/              # Backend source code
│   │   ├── routes/       # API endpoints
│   │   ├── db/           # Database interactions
│   │   └── server.ts     # Server entry point
│   └── migrations/       # Database migrations
```

---

## Key Features

### For Contributors
- **Secure Authentication:** Easy signup, login, and profile management.
- **Task Execution:** Participate in audio recording, image capture, text annotation, and more.
- **Dashboard & Earnings:** Track task history, approvals, and money earned.

### For Administrators
- **Task Management:** Create, configure, cap submissions, and delete data collection tasks.
- **Advanced Validation UI:** Review submissions through a comprehensive admin dashboard.
- **Contributor Monitoring:** Monitor user activity and data quality.

### Advanced Functionalities
- **Audio Validation System:** Client-side checks and server-side validation to ensure audio quality.
- **AI Complaint & Data Classification:** Automated routing and prioritization for multimedia submissions.
- **Submission Caps:** Auto-enforce limits on tasks to prevent data overflow.
- **Enhanced Security:** CAPTCHA integration to prevent automated spam and abuse.

---

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn
- A [Supabase](https://supabase.com/) account and project

### 1. Environment Variables

Create `.env` inside the `frontend/` directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

Create `.env` inside the `backend/` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=3000
```

### 2. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on http://localhost:5173 by default.*

### 3. Backend Setup
Navigate to the backend directory, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```
*Backend runs on http://localhost:3000 by default.*

---

## Authentication & Roles

The platform uses Supabase Authentication (Email/Password). 
- **Contributor:** Regular user capable of browsing and executing tasks.
- **Admin:** System administrator with privileges to manage campaigns and validate submissions.

---

## Roadmap & Future Enhancements

- [ ] Native cloud storage integration for efficient media uploads.
- [ ] Integration with payment processing gateways.
- [ ] Advanced analytics and visualization dashboard for admins.
- [ ] Real-time notifications for task approvals and rejections.
- [ ] React Native mobile application for on-the-go data contribution.

---

## License & Support

**License:** Proprietary - All rights reserved.

For technical issues or questions, please contact the development team through the respective channels.
