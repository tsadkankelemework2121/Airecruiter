// Candidate Ranking Algorithm - Rank candidates based on multiple factors
import type { SkillMatchResult, ParsedResume, CandidateScore, JobRequirements } from "./types";

// Re-export types for convenience
export type { CandidateScore } from "./types";

// Alias for clarity
export interface JobDetails extends JobRequirements {}

export interface CandidateData {
  candidateId: string;
  applicationId: string;
  resume: ParsedResume;
  skillMatch: SkillMatchResult;
}

// Re-export SkillMatchResult type for convenience
export type { SkillMatchResult } from "./types";

/**
 * Rank candidates for a job position
 */
export function rankCandidates(
  candidates: CandidateData[],
  jobDetails: JobDetails
): CandidateScore[] {
  const scores: CandidateScore[] = candidates.map(candidate => {
    // Calculate individual scores
    const skillMatchScore = candidate.skillMatch.score;
    const experienceScore = calculateExperienceScore(candidate.resume, jobDetails);
    const educationScore = calculateEducationScore(candidate.resume, jobDetails);
    
    // Calculate weighted overall score
    // Skills: 50%, Experience: 30%, Education: 20%
    const overallScore = Math.round(
      skillMatchScore * 0.5 +
      experienceScore * 0.3 +
      educationScore * 0.2
    );
    
    // Calculate match percentage (normalized to 0-100)
    const matchPercentage = Math.min(100, Math.max(0, overallScore));
    
    // Determine strengths and weaknesses
    const strengths = identifyStrengths(candidate.resume, candidate.skillMatch, jobDetails);
    const weaknesses = identifyWeaknesses(candidate.resume, candidate.skillMatch, jobDetails);
    
    // Generate justification
    const justification = generateJustification(
      overallScore,
      skillMatchScore,
      experienceScore,
      educationScore,
      strengths,
      weaknesses
    );
    
    return {
      candidateId: candidate.candidateId,
      applicationId: candidate.applicationId,
      overallScore,
      skillMatchScore,
      experienceScore,
      educationScore,
      matchPercentage,
      rank: 0, // Will be set after sorting
      skillMatch: candidate.skillMatch,
      justification,
      strengths,
      weaknesses
    };
  });
  
  // Sort by overall score (descending)
  scores.sort((a, b) => b.overallScore - a.overallScore);
  
  // Assign ranks
  scores.forEach((score, index) => {
    score.rank = index + 1;
  });
  
  return scores;
}

/**
 * Calculate experience score based on job requirements
 */
function calculateExperienceScore(
  resume: ParsedResume,
  jobDetails: JobDetails
): number {
  const experienceText = resume.experience.toLowerCase();
  const jobDescription = jobDetails.description.toLowerCase();
  
  // Extract years of experience from resume
  const yearsMatch = experienceText.match(/(\d+)\s*(?:years?|yrs?)/i);
  const candidateYears = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  
  // Extract required years from job description
  const requiredYearsMatch = jobDetails.experience?.match(/(\d+)\s*(?:years?|yrs?|\+)/i);
  const requiredYears = requiredYearsMatch ? parseInt(requiredYearsMatch[1]) : 0;
  
  // Score based on years match
  let score = 50; // Base score
  
  if (requiredYears === 0) {
    score = 70; // No specific requirement, give decent score
  } else if (candidateYears >= requiredYears) {
    score = Math.min(100, 70 + (candidateYears - requiredYears) * 5);
  } else {
    score = Math.max(20, 70 - (requiredYears - candidateYears) * 10);
  }
  
  // Bonus for relevant work history
  const relevantHistoryCount = resume.workHistory.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(jobDetails.title.toLowerCase().split(" ")[0]);
    const descriptionMatch = item.description?.toLowerCase().includes(jobDetails.description.substring(0, 20).toLowerCase());
    return titleMatch || descriptionMatch;
  }).length;
  
  score = Math.min(100, score + (relevantHistoryCount * 10));
  
  return Math.round(score);
}

/**
 * Calculate education score
 */
function calculateEducationScore(
  resume: ParsedResume,
  jobDetails: JobDetails
): number {
  const educationText = resume.education.toLowerCase();
  const jobEducation = jobDetails.education?.toLowerCase() || "";
  
  let score = 50; // Base score
  
  // Check for degree matches
  const degreeLevels = ["phd", "doctorate", "master", "mba", "bachelor", "degree"];
  const resumeDegrees = degreeLevels.filter(degree => educationText.includes(degree));
  const jobDegrees = degreeLevels.filter(degree => jobEducation.includes(degree));
  
  if (jobDegrees.length === 0) {
    score = 70; // No specific requirement
  } else if (resumeDegrees.length > 0) {
    // Check if candidate has required level or higher
    const degreeHierarchy = ["bachelor", "master", "mba", "phd", "doctorate"];
    const highestResumeDegree = resumeDegrees.reduce((highest, degree) => {
      const resumeIndex = degreeHierarchy.findIndex(d => degree.includes(d));
      const highestIndex = degreeHierarchy.findIndex(d => highest.includes(d));
      return resumeIndex > highestIndex ? degree : highest;
    }, "bachelor");
    
    const highestJobDegree = jobDegrees.reduce((highest, degree) => {
      const jobIndex = degreeHierarchy.findIndex(d => degree.includes(d));
      const highestIndex = degreeHierarchy.findIndex(d => highest.includes(d));
      return jobIndex > highestIndex ? degree : highest;
    }, "bachelor");
    
    const resumeIndex = degreeHierarchy.findIndex(d => highestResumeDegree.includes(d));
    const jobIndex = degreeHierarchy.findIndex(d => highestJobDegree.includes(d));
    
    if (resumeIndex >= jobIndex) {
      score = Math.min(100, 80 + (resumeIndex - jobIndex) * 5);
    } else {
      score = Math.max(30, 80 - (jobIndex - resumeIndex) * 15);
    }
  } else {
    score = 40; // No matching degree found
  }
  
  // Bonus for certifications
  if (resume.certifications.length > 0) {
    score = Math.min(100, score + 10);
  }
  
  return Math.round(score);
}

