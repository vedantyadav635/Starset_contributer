# Complete Project Documentation

## 🎯 **Project Overview**

**Starset Contributor Platform** is a web application that allows users to earn money by completing AI training tasks such as:
- 🎤 Recording audio samples
- 📸 Capturing images
- ✍️ Annotating text
- 📊 Completing surveys

---

## 📁 **Project Structure**

```
starset-contributor/
│
├── 📁 components/              # Reusable UI components
│   ├── Button.tsx             # Custom button component
│   ├── Logo.tsx               # Starset logo component
│   ├── PublicLayout.tsx       # Layout for public pages
│   └── Sidebar.tsx            # Navigation sidebar
│
├── 📁 pages/                   # Application pages
│   ├── About.tsx              # About page
│   ├── AdminCreateTask.tsx    # Admin: Create new tasks
│   ├── AdminDashboard.tsx     # Admin: Dashboard
│   ├── CompleteProfile.tsx    # User: Complete profile form
│   ├── Contributors.tsx       # Public: Contributors info
│   ├── Dashboard.tsx          # User: Main dashboard
│   ├── Earnings.tsx           # User: Earnings page
│   ├── LandingPage.tsx        # Public: Home page
│   ├── Login.tsx              # Authentication: Login
│   ├── Money.tsx              # Public: Payment info
│   ├── Signup.tsx             # Authentication: Signup
│   ├── TaskExecution.tsx      # User: Execute tasks (CORE)
│   └── TaskList.tsx           # User: Browse tasks
│
├── 📁 starset-backend/         # Express.js backend
│   ├── 📁 src/
│   │   ├── 📁 routes/         # API routes
│   │   ├── 📁 db/             # Database connection
│   │   └── server.ts          # Main server file
│   ├── package.json
│   └── .env                   # Backend environment variables
│
├── 📁 context/                 # React context
│   └── AuthContext.jsx        # Authentication context
│
├── 📁 .archive/                # Archived files (not in git)
│   ├── 📁 sql-scripts/        # Old SQL debugging scripts
│   └── 📁 docs/               # Old documentation
│
├── App.tsx                     # Main app component (CORE)
├── types.ts                    # TypeScript type definitions
├── supabaseClient.ts           # Supabase configuration
├── index.tsx                   # React entry point
├── global.css                  # Global styles
├── .env                        # Frontend environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
│
└── 📄 Documentation Files
    ├── README.md                      # Project overview
    ├── CODE_DOCUMENTATION.md          # Code structure docs
    ├── TASK_EXECUTION_DOCS.md         # TaskExecution component docs
    ├── CLEANUP_SUMMARY.md             # Cleanup actions log
    └── PROJECT_DOCUMENTATION.md       # This file!
```

---

## 🔑 **Key Files Explained**

### **App.tsx** ⭐ MOST IMPORTANT
- Main application component
- Manages all global state (auth, navigation, tasks)
- Routes between public and authenticated pages
- Handles login/logout flow
- **Read this first to understand the app!**

### **TaskExecution.tsx** ⭐ CORE FEATURE
- Handles all task types (audio, image, text, survey)
- Implements audio recording with MediaRecorder API
- Implements image capture with Camera API
- Multi-step workflow (brief → consent → execute → submit)
- **This is where the magic happens!**

### **supabaseClient.ts**
- Configures Supabase connection
- Used for authentication and database
- Reads from `.env` file

### **types.ts**
- TypeScript type definitions
- Defines Task, User, TaskType, etc.
- Ensures type safety across the app

---

## 🗄️ **Database Schema (Supabase)**

### **profiles** table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,                    -- User ID (matches auth.users)
  email TEXT,                             -- User email
  full_name TEXT,                         -- User's full name
  role_text TEXT DEFAULT 'contributor',   -- 'contributor' or 'admin'
  age_int INTEGER,                        -- User's age
  gender_text TEXT,                       -- User's gender
  city_text TEXT,                         -- User's city
  state_text TEXT,                        -- User's state
  upi_id_text TEXT,                       -- UPI ID for payments
  profile_completed BOOLEAN DEFAULT false, -- Has completed profile?
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **tasks** table (managed by backend)
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,                    -- Task ID (e.g., 't-101')
  title TEXT NOT NULL,                    -- Task title
  type TEXT NOT NULL,                     -- 'audio', 'image', 'text', 'survey'
  compensation DECIMAL(10,2),             -- Payment amount
  currency TEXT DEFAULT 'INR',            -- Currency
  estimated_time_min INTEGER,             -- Estimated time in minutes
  status TEXT DEFAULT 'available',        -- 'available', 'completed', etc.
  language TEXT,                          -- Task language
  instructions TEXT,                      -- Task instructions
  prompt TEXT,                            -- Task prompt
  ai_capability TEXT,                     -- What AI learns
  data_usage TEXT,                        -- How data is used
  image_url TEXT,                         -- Task thumbnail
  project TEXT,                           -- Project name
  difficulty TEXT,                        -- 'Beginner', 'Intermediate', 'Expert'
  requirements TEXT[],                    -- Array of requirements
  options TEXT[],                         -- Survey options (if applicable)
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 **Authentication Flow**

