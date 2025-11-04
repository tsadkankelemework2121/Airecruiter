import { NextRequest, NextResponse } from "next/server";
import { parseResume } from "@/lib/ai/resumeParser";
import { matchSkills } from "@/lib/ai/skillMatcher";
import { rankCandidates, getRankingStats } from "@/lib/ai/rankCandidates";
import type { JobRequirements, CandidateProfile, CandidateScore } from "@/lib/ai/types";
import { jobService, Job } from "@/lib/services/jobService";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";

// POST - Screen a single application
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { applicationId, jobId } = body;
    
    if (!applicationId || !jobId) {
      return NextResponse.json(
        { error: "Application ID and Job ID are required" },
        { status: 400 }
      );
    }
    
    // Get application and job details from database
    let application: any = null;
    try {
      application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: true,
          applicant: {
            include: {
              jobSeekerProfile: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Error fetching application from database:", error);
      return NextResponse.json(
        { error: "Failed to fetch application from database", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
    
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    
    // Verify job belongs to user (company)
    // Check both Prisma job and localStorage job
    const job = application.job || jobService.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    
    const jobCompanyId = job.companyId || job.companyId;
    if (jobCompanyId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    // Get CV file if available
    let parsedResume = null;
    if (application.cvUrl) {
      try {
        // Read CV file from public/uploads
        const filePath = join(process.cwd(), "public", application.cvUrl);
        const fileBuffer = await readFile(filePath);
        
        // Parse resume
        parsedResume = await parseResume(fileBuffer, "application/pdf");
      } catch (error) {
        console.error("Error parsing CV:", error);
        // Continue without parsed resume
      }
    }
    
    // If no CV or parsing failed, use profile data
    if (!parsedResume) {
      const profile = application.applicant.jobSeekerProfile;
      if (profile) {
        parsedResume = {
          fullName: application.applicant.fullName,
          email: application.applicant.email,
          skills: profile.skills ? (typeof profile.skills === 'string' ? JSON.parse(profile.skills) : profile.skills) : [],
          experience: profile.yearsOfExperience ? `${profile.yearsOfExperience} years of experience` : "",
          education: profile.education || "",
          summary: profile.bio || "",
          workHistory: [],
          certifications: [],
          languages: [],
          rawText: ""
        };
      } else {
        return NextResponse.json(
          { error: "No resume or profile data available" },
          { status: 400 }
        );
      }
    }
    
    // Prepare job requirements
    const jobRequirements: JobRequirements = {
      title: application.job.title,
      description: application.job.description,
      education: application.job.education || undefined,
      experience: application.job.experience || undefined,
      requirements: application.job.requirements || undefined
    };
    
    // Prepare candidate profile
    const candidateProfile: CandidateProfile = {
      skills: parsedResume.skills || [],
      experience: parsedResume.experience || "",
      education: parsedResume.education || "",
      summary: parsedResume.summary || ""
    };
    
    // Match skills (with error handling)
    let skillMatch;
    try {
      skillMatch = await matchSkills(candidateProfile, jobRequirements);
    } catch (error: any) {
      console.error("Error in skill matching:", error);
      // If skill matching fails, create a basic match result
      skillMatch = {
        matchedSkills: candidateProfile.skills.slice(0, 5),
        missingSkills: [],
        score: 50,
        justification: "Basic skill matching completed. AI analysis unavailable.",
        keywordMatches: 0,
        totalKeywords: 0
      };
    }
    
    // Calculate match percentage
    const matchPercentage = skillMatch.score;
    
    // Store screening results (could save to database)
    const screeningResult = {
      applicationId,
      jobId,
      matchScore: matchPercentage,
      skillMatch,
      parsedResume: {
        skills: parsedResume.skills,
        experience: parsedResume.experience,
        education: parsedResume.education
      },
      screenedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      screeningResult,
      matchPercentage,
      recommendation: getRecommendation(matchPercentage)
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error screening application:", error);
    
    // Provide more detailed error messages
    let errorMessage = "Failed to screen application";
    if (error.message?.includes("OPENAI")) {
      errorMessage = "OpenAI API error. Please check your API key in .env.local";
    } else if (error.message?.includes("prisma")) {
      errorMessage = "Database error. Please ensure Prisma is properly configured.";
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Screen all applications for a job
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, test } = body;
    
    // Allow test mode without authentication
    if (test === true || test === "mock") {
      return await testScreeningWithMockData();
    }
    
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ 
        error: "Unauthorized",
        message: "Please provide x-user-id header or use { test: true } in body for testing"
      }, { status: 401 });
    }
    
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }
    
    // Verify job belongs to user
    const job = jobService.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    
    if (job.companyId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    // Get all applications for this job from database
    let applications: any[] = [];
    try {
      applications = await prisma.application.findMany({
        where: { jobId },
        include: {
          applicant: {
            include: {
              jobSeekerProfile: true
            }
          },
          job: true
        }
      });
    } catch (error) {
      console.error("Error fetching applications from database:", error);
      // If database query fails, return test data for demonstration
      console.log("Using test data for demonstration");
      return await testScreeningWithMockData();
    }
    
    if (applications.length === 0) {
      // No real applications found - use test data for demonstration
      console.log("No applications found for this job. Using test data for demonstration.");
      return await testScreeningWithMockData();
    }
    
    // Screen all applications
    const candidateData = await Promise.all(
      applications.map(async (application) => {
        // Get resume or profile data
        let parsedResume = null;
        
        if (application.cvUrl) {
          try {
            const filePath = join(process.cwd(), "public", application.cvUrl);
            const fileBuffer = await readFile(filePath);
            parsedResume = await parseResume(fileBuffer, "application/pdf");
          } catch (error) {
            console.error(`Error parsing CV for application ${application.id}:`, error);
          }
        }
        
        // Fallback to profile data
        if (!parsedResume) {
          const profile = application.applicant.jobSeekerProfile;
          if (profile) {
            parsedResume = {
              fullName: application.applicant.fullName,
              email: application.applicant.email,
              skills: profile.skills ? (typeof profile.skills === 'string' ? JSON.parse(profile.skills) : profile.skills) : [],
              experience: profile.yearsOfExperience ? `${profile.yearsOfExperience} years of experience` : "",
              education: profile.education || "",
              summary: profile.bio || "",
              workHistory: [],
              certifications: [],
              languages: [],
              rawText: ""
            };
          }
        }
        
        if (!parsedResume) {
          return null;
        }
        
        // Match skills
        const jobRequirements: JobRequirements = {
          title: application.job.title,
          description: application.job.description,
          education: application.job.education || undefined,
          experience: application.job.experience || undefined,
          requirements: application.job.requirements || undefined
        };
        
        const candidateProfile: CandidateProfile = {
          skills: parsedResume.skills || [],
          experience: parsedResume.experience || "",
          education: parsedResume.education || "",
          summary: parsedResume.summary || ""
        };
        
        let skillMatch;
        try {
          skillMatch = await matchSkills(candidateProfile, jobRequirements);
        } catch (error: any) {
          console.error(`Error matching skills for application ${application.id}:`, error);
          // Create basic match result if AI fails
          skillMatch = {
            matchedSkills: candidateProfile.skills.slice(0, 5),
            missingSkills: [],
            score: 50,
            justification: "Basic skill matching completed. AI analysis unavailable.",
            keywordMatches: 0,
            totalKeywords: 0
          };
        }
        
        return {
          candidateId: application.applicantId,
          applicationId: application.id,
          resume: parsedResume,
          skillMatch
        };
      })
    );
    
    // Filter out null results
    const validCandidates = candidateData.filter(c => c !== null) as any[];
    
    if (validCandidates.length === 0) {
      return NextResponse.json(
        { error: "No valid candidate data found" },
        { status: 400 }
      );
    }
    
    // Rank candidates
    const jobDetails = {
      title: applications[0].job.title,
      description: applications[0].job.description,
      education: applications[0].job.education || undefined,
      experience: applications[0].job.experience || undefined,
      requirements: applications[0].job.requirements || undefined
    };
    
    const rankedScores = rankCandidates(validCandidates, jobDetails);
    const stats = getRankingStats(rankedScores);
    
    return NextResponse.json({
      rankings: rankedScores,
      statistics: stats,
      totalCandidates: rankedScores.length
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error screening all applications:", error);
    
    // Provide more detailed error messages
    let errorMessage = "Failed to screen applications";
    if (error.message?.includes("OPENAI")) {
      errorMessage = "OpenAI API error. Please check your API key in .env.local";
    } else if (error.message?.includes("prisma")) {
      errorMessage = "Database error. Please ensure Prisma is properly configured.";
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET - Get screening results for a job OR test with mock data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const applicationId = searchParams.get("applicationId");
    const test = searchParams.get("test"); // Test parameter for mock data
    const userId = request.headers.get("x-user-id");
    
    // If no auth and no specific IDs, default to test mode
    // Test endpoint with mock data (no auth required)
    if (!userId && !jobId && !applicationId) {
      // Default to test mode if no parameters provided
      try {
        return await testScreeningWithMockData();
      } catch (error: any) {
        console.error("Error in test screening:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to run test screening",
          details: error.message,
          note: "Check if OPENAI_API_KEY is set in .env.local",
          help: "To test with mock data, use: GET /api/ai/screen?test=true"
        }, { status: 500 });
      }
    }
    
    // Check test parameter explicitly
    if (test === "true" || test === "mock" || test === "1") {
      try {
        return await testScreeningWithMockData();
      } catch (error: any) {
        console.error("Error in test screening:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to run test screening",
          details: error.message,
          note: "Check if OPENAI_API_KEY is set in .env.local"
        }, { status: 500 });
      }
    }
    
    // Require authentication for real data
    if (!userId) {
      return NextResponse.json({ 
        error: "Unauthorized", 
        message: "Please provide x-user-id header OR use ?test=true for testing with mock data",
        examples: {
          testMode: "GET /api/ai/screen?test=true",
          authenticated: "GET /api/ai/screen?jobId=xxx (with x-user-id header)"
        }
      }, { status: 401 });
    }
    
    if (applicationId) {
      // Get single application screening result
      // This would typically be stored in database
      // For now, we'll return a placeholder
      return NextResponse.json({
        message: "Screening result retrieval not yet implemented",
        applicationId
      }, { status: 200 });
    }
    
    if (jobId) {
      // Get all screening results for a job
      // This would typically be stored in database
      return NextResponse.json({
        message: "Screening results retrieval not yet implemented",
        jobId
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { error: "Job ID or Application ID is required, or use ?test=true for mock testing" },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error("Error getting screening results:", error);
    return NextResponse.json(
      { error: "Failed to get screening results", details: error.message },
      { status: 500 }
    );
  }
}

// Test function with mock data
async function testScreeningWithMockData() {
  try {
    // Mock job requirements
    const mockJobRequirements: JobRequirements = {
      title: "Senior Full Stack Developer",
      description: `We are looking for an experienced Full Stack Developer to join our team.
      
      Key Responsibilities:
      - Develop and maintain web applications using React and Node.js
      - Design and implement RESTful APIs
      - Work with databases (PostgreSQL, MongoDB)
      - Collaborate with cross-functional teams
      - Write clean, maintainable code
      
      Requirements:
      - 5+ years of experience in full-stack development
      - Strong proficiency in JavaScript/TypeScript
      - Experience with React, Node.js, Express
      - Knowledge of SQL and NoSQL databases
      - Experience with AWS or cloud platforms
      - Understanding of Git and version control
      - Bachelor's degree in Computer Science or related field`,
      requiredSkills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL", "MongoDB", "Git", "AWS"],
      education: "Bachelor's Degree in Computer Science",
      experience: "5+ years of full-stack development experience"
    };
    
    // Mock candidate profiles
    const mockCandidates: CandidateProfile[] = [
      {
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL", "MongoDB", "Git", "AWS", "Docker"],
        experience: "7 years of experience as a Full Stack Developer. Built multiple web applications from scratch. Led a team of 3 developers. Experienced with microservices architecture.",
        education: "Bachelor's Degree in Computer Science from University of Technology",
        summary: "Experienced Full Stack Developer with 7+ years in web development. Expert in React, Node.js, and cloud technologies. Strong problem-solving skills and passion for clean code."
      },
      {
        skills: ["JavaScript", "React", "Python", "Django", "MySQL", "Git"],
        experience: "3 years of experience in web development. Worked on e-commerce platforms and RESTful APIs.",
        education: "Bachelor's Degree in Software Engineering",
        summary: "Junior to mid-level developer with strong frontend skills and some backend experience. Quick learner and team player."
      },
      {
        skills: ["Java", "Spring Boot", "MySQL", "Git", "Maven"],
        experience: "4 years of experience as a Java Backend Developer. Built enterprise applications. Limited frontend experience.",
        education: "Master's Degree in Computer Science",
        summary: "Backend specialist with strong Java skills. Looking to transition to full-stack development."
      }
    ];
    
    // Screen all mock candidates
    const candidateData = await Promise.all(
      mockCandidates.map(async (candidate, index) => {
        try {
          const skillMatch = await matchSkills(candidate, mockJobRequirements);
          
          return {
            candidateId: `mock_candidate_${index + 1}`,
            applicationId: `mock_application_${index + 1}`,
            resume: {
              skills: candidate.skills,
              experience: candidate.experience,
              education: candidate.education,
              summary: candidate.summary,
              workHistory: [],
              certifications: [],
              languages: [],
              rawText: ""
            },
            skillMatch
          };
        } catch (error: any) {
          console.error(`Error screening mock candidate ${index + 1}:`, error);
          // Return basic match if AI fails
          return {
            candidateId: `mock_candidate_${index + 1}`,
            applicationId: `mock_application_${index + 1}`,
            resume: {
              skills: candidate.skills,
              experience: candidate.experience,
              education: candidate.education,
              summary: candidate.summary,
              workHistory: [],
              certifications: [],
              languages: [],
              rawText: ""
            },
            skillMatch: {
              matchedSkills: candidate.skills.slice(0, 5),
              missingSkills: [],
              score: 50,
              justification: "Basic matching (AI unavailable)",
              keywordMatches: 0,
              totalKeywords: 0
            }
          };
        }
      })
    );
    
    // Rank candidates
    const jobDetails = {
      title: mockJobRequirements.title,
      description: mockJobRequirements.description,
      education: mockJobRequirements.education,
      experience: mockJobRequirements.experience,
      requirements: undefined
    };
    
    const rankedScores = rankCandidates(candidateData, jobDetails);
    const stats = getRankingStats(rankedScores);
    
    return NextResponse.json({
      success: true,
      message: "Mock screening test completed successfully",
      jobRequirements: mockJobRequirements,
      rankings: rankedScores,
      statistics: stats,
      totalCandidates: rankedScores.length,
      note: "This is test data using mock candidates and job requirements"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error in test screening:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to run test screening",
      details: error.message,
      note: "Check if OPENAI_API_KEY is set in .env.local"
    }, { status: 500 });
  }
}

// Helper function to get recommendation based on score
function getRecommendation(score: number): string {
  if (score >= 90) {
    return "Highly Recommended";
  } else if (score >= 75) {
    return "Strong Match";
  } else if (score >= 60) {
    return "Good Match";
  } else if (score >= 40) {
    return "Moderate Match";
  } else {
    return "Limited Match";
  }
}

