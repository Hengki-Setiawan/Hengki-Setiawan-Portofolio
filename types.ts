import { LucideIcon } from 'lucide-react';

export interface ExperienceItem {
  id: number;
  title: string;
  role: string;
  period: string;
  description: string;
  icon?: LucideIcon;
}

export interface SkillItem {
  name: string;
  level: string; // e.g., "Beginner", "Advanced"
  category: 'Tech' | 'Creative' | 'Business';
}

export interface VentureItem {
  title: string;
  role: string;
  description: string;
  link?: string;
  color: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  year: string;
}