```
1. User visits landing page
   ↓
2. Clicks "Start Earning" or "Login"
   ↓
3. Enters email/password on Login/Signup page
   ↓
4. Supabase authenticates user
   ↓
5. App fetches user profile from database
   ↓
6. Check if profile is complete
   ├─ NO → Redirect to CompleteProfile page
   └─ YES → Redirect to Dashboard
```

### **Profile Completion Flow**
```
CompleteProfile Page
   ↓
User enters:
   - Age
   - Gender
   - City
   - State
   - UPI ID
   ↓
Submit to Supabase
   ↓
Update profiles table (profile_completed = true)
   ↓
Redirect to Dashboard
```

---

## 🎯 **Task Execution Flow**

```
1. User browses TaskList
   ↓
2. Clicks on a task
   ↓
3. TaskExecution component loads
   ↓
4. STEP 1: Brief
   - Shows task instructions
   - Explains compensation
   - Shows what AI learns
   ↓
5. STEP 2: Consent
   - User must agree to data usage
   - Cannot proceed without consent
   ↓
6. STEP 3: Execute
   ├─ Audio Task: Record audio with microphone
   ├─ Image Task: Capture photo with camera
   ├─ Text Task: Write/annotate text
   └─ Survey Task: Select option
   ↓
7. User submits
   ↓
8. STEP 4: Submitted
   - Shows confirmation
   - Updates earnings (TODO: implement)
   - Returns to TaskList
```

---

## 🛠️ **Tech Stack**

### **Frontend**
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (fast!)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### **Backend**
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **ts-node-dev** - Development server

### **Database & Auth**
- **Supabase** - PostgreSQL database + Authentication
- **Supabase Client** - JavaScript SDK

### **APIs Used**
- **MediaRecorder API** - Audio recording
- **getUserMedia API** - Camera/microphone access
- **Canvas API** - Image capture from video

---

## 🚀 **Setup Instructions**

### **1. Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd starset-backend
npm install
```

### **2. Configure Environment Variables**

**Frontend (`.env`):**
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Backend (`starset-backend/.env`):**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **3. Run Development Servers**

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd starset-backend
npm run dev
```

### **4. Access the App**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 📊 **API Endpoints (Backend)**

### **Tasks**
- `GET /admin/tasks` - Get all tasks
- `POST /admin/tasks` - Create new task (Admin only)
- `DELETE /admin/tasks/:id` - Delete task (Admin only)

### **Submissions** (TODO)
- `POST /submissions` - Submit completed task
- `GET /submissions/user/:userId` - Get user's submissions

### **Earnings** (TODO)
- `GET /earnings/user/:userId` - Get user's earnings
- `POST /earnings/withdraw` - Request withdrawal

---

## 🔒 **Security Features**

### **Implemented**
- ✅ Supabase authentication (email/password)
- ✅ Role-based access control (Admin vs Contributor)
- ✅ Auto-logout after 15 minutes of inactivity
- ✅ Profile completion check
- ✅ Consent required before task execution
- ✅ Environment variables for sensitive data
- ✅ `.gitignore` prevents committing secrets

### **TODO**
- ⏳ Rate limiting on API endpoints
- ⏳ CSRF protection
- ⏳ Input validation and sanitization
- ⏳ Encrypted file uploads
- ⏳ Audit logging for admin actions

---

## 💰 **Payment Integration (TODO)**

### **Current State**
- UPI ID collected in profile
- Earnings displayed in UI
- No actual payment processing

### **Next Steps**
1. Choose payment gateway (Razorpay, Stripe, PayPal)
2. Implement withdrawal requests
3. Admin approval workflow
4. Payment history tracking
5. Email notifications for payments

---

## 📝 **TODO List**

### **High Priority**
- [ ] Implement actual task submission to database
- [ ] Upload audio/images to cloud storage
- [ ] Update user earnings after task completion
- [ ] Add payment withdrawal system
- [ ] Implement admin task approval workflow

### **Medium Priority**
- [ ] Add task filtering and search
- [ ] Implement user dashboard analytics
- [ ] Add email notifications
- [ ] Create admin analytics dashboard
- [ ] Add user feedback system

### **Low Priority**
- [ ] Add dark mode toggle persistence
- [ ] Implement task categories
- [ ] Add user achievements/badges
- [ ] Create referral system
- [ ] Add multi-language support

---

## 🐛 **Known Issues**

1. **Audio playback sometimes fails on first attempt**
   - Workaround: Click play again
   - Root cause: Browser autoplay policies

2. **Camera permission not persisting**
   - Workaround: Grant permission each time
   - Root cause: Browser security settings

3. **Tasks not persisting after page refresh**
   - Workaround: Tasks reload from backend
   - Root cause: No local caching

---

## 📚 **Learning Resources**

### **React**
- [React Docs](https://react.dev)
- [TypeScript + React](https://react-typescript-cheatsheet.netlify.app)

### **Supabase**
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

### **Web APIs**
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 🤝 **Contributing**

### **Code Style**
- Use TypeScript for type safety
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions small and focused

### **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

---

## 📞 **Support**

If you have questions or need help:
1. Check the documentation files in this project
2. Review the code comments in `App.tsx` and `TaskExecution.tsx`
3. Check the console for error messages
4. Review Supabase dashboard for database issues

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0  
**Status:** ✅ Development Complete, Ready for Production Features
