# Component Inventory

> Last Updated: 2026-09-14

## Layout Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| **PublicLayout** | `components/PublicLayout.tsx` | `children` | Full public page shell: responsive navbar + footer |
| **AuthLayout** | `components/AuthLayout.tsx` | `children` | Auth pages wrapper with branding sidebar |
| **Sidebar** | `components/Sidebar.tsx` | Navigation state | Authenticated app sidebar navigation |
| **Footer** | `components/Footer.tsx` | — | Site-wide footer with links and branding |
| **Logo** | `components/Logo.tsx` | `size?, className?` | Starset brand logo (SVG) |
| **SEOHead** | `components/SEOHead.tsx` | `title, description, path?` | Dynamic `<head>` meta tag management |

## Interactive Components

| Component | File | Description |
|-----------|------|-------------|
| **Button** | `components/Button.tsx` | Design system button with variants |
| **ThemeToggle** | `components/ThemeToggle.tsx` | Light/dark mode toggle switch |
| **CookieConsent** | `components/CookieConsent.tsx` | GDPR cookie consent banner |

## Landing Page Sections

| Component | File | Description |
|-----------|------|-------------|
| **HeroSignal** | `components/HeroSignal.tsx` | Hero section with animated signal visualization |
| **SignalMorph** | `components/SignalMorph.tsx` | Animated morphing signal graphic |
| **Story** | `components/Story.tsx` | Company story/mission narrative section |
| **ContributorJourney** | `components/ContributorJourney.tsx` | How-it-works step-by-step flow |
| **Pipeline** | `components/Pipeline.tsx` | Data pipeline visualization |
| **DatasetExplorer** | `components/DatasetExplorer.tsx` | Interactive dataset browser |
| **DatasetPreview** | `components/DatasetPreview.tsx` | Dataset card preview components |
| **Configurator** | `components/Configurator.tsx` | Interactive task configurator demo |
| **CTASection** | `components/CTASection.tsx` | Call-to-action section |
| **FAQ** | `components/FAQ.tsx` | Accordion FAQ section |
| **PageHero** | `components/PageHero.tsx` | Reusable hero banner for sub-pages |

## Animation Components

| Component | File | Technology | Description |
|-----------|------|-----------|-------------|
| **AnimationProvider** | `components/AnimationProvider.tsx` | GSAP | Shared GSAP context + cleanup |
| **AudioVisualizer** | `components/AudioVisualizer.tsx` | Canvas API | Real-time audio waveform rendering |
| **Waveform** | `components/Waveform.tsx` | SVG | Static waveform visualization |
| **PixelTransition** | `components/PixelTransition.tsx` | Canvas/GSAP | Pixel dissolve transition effect |
| **Reveal** | `components/Reveal.tsx` | Framer Motion | Scroll-triggered reveal wrapper |
| **SplitText** | `components/SplitText.jsx` | GSAP | Character-by-character text animation |
| **ShapeGrid** | `components/ShapeGrid.jsx` | CSS/GSAP | Animated background pattern |

## shadcn/ui Primitives

| Component | File | Description |
|-----------|------|-------------|
| **Layout** | `components/ui/Layout.tsx` | shadcn layout wrapper |
| **SmoothCursor** | `components/ui/smooth-cursor.tsx` | Custom cursor component |

## Context Providers

| Provider | File | State Managed |
|----------|------|--------------|
| **AuthContext** | `context/AuthContext.jsx` | User auth state, session, login/logout |
| **ThemeContext** | `context/ThemeContext.tsx` | Light/dark theme, localStorage persistence |

## Custom Hooks

| Hook | File | Returns |
|------|------|---------|
| **useScroll** | `hooks/useScroll.ts` | Scroll position, direction, section visibility |

## Page Components (26 total)

### Public Pages (8)
`LandingPage`, `About`, `Blog`, `Careers`, `CompanyProfile`, `Contact`, `DatasetLandingPage`, `AITrainingGuide`

### Legal Pages (5)
`Legal`, `PrivacyPolicy`, `TermsOfService`, `CookiePolicy`, `AcceptableUse`

### Auth Pages (4)
`Login`, `Signup`, `ForgotPassword`, `ResetPassword`, `CompleteProfile`

### Contributor Pages (5)
`Dashboard`, `TaskList`, `TaskExecution`, `Earnings`, `Marketplace`

### Admin Pages (3)
`AdminDashboard`, `AdminCreateTask`, `AdminSubmissions`
