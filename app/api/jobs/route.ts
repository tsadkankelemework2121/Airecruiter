import { NextRequest, NextResponse } from "next/server";
import { jobService, Job } from "@/lib/services/jobService";
import { jobPostingSchema, jobUpdateSchema, jobSearchSchema } from "@/lib/validators/job-validators";
import { prisma } from "@/lib/prisma";

// GET - Get jobs (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if it's a company-specific request
    const companyId = searchParams.get("companyId");
    const jobId = searchParams.get("id");
    
    if (jobId) {
      // Get single job by ID
      const job = jobService.getJobById(jobId);
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
      return NextResponse.json({ job }, { status: 200 });
    }
    
    if (companyId) {
      // Get all jobs for a specific company
      const jobs = jobService.getJobsByCompany(companyId);
      return NextResponse.json({ jobs }, { status: 200 });
    }
    
    // Get jobs with filters
    const filters = {
      query: searchParams.get("query") || undefined,
      category: searchParams.get("category") || undefined,
      location: searchParams.get("location") || undefined,
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
    };
    
    const validatedFilters = jobSearchSchema.parse(filters);
    const jobs = jobService.searchJobs(
      validatedFilters.query || "",
      {
        category: validatedFilters.category,
        location: validatedFilters.location,
        type: validatedFilters.type,
        status: validatedFilters.status,
      }
    );
    
    // Return only active jobs for public listing (unless status filter is specified)
    const activeJobs = validatedFilters.status 
      ? jobs 
      : jobs.filter((job) => job.status === "active" && job.isActive);
    
    return NextResponse.json({ jobs: activeJobs, total: activeJobs.length }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = jobPostingSchema.parse(body);
    
    // Get company name from user profile (for now, use userId as companyId)
    // In a real app, you'd fetch this from the user's company profile
    const companyName = body.companyName || "Company";
    
    // Create job object (client will save to localStorage)
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newJob: Job = {
      ...validatedData,
      id: jobId,
      companyId: userId,
      companyName,
      postedDate: now,
      createdAt: now,
      updatedAt: now,
      isActive: validatedData.status === "active",
    };
    
    // Save to Prisma database for applications matching
    try {
      await prisma.job.create({
        data: {
          id: jobId,
          title: validatedData.title,
          description: validatedData.description,
          companyId: userId,
          location: validatedData.location || "",
          salary: validatedData.salary || null,
          salaryType: validatedData.salaryType || null,
          type: validatedData.type || "Full Time",
          requirements: validatedData.requirements || null,
          education: validatedData.education || null,
          experience: validatedData.experience || null,
          vacancies: validatedData.vacancies || 1,
          deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
          isActive: validatedData.status === "active",
          postedDate: new Date(now),
        },
      });
    } catch (dbError) {
      console.error("Error saving job to database:", dbError);
      // Continue - client will save to localStorage
    }
    
    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

// PATCH - Update job
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }
    
    // Verify job belongs to user
    const existingJob = jobService.getJobById(id);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    
    if (existingJob.companyId !== userId) {
      return NextResponse.json({ error: "Unauthorized to update this job" }, { status: 403 });
    }
    
    const validatedData = jobUpdateSchema.parse(updates);
    const updatedJob = jobService.updateJob(id, validatedData);
    
    if (!updatedJob) {
      return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }
    
    // Also update in Prisma database
    try {
      const dbUpdateData: any = {};
      if (validatedData.title !== undefined) dbUpdateData.title = validatedData.title;
      if (validatedData.description !== undefined) dbUpdateData.description = validatedData.description;
      if (validatedData.location !== undefined) dbUpdateData.location = validatedData.location;
      if (validatedData.salary !== undefined) dbUpdateData.salary = validatedData.salary;
      if (validatedData.salaryType !== undefined) dbUpdateData.salaryType = validatedData.salaryType;
      if (validatedData.type !== undefined) dbUpdateData.type = validatedData.type;
      if (validatedData.requirements !== undefined) dbUpdateData.requirements = validatedData.requirements;
      if (validatedData.education !== undefined) dbUpdateData.education = validatedData.education;
      if (validatedData.experience !== undefined) dbUpdateData.experience = validatedData.experience;
      if (validatedData.vacancies !== undefined) dbUpdateData.vacancies = validatedData.vacancies;
      if (validatedData.deadline !== undefined) dbUpdateData.deadline = validatedData.deadline ? new Date(validatedData.deadline) : null;
      if (validatedData.status !== undefined) dbUpdateData.isActive = validatedData.status === "active";
      
      if (Object.keys(dbUpdateData).length > 0) {
        await prisma.job.update({
          where: { id },
          data: dbUpdateData,
        });
      }
    } catch (dbError) {
      console.error("Error updating job in database:", dbError);
      // Continue even if database update fails
    }
    
    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating job:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("id");
    
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }
    
    // Verify job belongs to user
    const existingJob = jobService.getJobById(jobId);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    
    if (existingJob.companyId !== userId) {
      return NextResponse.json({ error: "Unauthorized to delete this job" }, { status: 403 });
    }
    
    const deleted = jobService.deleteJob(jobId);
    
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
    
    // Also delete from Prisma database
    try {
      await prisma.job.delete({
        where: { id: jobId },
      });
    } catch (dbError) {
      console.error("Error deleting job from database:", dbError);
      // Continue even if database delete fails
    }
    
    return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}

