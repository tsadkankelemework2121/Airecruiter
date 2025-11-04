# Module 4: AI Resume Screening Engine

This module provides AI-powered resume analysis and candidate ranking for the AI Recruiter platform.

## Overview

The AI Screening Engine uses OpenAI to analyze resumes, match skills, and rank candidates based on multiple factors including:
- Skill matching against job requirements
- Experience alignment
- Education qualification
- Overall fit assessment

## Features

### Resume Parsing
- **PDF Parsing**: Extracts text and structured data from PDF resumes
- **Text Extraction**: Parses plain text resumes
- **Structured Data Extraction**:
  - Personal information (name, email, phone)
  - Skills
  - Work experience
  - Education
  - Certifications
  - Languages

### Skill Matching
- **AI-Powered Analysis**: Uses OpenAI GPT-4o-mini for intelligent skill matching
- **Keyword Extraction**: Identifies relevant skills from job descriptions
- **Match Scoring**: Calculates match percentage (0-100%)
- **Justification**: Provides reasoning for match scores
- **Missing Skills**: Identifies gaps in candidate skills

### Candidate Ranking
- **Multi-Factor Scoring**:
  - Skills (50% weight)
  - Experience (30% weight)
  - Education (20% weight)
- **Ranking Algorithm**: Ranks candidates from best to worst match
- **Strengths & Weaknesses**: Identifies candidate strengths and areas for improvement
- **Detailed Justification**: Explains ranking decisions

## Structure

```
modules/ai-screening/
├── components/
│   └── ScreeningResults.tsx   # UI component for displaying screening results
├── index.ts                    # Module exports
└── README.md                   # This file

lib/ai/
├── resumeParser.ts             # Resume parsing logic
├── skillMatcher.ts             # AI skill matching
└── rankCandidates.ts           # Ranking algorithm

app/api/ai/screen/
└── route.ts                    # AI screening API endpoints
```

## API Endpoints

### Screen Single Application
- **POST** `/api/ai/screen`
  - Body: `{ applicationId, jobId }`
  - Headers: `x-user-id` (required)
  - Returns: Screening result with match score and justification

### Screen All Applications for a Job
- **PUT** `/api/ai/screen`
  - Body: `{ jobId }`
  - Headers: `x-user-id` (required)
  - Returns: Ranked list of all candidates with scores

### Get Screening Results
- **GET** `/api/ai/screen?jobId={id}` or `?applicationId={id}`
  - Headers: `x-user-id` (required)
  - Returns: Stored screening results

## Usage

### Using the Screening Component

```tsx
import { ScreeningResults } from "@/modules/ai-screening";

export default function CompanyDashboard() {
  const jobId = "job_123";
  
  return (
    <div>
      <ScreeningResults jobId={jobId} />
    </div>
  );
}
```

### Using the Screening API

```typescript
// Screen a single application
const response = await fetch("/api/ai/screen", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-user-id": userId,
  },
  body: JSON.stringify({
    applicationId: "app_123",
    jobId: "job_456"
  })
});

const result = await response.json();
console.log(result.screeningResult.matchScore);
```

### Using Resume Parser Directly

```typescript
import { parseResume } from "@/modules/ai-screening";
import { readFile } from "fs/promises";

const fileBuffer = await readFile("resume.pdf");
const parsedResume = await parseResume(fileBuffer, "application/pdf");

console.log(parsedResume.skills);
console.log(parsedResume.experience);
```

### Using Skill Matcher

```typescript
import { matchSkills } from "@/modules/ai-screening";

const skillMatch = await matchSkills(
  {
    skills: ["javascript", "react", "node.js"],
    experience: "5 years of full-stack development",
    education: "Bachelor's in Computer Science",
    summary: "Experienced developer..."
  },
  {
    title: "Senior Full Stack Developer",
    description: "We need an experienced developer...",
    requiredSkills: ["javascript", "react", "node.js", "typescript"],
    education: "Bachelor's Degree"
  }
);

console.log(skillMatch.score); // Match percentage
console.log(skillMatch.matchedSkills);
console.log(skillMatch.missingSkills);
```

## Scoring System

### Overall Score Calculation
- **Skills**: 50% weight
- **Experience**: 30% weight
- **Education**: 20% weight

### Score Interpretation
- **90-100**: Highly Recommended
- **75-89**: Strong Match
- **60-74**: Good Match
- **40-59**: Moderate Match
- **0-39**: Limited Match

## Integration

The AI Screening module is integrated into:
- **Company Dashboard** (`/dashboard/company`)
  - New "AI Screening" tab
  - Shows ranked candidates for selected job
  - Displays match scores and justifications

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)

Add to `.env.local`:
```
OPENAI_API_KEY=sk-proj-...
```

### Dependencies
- `openai`: ^4.20.0 - OpenAI SDK
- `pdf-parse`: ^1.1.1 - PDF parsing library

## Notes

- Uses OpenAI GPT-4o-mini for cost efficiency
- Resume parsing works with PDF and text files
- Falls back to profile data if CV is not available
- Rankings are calculated in real-time
- Results can be stored in database for future reference
- Screening may take a few moments for multiple candidates

## Future Enhancements

- Store screening results in database
- Batch screening with progress tracking
- Custom scoring weights per job
- Export rankings to CSV/PDF
- Email notifications for top candidates
- Historical comparison tracking


