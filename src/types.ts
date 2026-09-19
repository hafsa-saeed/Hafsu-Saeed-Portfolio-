export type ProjectCategory =
  | "all"
  | "fullstack"
  | "frontend"
  | "ai"
  | "big"
  | "mini";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory; // Strict category type for error-free filtering
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
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
}

export interface EducationItem {
  id: string;
  degree: string;
  institute: string;
  year: string;
  grade: string;
  status: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number;
    icon?: string;
    description?: string;
  }[];
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
}
