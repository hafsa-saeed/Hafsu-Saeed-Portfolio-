export type ProjectCategory =
  | "all"
  | "fullstack"
  | "frontend"
  | "ai"
  | "big"
  | "mini";

export interface ProjectMedia {
  id: string;
  projectId: string;
  mediaType: "hero" | "screenshot" | "video" | "document";
  url: string;
  r2Key?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  displayOrder: number;
  caption?: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  image: string; // Featured cover photo
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
  // 👇 Showcase Fields
  videoUrl?: string; // Direct video file (mp4/webm/mov from R2 or local) or embed link
  screenshots?: string[]; // Multiple screenshot images
  featured?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectItem = Project;

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  type: string;
  description: string;
  keyResponsibilities: string[];
  technologies: string[];
  iconName: string;
  displayOrder?: number;
}

export interface EducationItem {
  id: string;
  degree: string;
  institute: string;
  year: string;
  grade: string;
  status: string;
  semester?: string; // e.g. "6th Semester Continue"
  cgpa?: string; // e.g. "3.71"
  highlights: string[];
  description?: string;
  displayOrder?: number;
}

export interface SkillItem {
  id?: string;
  name: string;
  level: number;
  icon?: string;
  description?: string;
  displayOrder?: number;
}

export interface SkillCategory {
  id?: string;
  category: string;
  skills: SkillItem[];
  displayOrder?: number;
}

export interface CircularSkill {
  name: string;
  percentage: number;
  category: string;
  color: string;
}

export interface HobbyItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  tag: string;
}

export interface CredentialItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  skillsLearned: string[];
  category: string;
  imageThumbnail: string;
  fileUrl?: string; // High-res document or PDF in R2
  displayOrder?: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  category: "cv" | "transcript" | "certificate" | "other";
  fileUrl: string;
  r2Key?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  isActiveCv?: boolean;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  deliveredViaSmtp?: boolean;
  createdAt: string;
}

export interface PersonalInfo {
  name: string;
  titles: string[];
  bio: string;
  quote: string;
  quoteAuthor: string;
  email: string;
  phone1: string;
  phone2: string;
  location: string;
  age: string;
  gender: string;
  religion: string;
  nationality: string;
  maritalStatus: string;
  profileImage: string;
  resumeUrl: string;
  languages: { name: string; level: string }[];
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
    whatsapp: string;
    [key: string]: string;
  };
  stats: {
    label: string;
    value: string;
    suffix: string;
    desc: string;
  }[];
  goals: string[];
}
