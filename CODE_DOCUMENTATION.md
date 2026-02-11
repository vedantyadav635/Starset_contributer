# Code Documentation Summary

## 📚 **Comprehensive Comments Added to Codebase**

This document summarizes all the comments and documentation added to help you understand the code better.

---

## ✅ **App.tsx - Main Application File**

### **1. Imports Section**
- ✅ Organized imports with clear categories:
  - React core imports
  - Component imports (UI building blocks)
  - Type definitions
  - Icon library
  - Custom components and utilities

### **2. Constants**
- ✅ `INACTIVITY_LIMIT_MS` - Auto-logout timer (15 minutes)

### **3. State Management**
Documented all state variables with inline comments:

**Navigation State:**
- `viewMode` - Controls public vs authenticated app view
- `authMode` - Which auth form to show (login/signup)
- `publicPage` - Current public page (home, about, etc.)
- `isAuthenticated` - User login status
- `userRole` - User's role (contributor or admin)
- `currentPage` - Current page in authenticated app
- `isMobileNavOpen` - Mobile navigation menu state
- `activeTask` - Currently selected task for execution
- `userProfile` - User profile data from database

**Global Data State:**
- `tasks` - Array of all tasks loaded from backend

**Theme State:**
- `isDark` - Dark mode enabled/disabled

### **4. Side Effects (useEffect hooks)**

**EFFECT 1: Fetch Tasks**
```typescript
// Runs once when app loads (empty dependency array [])
// Loads tasks from Express backend API
useEffect(() => {
  const fetchTasks = async () => {
    // Call backend API to get all tasks
    const res = await fetch("http://localhost:3000/admin/tasks");
    // ... handle response
  };
  fetchTasks();
}, []); // Empty array = run once on mount
```

**EFFECT 2: Apply Theme**
```typescript
// Runs whenever isDark changes
// Adds or removes 'dark' class from HTML element for Tailwind CSS
useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark'); // Enable dark mode
  } else {
    document.documentElement.classList.remove('dark'); // Enable light mode
  }
}, [isDark]); // Re-run when isDark changes
```

**EFFECT 3: Auto-logout Security**
```typescript
// Logs out user after 15 minutes of no activity
// Monitors mouse, keyboard, click, and scroll events
useEffect(() => {
  if (!isAuthenticated) return; // Only run if user is logged in
  
  const resetTimer = () => {
    // Reset inactivity timer on user activity
  };
  
  // Add event listeners for user activity
  window.addEventListener('mousemove', resetTimer);
  // ... more event listeners
}, [isAuthenticated]);
```

### **5. Handler Functions**

**Navigation & Authentication:**

- **`toggleTheme()`** - Toggle between dark and light theme
- **`handleEnterApp()`** - Navigate to login page from landing page
- **`handleStartSignup()`** - Navigate to signup page from landing page
- **`handleExitApp()`** - Exit app and return to public landing page

**`handleLogin(role: UserRole)`** - Handle user login after authentication
```
Flow:
1. Get authenticated user from Supabase
2. Fetch user profile from database
3. Set user role and authentication state
4. Redirect to appropriate page (profile completion or dashboard)
```

**Task Management:**

- **`handleLogout()`** - Clear authentication and return to landing page
- **`handleSelectTask(task)`** - Set active task and navigate to execution page
- **`handleCompleteTask()`** - Clear active task and return to task list
- **`handleCreateTask(newTask)`** - Add new task to list (Admin only)
- **`handleDeleteTask(taskId)`** - Remove task from list (Admin only)
- **`handlePublicNavigate(page)`** - Navigate between public pages with smooth scroll

---

## 🎯 **Key Concepts Explained**

### **Authentication Flow:**
1. User enters email/password on Login page
2. Supabase authenticates the user
3. App fetches user profile from database
4. If profile incomplete → redirect to CompleteProfile page
5. If profile complete → redirect to Dashboard

### **Task Execution Flow:**
1. User browses available tasks in TaskList
2. User clicks on a task → `handleSelectTask()` is called
3. App navigates to TaskExecution page
4. User completes the task (audio, image, text, etc.)
5. User submits → `handleCompleteTask()` is called
6. App returns to TaskList

### **State Management Pattern:**
- All state is managed in the main `App.tsx` component
- State is passed down to child components as props
- Child components call handler functions to update state
- This is a "lifting state up" pattern in React

### **Security Features:**
- ✅ Auto-logout after 15 minutes of inactivity
- ✅ Role-based access control (Admin vs Contributor)
- ✅ Profile completion check before allowing task access
- ✅ Supabase authentication with secure session management

---

## 📁 **File Structure**

```
App.tsx
├── Imports (React, Components, Types, Icons)
├── Constants (INACTIVITY_LIMIT_MS)
├── App Component
│   ├── State Management (Navigation, Data, Theme)
│   ├── Side Effects (useEffect hooks)
│   ├── Handler Functions (Navigation, Auth, Tasks)
│   └── Render Logic (Public Pages, Auth Pages, App Pages)
```

---

## 🔄 **Data Flow**

```
Backend (Express + Supabase)
    ↓
App.tsx (Fetch tasks on mount)
    ↓
State (tasks array)
    ↓
TaskList Component (Display tasks)
    ↓
User clicks task
    ↓
handleSelectTask() called
    ↓
State updated (activeTask set)
    ↓
TaskExecution Component (Render task)
    ↓
User completes task
    ↓
handleCompleteTask() called
    ↓
State updated (activeTask cleared)
    ↓
Back to TaskList
```

---

## 💡 **Tips for Understanding the Code**

1. **Start with State** - Look at the state variables to understand what data the app manages
2. **Follow the Flow** - Trace user actions through handler functions
3. **Check useEffect** - Understand side effects and when they run
4. **Read Comments** - All major functions have detailed comments explaining their purpose

---

## 🚀 **Next Steps for Learning**

1. **Read TaskExecution.tsx** - Understand how audio recording works
2. **Read CompleteProfile.tsx** - See how user profiles are saved
3. **Read Login.tsx** - Understand Supabase authentication
4. **Read Backend code** - See how tasks are stored and retrieved

---

**Date Created:** 2026-02-11  
**Purpose:** Help you understand the codebase better  
**Status:** ✅ Complete
