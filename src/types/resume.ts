export interface ResumeLocation {
  full: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
}

export interface ResumeProfiles {
  linkedin: string | null;
  github: string | null;
  website: string | null;
  twitter: string | null;
  stackoverflow: string | null;
  kaggle: string | null;
  behance: string | null;
  dribbble: string | null;
  medium: string | null;
}

export interface ResumeContact {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  alternatePhone: string | null;
  location: ResumeLocation;
  profiles: ResumeProfiles;
}

export interface SkillsByCategory {
  languages: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  devops: string[];
  aiMl: string[];
  testing: string[];
  tools: string[];
  other: string[];
}

export interface ResumeSkills {
  all: string[];
  byCategory: SkillsByCategory;
}

export interface ResumeExperience {
  title: string;
  company: string;
  employmentType: string | null;
  location: string | null;
  remote: boolean;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  durationMonths: number | null;
  durationFormatted: string | null;
  description: string | null;
  highlights: string[];
  technologiesMentioned: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  durationYears: number | null;
  gpa: string | null;
  maxGpa: string | null;
  honors: string | null;
  courses: string[];
  activities: string[];
}

export interface ResumeCertification {
  name: string;
  issuer: string | null;
  issueYear: string | null;
  expiryDate: string | null;
  credentialId: string | null;
  url: string | null;
}

export interface ResumeProject {
  name: string;
  description: string | null;
  role: 'personal' | 'team' | 'open-source' | null;
  technologies: string[];
  url: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  highlights: string[];
}

export interface ResumeLanguage {
  language: string;
  proficiency: string | null;
}

export interface ResumeAward {
  title: string;
  issuer: string | null;
  date: string | null;
  description: string | null;
}

export interface ParsedResume {
  meta: {
    parsedAt: string;
    parserVersion: string;
    sourceFile: {
      originalName: string;
      mimeType: string;
      sizeBytes: number;
    };
    sectionsDetected: string[];
    wordCount: number;
    confidence: number;
  };
  contact: ResumeContact;
  headline: string | null;
  summary: string | null;
  totalExperienceYears: number | null;
  skills: ResumeSkills;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  projects: ResumeProject[];
  awards: ResumeAward[];
  languages: ResumeLanguage[];
  rawText?: string;
}
