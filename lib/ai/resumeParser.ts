// Resume Parser - Extract structured data from resumes (PDF/Text)
// PDF parsing is handled dynamically to avoid SSR issues

import type { ParsedResume, WorkHistoryItem } from "./types";

// Re-export types for convenience
export type { ParsedResume, WorkHistoryItem } from "./types";

/**
 * Parse PDF resume
 */
export async function parsePDFResume(fileBuffer: Buffer): Promise<ParsedResume> {
  try {
    // Dynamically import pdf-parse to avoid SSR issues
    const pdfParseModule: any = await import("pdf-parse");
    // pdf-parse can be exported as default, named, or directly
    const pdfParse = pdfParseModule.default || pdfParseModule.pdfParse || pdfParseModule;
    
    if (typeof pdfParse !== 'function') {
      throw new Error("pdf-parse module is not a function");
    }
    
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;
    
    return parseResumeText(text);
  } catch (error) {
    console.error("Error parsing PDF resume:", error);
    throw new Error("Failed to parse PDF resume");
  }
}

/**
 * Parse text resume
 */
export async function parseTextResume(text: string): Promise<ParsedResume> {
  return parseResumeText(text);
}

/**
 * Extract structured data from resume text using basic pattern matching
 * In production, this would use more sophisticated NLP/ML models
 */
function parseResumeText(text: string): ParsedResume {
  const normalizedText = text.toLowerCase();
  
  // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i);
  const email = emailMatch ? emailMatch[0] : undefined;
  
  // Extract phone number (various formats)
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10}/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;
  
  // Extract skills (common technical skills)
  const skillKeywords = [
    "javascript", "typescript", "react", "node.js", "python", "java", "c++", "c#",
    "sql", "mongodb", "postgresql", "aws", "azure", "docker", "kubernetes",
    "git", "agile", "scrum", "machine learning", "ai", "data science",
    "html", "css", "angular", "vue", "express", "django", "flask",
    "project management", "leadership", "communication", "teamwork"
  ];
  
  const extractedSkills = skillKeywords.filter(skill => 
    normalizedText.includes(skill.toLowerCase())
  );
  
  // Extract education
  const educationKeywords = ["bachelor", "master", "phd", "degree", "university", "college", "diploma"];
  const educationLines = text.split("\n").filter(line => 
    educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
  const education = educationLines.slice(0, 3).join(" | ") || "";
  
  // Extract work experience (look for job titles and companies)
  const experienceKeywords = ["experience", "work history", "employment", "career"];
  const workHistory: WorkHistoryItem[] = [];
  
  // Try to extract work history sections
  const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Look for common job title patterns
    if (line.includes("developer") || line.includes("engineer") || 
        line.includes("manager") || line.includes("analyst") ||
        line.includes("designer") || line.includes("consultant")) {
      
      const titleMatch = lines[i].match(/^(.+?)(?:\s*[-–]\s*|\s+at\s+)/i);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        const companyLine = lines[i + 1] || lines[i];
        const companyMatch = companyLine.match(/(?:at\s+)?(.+?)(?:\s*[-–]|\s+\d{4}|$)/i);
        
        if (companyMatch) {
          workHistory.push({
            title,
            company: companyMatch[1].trim(),
            description: lines[i + 2]?.substring(0, 200) || undefined
          });
        }
      }
    }
  }
  
  // Extract summary (first paragraph or about section)
  const summaryMatch = text.match(/(?:summary|about|objective|profile)[:\s]*\n?([\s\S]+?)(?:\n\n|\n[A-Z]|experience|education)/i);
  const summary = summaryMatch ? summaryMatch[1].trim().substring(0, 500) : text.substring(0, 300);
  
  // Extract certifications
  const certKeywords = ["certified", "certification", "certificate", "license"];
  const certifications = lines.filter(line => 
    certKeywords.some(keyword => line.toLowerCase().includes(keyword))
  ).slice(0, 10);
  
  // Extract languages
  const languageKeywords = ["english", "amharic", "french", "spanish", "arabic", "fluent", "native"];
  const languages = languageKeywords.filter(lang => 
    normalizedText.includes(lang.toLowerCase())
  );
  
  // Extract full name (first line, if it looks like a name)
  const firstLine = lines[0];
  const nameMatch = firstLine.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/);
  const fullName = nameMatch ? firstLine : undefined;
  
  // Combine all experience into one string
  const experienceText = workHistory.map(item => 
    `${item.title} at ${item.company}${item.description ? `: ${item.description}` : ""}`
  ).join(" | ") || text.substring(0, 1000);
  
  return {
    fullName,
    email,
    phone,
    skills: extractedSkills,
    experience: experienceText,
    education,
    summary,
    workHistory: workHistory.slice(0, 5), // Limit to 5 most recent
    certifications,
    languages,
    rawText: text
  };
}

/**
 * Parse resume from file buffer (auto-detect type)
 */
export async function parseResume(fileBuffer: Buffer, mimeType?: string): Promise<ParsedResume> {
  if (mimeType?.includes("pdf") || mimeType === "application/pdf") {
    return parsePDFResume(fileBuffer);
  } else {
    const text = fileBuffer.toString("utf-8");
    return parseTextResume(text);
  }
}

