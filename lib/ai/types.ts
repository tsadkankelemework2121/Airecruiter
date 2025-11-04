// Shared types for AI screening module
// This file contains only type definitions, no implementations
// This ensures types can be imported in client components without bundling server-side code

export interface SkillMatchResult {
  matchedSkills: string[];
  missingSkills: string[];
  score: number; // 0-100
  justification: string;
  keywordMatches: number;
  totalKeywords: number;
}

export interface ParsedResume {
  fullName?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  summary: string;
  workHistory: WorkHistoryItem[];
  certifications: string[];
  languages: string[];
  rawText: string;
}

export interface WorkHistoryItem {
  title: string;
  company: string;
  duration?: string;
  description?: string;
}

export interface JobRequirements {
  title: string;
  description: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  education?: string;
  experience?: string;
  requirements?: string;
}

export interface CandidateProfile {
  skills: string[];
  experience: string;
  education: string;
  summary: string;
}

export interface CandidateScore {
  candidateId: string;
  applicationId: string;
  overallScore: number; // 0-100
  skillMatchScore: number;
  experienceScore: number;
  educationScore: number;
  matchPercentage: number;
  rank: number;
  skillMatch: SkillMatchResult;
  justification: string;
  strengths: string[];
  weaknesses: string[];
}


