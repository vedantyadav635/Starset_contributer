
export enum TaskStatus {
  AVAILABLE = 'Available',
  IN_PROGRESS = 'In Progress',
  VALIDATING = 'Validating', // Was PENDING_REVIEW
  ACCEPTED = 'Accepted',     // Was APPROVED
  NOT_ACCEPTED = 'Not Accepted' // Was REJECTED
}

export enum TaskType {
  AUDIO_COLLECTION = 'Audio Collection',
  IMAGE_COLLECTION = 'Image Collection',
  TEXT_ANNOTATION = 'Text Annotation',
  IMAGE_LABELING = 'Image Labeling',
  SURVEY = 'Evaluation' // Was Survey
}

export type UserRole = 'contributor' | 'admin';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  compensation: number; // Was reward
  currency: string;
  estimatedTimeMin: number;
  status: TaskStatus;
  language: string;
  instructions: string;
  deadline?: string;
  imageUrl?: string;
  // Infrastructure Context
  aiCapability: string; // What AI model this trains
  dataUsage: string; // Consent scope
  // Content for execution
  prompt: string; 
  options?: string[];
  // New Project Fields
  project: string; // The parent project/campaign name
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  requirements?: string[]; // e.g. "Headphones", "Outdoor", "No Glasses"
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  status: 'Pending' | 'Processed' | 'Failed'; // Processed instead of Paid
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  languages: { language: string; proficiency: 'Native' | 'Fluent' | 'Basic' }[];
  devices: string[];
  balance: number;
  completedTasks: number;
  joinDate: string;
}

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
  | "complete-profile";
