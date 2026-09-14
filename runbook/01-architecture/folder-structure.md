# Folder Structure

> Last Updated: 2026-09-14

## Complete Project Tree

```
Starset_contributer/
│
├── .git/                              # Git repository data
├── .gitignore                         # Git ignore rules
├── GEMINI.md                          # AI assistant rules (no auto git push)
├── README.md                          # Project README
├── package-lock.json                  # Root lockfile
│
├── client/                            # ═══ FRONTEND APPLICATION ═══
│   │
│   ├── index.html                     # SPA entry point (HTML shell)
│   ├── index.tsx                      # React mount point (createRoot)
│   ├── index.css                      # 🎨 DESIGN SYSTEM — all tokens + utility classes
│   ├── App.tsx                        # Main app — all routes, layout wrappers
│   ├── types.ts                       # Global TypeScript types & enums
│   ├── supabaseClient.ts             # Supabase client initialization
│   ├── metadata.json                  # App metadata (name, permissions)
│   │
│   ├── .env.example                   # Template for client env variables
│   ├── package.json                   # Client dependencies
│   ├── package-lock.json              # Client lockfile
│   ├── tsconfig.json                  # TypeScript compiler config
│   ├── vite.config.ts                 # Vite build configuration
│   ├── tailwind.config.js             # Tailwind config (for shadcn/ui compat)
│   ├── vite-env.d.ts                  # Vite type declarations
│   ├── components.json                # shadcn/ui + MagicUI component registry
│   ├── vercel.json                    # Vercel deployment config (SPA rewrites)
│   │
│   ├── components/                    # ═══ REUSABLE COMPONENTS ═══
│   │   │
│   │   │  ── Layout & Navigation ──
│   │   ├── PublicLayout.tsx           # Public page shell (nav + footer)
│   │   ├── Sidebar.tsx                # Authenticated app sidebar navigation
│   │   ├── AuthLayout.tsx             # Auth pages layout (login/signup wrapper)
│   │   ├── Logo.tsx                   # Starset logo component
│   │   ├── Footer.tsx                 # Site-wide footer
│   │   ├── ThemeToggle.tsx            # Light/dark mode toggle
│   │   ├── CookieConsent.tsx          # Cookie consent banner
│   │   ├── SEOHead.tsx                # Dynamic <head> meta tags
│   │   │
│   │   │  ── Landing Page Sections ──
│   │   ├── HeroSignal.tsx             # Landing page hero section
│   │   ├── SignalMorph.tsx            # Animated signal visualization
│   │   ├── Story.tsx                  # Company story section
│   │   ├── ContributorJourney.tsx     # How-it-works steps
│   │   ├── Pipeline.tsx               # Data pipeline visualization
│   │   ├── DatasetExplorer.tsx        # Interactive dataset browser
│   │   ├── DatasetPreview.tsx         # Dataset card previews
│   │   ├── Configurator.tsx           # Task configurator demo
│   │   ├── CTASection.tsx             # Call-to-action section
│   │   ├── FAQ.tsx                    # Frequently asked questions
│   │   ├── PageHero.tsx               # Reusable page hero banner
│   │   │
│   │   │  ── Animation & Effects ──
│   │   ├── AnimationProvider.tsx      # GSAP/Framer Motion context
│   │   ├── AudioVisualizer.tsx        # Real-time audio waveform
│   │   ├── Waveform.tsx              # Static waveform display
│   │   ├── PixelTransition.tsx        # Pixel dissolve transition effect
│   │   ├── Reveal.tsx                 # Scroll-reveal wrapper
│   │   ├── SplitText.jsx             # Character-by-character text animation
│   │   ├── ShapeGrid.jsx             # Animated background grid
│   │   ├── ShapeGrid.css             # ShapeGrid styles
│   │   │
│   │   │  ── Primitives ──
│   │   ├── Button.tsx                 # Design system button
│   │   │
│   │   └── ui/                        # shadcn/ui primitives
│   │       ├── Layout.tsx             # shadcn layout wrapper
│   │       └── smooth-cursor.tsx      # Custom cursor component
│   │
│   ├── pages/                         # ═══ PAGE COMPONENTS ═══
│   │   │
│   │   │  ── Public Pages ──
│   │   ├── LandingPage.tsx            # Homepage
│   │   ├── About.tsx                  # About Starset
│   │   ├── Blog.tsx                   # Blog/news listing
│   │   ├── Careers.tsx                # Job openings
│   │   ├── CompanyProfile.tsx         # Company information
│   │   ├── Contact.tsx                # Contact form
│   │   ├── DatasetLandingPage.tsx     # Dataset marketplace landing
│   │   ├── AITrainingGuide.tsx        # AI training guide content
│   │   │
│   │   │  ── Legal Pages ──
│   │   ├── Legal.tsx                  # Legal hub
│   │   ├── PrivacyPolicy.tsx          # Privacy policy
│   │   ├── TermsOfService.tsx         # Terms of service
│   │   ├── CookiePolicy.tsx           # Cookie policy
│   │   ├── AcceptableUse.tsx          # Acceptable use policy
│   │   │
│   │   │  ── Auth Pages ──
│   │   ├── Login.tsx                  # Login page
│   │   ├── Signup.tsx                 # Registration page
│   │   ├── ForgotPassword.tsx         # Password reset request
│   │   ├── ResetPassword.tsx          # Password reset form
│   │   ├── CompleteProfile.tsx        # Post-signup profile completion
│   │   │
│   │   │  ── Contributor Pages ──
│   │   ├── Dashboard.tsx              # Contributor dashboard
│   │   ├── TaskList.tsx               # Available tasks listing
│   │   ├── TaskExecution.tsx          # Task execution interface (49KB — largest)
│   │   ├── Earnings.tsx               # Earnings & transaction history
│   │   ├── Marketplace.tsx            # Task marketplace
│   │   │
│   │   │  ── Admin Pages ──
│   │   ├── AdminDashboard.tsx         # Admin analytics dashboard
│   │   ├── AdminCreateTask.tsx        # Task creation form
│   │   └── AdminSubmissions.tsx       # Submission review interface
│   │
│   ├── context/                       # ═══ REACT CONTEXT ═══
│   │   ├── AuthContext.jsx            # Authentication state provider
│   │   └── ThemeContext.tsx           # Light/dark theme provider
│   │
│   ├── config/                        # ═══ CONFIGURATION ═══
│   │   └── api.ts                     # API endpoint registry & base URL logic
│   │
│   ├── data/                          # ═══ STATIC DATA ═══
│   │   ├── jobs.ts                    # Career listings data
│   │   ├── datasets.ts               # Dataset catalog data
│   │   ├── datasetLandings.ts         # Dataset landing page content
│   │   └── languages.ts              # Supported languages list
│   │
│   ├── hooks/                         # ═══ CUSTOM HOOKS ═══
│   │   └── useScroll.ts              # Scroll position & direction tracking
│   │
│   ├── lib/                           # ═══ UTILITIES ═══
│   │   ├── api.ts                     # HTTP helper (fetch wrapper)
│   │   └── utils.ts                   # General utilities (cn, etc.)
│   │
│   ├── public/                        # ═══ STATIC ASSETS ═══
│   │   ├── robots.txt                 # Search engine crawl rules
│   │   └── manifest.json             # PWA manifest
│   │
│   └── dist/                          # Build output (gitignored)
│
└── server/                            # ═══ BACKEND API ═══
    │
    ├── package.json                   # Server dependencies
    ├── package-lock.json              # Server lockfile
    ├── tsconfig.json                  # Server TypeScript config
    │
    └── src/
        ├── server.ts                  # Entry point (listen on PORT)
        ├── app.ts                     # Express app setup (middleware + routes)
        │
        ├── routes/                    # ═══ API ROUTES ═══
        │   ├── admin.tasks.ts         # POST/DELETE /admin/tasks
        │   ├── admin.stats.ts         # GET /admin/stats
        │   ├── admin.submissions.ts   # GET/PUT /admin/submissions
        │   ├── admin.export.ts        # GET /admin/export/:taskId
        │   ├── contributor.tasks.ts   # GET /contributor/tasks
        │   ├── submissions.ts         # POST /submissions/{audio|image|text|playlist}
        │   ├── user.submissions.ts    # GET /user/submissions/:userId
        │   └── user.stats.ts          # GET /user/stats/:userId
        │
        ├── db/                        # ═══ DATABASE ═══
        │   └── supabase.ts            # Supabase service-role client
        │
        ├── middleware/                # ═══ MIDDLEWARE ═══
        │   └── requireAuth.ts         # JWT verification + role check
        │
        └── utils/                     # ═══ SERVER UTILITIES ═══
            └── (helpers)
```

## File Size Hotspots

> 💡 These are the largest files — prime candidates for refactoring:

| File | Size | Notes |
|------|------|-------|
| `client/App.tsx` | 45KB | All routes defined here — consider route splitting |
| `client/index.css` | 40KB | Full design system — intentionally large |
| `client/pages/TaskExecution.tsx` | 49KB | Multi-type task executor — consider splitting by task type |
| `server/src/routes/submissions.ts` | 26KB | All submission types — consider splitting per type |
| `client/pages/AdminSubmissions.tsx` | 23KB | Complex review UI |
| `client/pages/Marketplace.tsx` | 21KB | Task marketplace with filters |
| `client/components/PublicLayout.tsx` | 19KB | Public layout with responsive nav |
