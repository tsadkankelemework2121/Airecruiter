// Skill Matcher - AI-powered skill matching using OpenAI
// This file is server-only (used only in API routes)
// OpenAI is dynamically imported to avoid client-side bundling issues

import type { SkillMatchResult, JobRequirements, CandidateProfile } from "./types";
import { getOpenAIClient } from "./openai-client";

// Use the centralized OpenAI client
async function getOpenAI() {
  return await getOpenAIClient();
}

// Types are now imported from types.ts

/**
 * Match candidate skills against job requirements using OpenAI
 */
export async function matchSkills(
  candidateProfile: CandidateProfile,
  jobRequirements: JobRequirements
): Promise<SkillMatchResult> {
  try {
    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobRequirements);
    const candidateSkills = candidateProfile.skills.map(s => s.toLowerCase());
    
    // Calculate basic keyword matches
    const keywordMatches = jobKeywords.filter(keyword => 
      candidateSkills.some(skill => skill.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(skill))
    ).length;
    
    const keywordScore = (keywordMatches / Math.max(jobKeywords.length, 1)) * 100;
    
    // Use OpenAI for advanced matching and justification
    const aiAnalysis = await analyzeMatchWithAI(candidateProfile, jobRequirements);
    
    // Calculate final score (weighted: 40% keywords, 60% AI analysis)
    const finalScore = Math.round(keywordScore * 0.4 + aiAnalysis.score * 0.6);
    
    // Determine matched and missing skills
    const matchedSkills = candidateSkills.filter(skill =>
      jobKeywords.some(keyword => 
        skill.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(skill)
      )
    );
    
    const allRequiredSkills = [
      ...(jobRequirements.requiredSkills || []),
      ...extractSkillKeywords(jobRequirements.description)
    ];
    
    const missingSkills = allRequiredSkills
      .map(s => s.toLowerCase())
      .filter(skill => 
        !candidateSkills.some(cs => 
          cs.includes(skill) || skill.includes(cs)
        )
      )
      .slice(0, 10); // Limit to top 10 missing skills
    
    return {
      matchedSkills,
      missingSkills: [...new Set(missingSkills)], // Remove duplicates
      score: Math.min(100, Math.max(0, finalScore)),
      justification: aiAnalysis.justification,
      keywordMatches,
      totalKeywords: jobKeywords.length
    };
  } catch (error) {
    console.error("Error matching skills:", error);
    
    // Fallback to basic matching if AI fails
    return basicSkillMatch(candidateProfile, jobRequirements);
  }
}

/**
 * Extract keywords from job description
 */
function extractKeywords(jobRequirements: JobRequirements): string[] {
  const text = [
    jobRequirements.title,
    jobRequirements.description,
    jobRequirements.requirements,
    jobRequirements.experience,
    ...(jobRequirements.requiredSkills || []),
    ...(jobRequirements.preferredSkills || [])
  ].filter(Boolean).join(" ").toLowerCase();
  
  // Common skill keywords
  const skillPatterns = [
    /\b(javascript|typescript|react|angular|vue|node\.?js|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin)\b/g,
    /\b(sql|mongodb|postgresql|mysql|redis|elasticsearch|dynamodb)\b/g,
    /\b(aws|azure|gcp|docker|kubernetes|jenkins|ci\/cd|terraform)\b/g,
    /\b(html|css|sass|less|bootstrap|tailwind|material-ui)\b/g,
    /\b(agile|scrum|kanban|jira|confluence)\b/g,
    /\b(machine learning|ml|ai|artificial intelligence|data science|nlp|deep learning)\b/g,
    /\b(git|github|gitlab|bitbucket|version control)\b/g,
    /\b(rest|graphql|api|microservices|serverless)\b/g,
    /\b(project management|leadership|teamwork|communication|problem solving)\b/g,
    /\b(testing|jest|mocha|cypress|selenium|tdd|unit testing)\b/g,
  ];
  
  const keywords = new Set<string>();
  
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => keywords.add(match.toLowerCase()));
    }
  });
  
  // Add manual skill extraction
  const manualSkills = extractSkillKeywords(text);
  manualSkills.forEach(skill => keywords.add(skill.toLowerCase()));
  
  return Array.from(keywords);
}

/**
 * Extract skill keywords from text
 */
function extractSkillKeywords(text: string): string[] {
  const commonSkills = [
    "javascript", "typescript", "react", "node.js", "python", "java", "c++", "c#",
    "sql", "mongodb", "postgresql", "aws", "azure", "docker", "kubernetes",
    "git", "agile", "scrum", "machine learning", "ai", "data science",
    "html", "css", "angular", "vue", "express", "django", "flask",
    "project management", "leadership", "communication", "teamwork",
    "testing", "qa", "devops", "frontend", "backend", "full stack"
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
}

/**
 * Analyze match using OpenAI for advanced reasoning
 */
async function analyzeMatchWithAI(
  candidateProfile: CandidateProfile,
  jobRequirements: JobRequirements
): Promise<{ score: number; justification: string }> {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found in environment variables");
      throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY in .env.local");
    }
    
    const ai = await getOpenAI();
    
    const prompt = `You are an AI recruiter assistant. Analyze how well a candidate matches a job position.

Job Position:
Title: ${jobRequirements.title}
Description: ${jobRequirements.description}
Required Skills: ${jobRequirements.requiredSkills?.join(", ") || "Not specified"}
Education: ${jobRequirements.education || "Not specified"}
Experience Required: ${jobRequirements.experience || "Not specified"}

Candidate Profile:
Skills: ${candidateProfile.skills.join(", ")}
Experience: ${candidateProfile.experience.substring(0, 500)}
Education: ${candidateProfile.education}
Summary: ${candidateProfile.summary.substring(0, 300)}

Provide:
1. A match score from 0-100 based on skills, experience, education, and overall fit
2. A brief justification (2-3 sentences) explaining why this score was given

Respond in JSON format:
{
  "score": <number 0-100>,
  "justification": "<brief explanation>"
}`;

    const response = await ai.chat.completions.create({
      model: "gpt-4o-mini", // Using cheaper model for cost efficiency
      messages: [
        {
          role: "system",
          content: "You are an expert recruiter. Analyze candidate-job matches objectively and provide scores with clear justifications."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent scoring
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const analysis = JSON.parse(content);
    
    return {
      score: Math.max(0, Math.min(100, parseInt(analysis.score) || 50)),
      justification: analysis.justification || "Match analysis completed."
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Provide more specific error message
    if (error.message?.includes("API key") || error.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local");
    }
    
    // Return default if AI fails (will fallback to basic matching)
    throw error; // Re-throw to let caller handle
  }
}

/**
 * Basic skill matching fallback (when AI fails)
 */
function basicSkillMatch(
  candidateProfile: CandidateProfile,
  jobRequirements: JobRequirements
): SkillMatchResult {
  const jobKeywords = extractKeywords(jobRequirements);
  const candidateSkills = candidateProfile.skills.map(s => s.toLowerCase());
  
  const matched = jobKeywords.filter(keyword =>
    candidateSkills.some(skill => skill.includes(keyword) || keyword.includes(skill))
  );
  
  const score = Math.round((matched.length / Math.max(jobKeywords.length, 1)) * 100);
  
  return {
    matchedSkills: matched,
    missingSkills: jobKeywords.filter(k => !matched.includes(k)).slice(0, 10),
    score,
    justification: `Matched ${matched.length} out of ${jobKeywords.length} required skills based on keyword analysis.`,
    keywordMatches: matched.length,
    totalKeywords: jobKeywords.length
  };
}

