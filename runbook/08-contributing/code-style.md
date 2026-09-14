# Code Style Guide

> Last Updated: 2026-09-14

## Language & Framework

- **TypeScript** for all new code (`.tsx` for React components, `.ts` for utilities)
- **JSX** only for legacy files (`SplitText.jsx`, `ShapeGrid.jsx`, `AuthContext.jsx`)
- **React 19** functional components only — no class components

## Naming Conventions

### Files

| Type | Convention | Example |
|------|-----------|---------|
| React Component | PascalCase | `TaskExecution.tsx` |
| React Page | PascalCase | `AdminDashboard.tsx` |
| Utility | camelCase | `utils.ts` |
| Hook | camelCase with `use` prefix | `useScroll.ts` |
| Context | PascalCase + `Context` | `AuthContext.jsx` |
| Config | camelCase | `api.ts` |
| Data | camelCase | `datasets.ts` |
| CSS | PascalCase (component) or camelCase | `ShapeGrid.css` |
| Route file | kebab-case with dots | `admin.tasks.ts` |

### Code

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `const TaskCard = () => {}` |
| Function | camelCase | `const fetchTasks = async () => {}` |
| Variable | camelCase | `const taskList = []` |
| Constant | SCREAMING_SNAKE | `const MAX_FILE_SIZE = 50_000_000` |
| Type/Interface | PascalCase | `interface TaskProps {}` |
| Enum | PascalCase | `enum TaskStatus {}` |
| Enum Member | SCREAMING_SNAKE | `AUDIO_COLLECTION` |
| CSS Variable | kebab-case | `--signal-hover` |
| API Endpoint | SCREAMING_SNAKE | `ADMIN_TASKS` |

### Component Props

```typescript
// ✅ Named Props Interface
interface TaskCardProps {
  task: Task;
  onSelect: (taskId: string) => void;
  isActive?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, isActive = false }) => {
  // ...
};
```

## TypeScript Rules

- ❌ No `any` — use `unknown` if type is truly unknown
- ❌ No `// @ts-ignore` — fix the type instead
- ✅ Use `interface` for objects, `type` for unions/intersections
- ✅ Export types from where they're defined
- ✅ Use optional chaining (`?.`) and nullish coalescing (`??`)

## Import Order

```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. External libraries
import { motion } from 'framer-motion';
import { Mic, Camera } from 'lucide-react';

// 3. Internal modules (absolute paths)
import { Task, TaskType } from '@/types';
import { API_ENDPOINTS } from '@/config/api';

// 4. Components
import { Button } from '@/components/Button';
import { PageHero } from '@/components/PageHero';

// 5. Hooks & utils
import { useScroll } from '@/hooks/useScroll';
import { cn } from '@/lib/utils';

// 6. Styles (rare — most styling is Tailwind)
import './ShapeGrid.css';
```

## Component Structure

```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Helper functions (if small)
// 5. Component
//    a. Hooks (useState, useEffect, custom)
//    b. Derived state / computed values
//    c. Event handlers
//    d. Effects
//    e. Render
// 6. Export
```

## CSS/Tailwind Rules

- ✅ Use design system tokens (never raw hex values)
- ✅ Use `cn()` for conditional classes
- ✅ Prefer Tailwind utilities over custom CSS
- ✅ Use `@theme inline` bridge for custom token utilities
- ❌ No inline styles unless for dynamic values (e.g., `style={{ width: `${progress}%` }}`)

## Formatting

| Setting | Value |
|---------|-------|
| Indent | 2 spaces |
| Semicolons | Yes (TypeScript default) |
| Quotes | Double for JSX, single for imports |
| Trailing commas | ES5 (arrays, objects) |
| Line length | 100 chars (soft limit) |
| End of line | LF |