/**
 * Identify candidate strengths
 */
function identifyStrengths(
  resume: ParsedResume,
  skillMatch: SkillMatchResult,
  jobDetails: JobDetails
): string[] {
  const strengths: string[] = [];
  
  // Strong skill match
  if (skillMatch.score >= 80) {
    strengths.push("Excellent skill alignment with job requirements");
  }
  
  // Many matched skills
  if (skillMatch.matchedSkills.length >= 5) {
    strengths.push(`Strong in ${skillMatch.matchedSkills.length} required skills`);
  }
  
  // Relevant work experience
  if (resume.workHistory.length >= 3) {
    strengths.push("Extensive relevant work experience");
  }
  
  // Certifications
  if (resume.certifications.length > 0) {
    strengths.push(`Has ${resume.certifications.length} relevant certification(s)`);
  }
  
  // Good summary
  if (resume.summary.length > 200) {
    strengths.push("Comprehensive professional profile");
  }
  
  // High match percentage
  if (skillMatch.score >= 90) {
    strengths.push("Near-perfect match for position");
  }
  
  return strengths.slice(0, 5); // Limit to top 5
}

/**
 * Identify candidate weaknesses
 */
function identifyWeaknesses(
  resume: ParsedResume,
  skillMatch: SkillMatchResult,
  jobDetails: JobDetails
): string[] {
  const weaknesses: string[] = [];
  
  // Missing skills
  if (skillMatch.missingSkills.length > 0) {
    weaknesses.push(`Missing ${skillMatch.missingSkills.length} key skill(s): ${skillMatch.missingSkills.slice(0, 3).join(", ")}`);
  }
  
  // Low skill match
  if (skillMatch.score < 50) {
    weaknesses.push("Limited alignment with required skills");
  }
  
  // Limited experience
  if (resume.workHistory.length < 2) {
    weaknesses.push("Limited work experience");
  }
  
  // Short summary
  if (resume.summary.length < 100) {
    weaknesses.push("Brief professional summary");
  }
  
  // No certifications when job might require
  if (resume.certifications.length === 0 && jobDetails.description.toLowerCase().includes("certified")) {
    weaknesses.push("No relevant certifications listed");
  }
  
  return weaknesses.slice(0, 5); // Limit to top 5
}

/**
 * Generate justification for candidate score
 */
function generateJustification(
  overallScore: number,
  skillScore: number,
  experienceScore: number,
  educationScore: number,
  strengths: string[],
  weaknesses: string[]
): string {
  let justification = `Overall match score: ${overallScore}/100. `;
  
  justification += `Skill match: ${skillScore}/100, Experience: ${experienceScore}/100, Education: ${educationScore}/100. `;
  
  if (strengths.length > 0) {
    justification += `Strengths: ${strengths.slice(0, 2).join("; ")}. `;
  }
  
  if (weaknesses.length > 0 && overallScore < 70) {
    justification += `Areas for improvement: ${weaknesses.slice(0, 2).join("; ")}.`;
  }
  
  if (overallScore >= 80) {
    justification += "Highly recommended candidate.";
  } else if (overallScore >= 60) {
    justification += "Good candidate with potential.";
  } else if (overallScore >= 40) {
    justification += "Moderate match, may require additional training.";
  } else {
    justification += "Limited match, consider for future opportunities.";
  }
  
  return justification;
}

/**
 * Get ranking statistics
 */
export function getRankingStats(scores: CandidateScore[]): {
  totalCandidates: number;
  averageScore: number;
  topScore: number;
  lowestScore: number;
} {
  if (scores.length === 0) {
    return {
      totalCandidates: 0,
      averageScore: 0,
      topScore: 0,
      lowestScore: 0
    };
  }
  
  const totalScore = scores.reduce((sum, s) => sum + s.overallScore, 0);
  const averageScore = Math.round(totalScore / scores.length);
  const topScore = Math.max(...scores.map(s => s.overallScore));
  const lowestScore = Math.min(...scores.map(s => s.overallScore));
  
  return {
    totalCandidates: scores.length,
    averageScore,
    topScore,
    lowestScore
  };
}

