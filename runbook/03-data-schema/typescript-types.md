# TypeScript Types & Enums

> Last Updated: 2026-09-14  
> Source: [`client/types.ts`](file:///e:/starset%20intelligence/Starset_contributer/client/types.ts)

## Enums

### TaskStatus

```typescript
export enum TaskStatus {
  AVAILABLE = 'Available',
  IN_PROGRESS = 'In Progress',
  VALIDATING = 'Validating',      // Submission under review
  ACCEPTED = 'Accepted',          // Approved by admin
  NOT_ACCEPTED = 'Not Accepted'   // Rejected by admin
}
```

> 💡 **Legacy names:** `VALIDATING` was formerly `PENDING_REVIEW`, `ACCEPTED` was `APPROVED`, `NOT_ACCEPTED` was `REJECTED`.

### TaskType

```typescript
export enum TaskType {
  AUDIO_COLLECTION = 'Audio Collection',
  IMAGE_COLLECTION = 'Image Collection',
  TEXT_ANNOTATION = 'Text Annotation',
  IMAGE_LABELING = 'Image Labeling',
  SURVEY = 'Evaluation',    // Was 'Survey'
  PLAYLIST = 'Playlist'
}
```

> 💡 **`SURVEY` renders as `'Evaluation'`** — this is intentional product terminology.

## Interfaces

### Task

The core data unit. Represents a single data collection task.

```typescript
export interface Task {
  id: string;
  title: string;
  type: TaskType;
  compensation: number;           // Payment per task (was 'reward')
  currency: string;               // e.g., 'USD', 'INR'
  estimatedTimeSec: number;       // Estimated completion time in seconds
  status: TaskStatus;
  language: string;               // Target language for the task
  instructions: string;           // Markdown instructions for the contributor
  deadline?: string;              // ISO date string
  imageUrl?: string;              // Reference image for the task

  // AI Infrastructure Context
  aiCapability: string;           // What AI model this data trains
  dataUsage: string;              // Consent scope / data usage description

  // Execution Content
  prompt: string;                 // The actual prompt/question for the task
  options?: string[];             // For survey/evaluation tasks

  // Project Context
  project: string;                // Parent project/campaign name
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  requirements?: string[];        // e.g., ["Headphones", "Outdoor", "No Glasses"]
  submissionCount?: number;       // Current submissions (max 100)
}
```

### Transaction

Represents a payment/earning event.

```typescript
export interface Transaction {
  id: string;
  date: string;                   // ISO date string
  amount: number;                 // Payment amount
  currency: string;               // Currency code
  description: string;            // Human-readable description
  status: 'Pending' | 'Processed' | 'Failed';  // 'Processed' replaces old 'Paid'
}
```

### UserProfile

The contributor's profile.

```typescript
export interface UserProfile {
  id: string;                     // Supabase auth user ID
  contributor_id?: number;        // Numeric contributor ID (auto-assigned)
  name: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  languages: {
    language: string;
    proficiency: 'Native' | 'Fluent' | 'Basic';
  }[];
  devices: string[];              // e.g., ["Android", "iOS", "Desktop"]
  balance: number;                // Current earnings balance
  completedTasks: number;         // Total completed task count
  joinDate: string;               // ISO date string
}
```

### PageView (Route Type)

Union type for all authenticated page routes.

```typescript
export type PageView =
  | 'dashboard'
  | 'tasks'
  | 'execution'
  | 'earnings'
  | 'account'
  | 'support'
  | 'guidelines'
  | 'admin-dashboard'
  | 'admin-create-task'
  | 'admin-submissions'
  | 'complete-profile';
```

### UserRole

```typescript
export type UserRole = 'contributor' | 'admin';
```

## Type Relationships

```
UserProfile (1) ──→ (∞) Task         [contributor executes tasks]
Task (1) ──→ (∞) Submission          [task receives submissions]
Submission (1) ──→ (0..1) Transaction [approved submission → payment]
UserProfile (1) ──→ (∞) Transaction  [user's earning history]
```

## Static Data Types

Located in `client/data/`:

| File | Export | Type |
|------|--------|------|
| `jobs.ts` | `jobs` | Career listing objects |
| `datasets.ts` | `datasets` | Dataset catalog entries |
| `datasetLandings.ts` | `datasetLandings` | Landing page content for datasets |
| `languages.ts` | `languages` | Supported language list |
