// Job Service - Handles job operations with localStorage
// This service manages all job-related operations using localStorage for persistence

export interface Job {
  id: string;
  title: string;
  description: string;
  companyId: string;
  companyName: string;
  location: string;
  city?: string;
  region?: string;
  country?: string;
  salary?: string;
  salaryType?: "Monthly" | "Annual" | "Hourly";
  type: "Full Time" | "Part Time" | "Contract" | "Internship";
  requirements?: string;
  education?: string;
  experience?: string;
  vacancies: number;
  category?: string;
  postedDate: string;
  deadline?: string;
  isActive: boolean;
  status: "active" | "closed" | "draft";
  createdAt: string;
  updatedAt: string;
}

const JOBS_STORAGE_KEY = "airecruiter_jobs";
const JOB_CATEGORIES_KEY = "airecruiter_job_categories";
const JOB_REGIONS_KEY = "airecruiter_job_regions";

// Initialize with default categories and regions
const DEFAULT_CATEGORIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Engineering",
  "Marketing",
  "Sales",
  "Human Resources",
  "Operations",
  "Other",
];

const DEFAULT_REGIONS = [
  "Addis Ababa",
  "Dire Dawa",
  "Mekelle",
  "Gondar",
  "Awassa",
  "Bahir Dar",
  "Dessie",
  "Jimma",
  "Jijiga",
  "Shashamane",
  "Other",
];

// Job Service Functions
export const jobService = {
  // Initialize default data
  initializeDefaults() {
    if (typeof window === "undefined") return;
    
    // Initialize categories
    if (!localStorage.getItem(JOB_CATEGORIES_KEY)) {
      localStorage.setItem(JOB_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }
    
    // Initialize regions
    if (!localStorage.getItem(JOB_REGIONS_KEY)) {
      localStorage.setItem(JOB_REGIONS_KEY, JSON.stringify(DEFAULT_REGIONS));
    }
  },

  // Get all jobs
  getAllJobs(): Job[] {
    if (typeof window === "undefined") return [];
    try {
      const jobsJson = localStorage.getItem(JOBS_STORAGE_KEY);
      return jobsJson ? JSON.parse(jobsJson) : [];
    } catch (error) {
      console.error("Error reading jobs from localStorage:", error);
      return [];
    }
  },

  // Get jobs by company ID
  getJobsByCompany(companyId: string): Job[] {
    const allJobs = this.getAllJobs();
    return allJobs.filter((job) => job.companyId === companyId);
  },

  // Get active jobs
  getActiveJobs(): Job[] {
    const allJobs = this.getAllJobs();
    return allJobs.filter((job) => job.isActive && job.status === "active");
  },

  // Get job by ID
  getJobById(jobId: string): Job | null {
    const allJobs = this.getAllJobs();
    return allJobs.find((job) => job.id === jobId) || null;
  },

  // Create new job
  createJob(jobData: Omit<Job, "id" | "postedDate" | "createdAt" | "updatedAt">): Job {
    const allJobs = this.getAllJobs();
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: jobData.status === "active",
    };
    
    allJobs.push(newJob);
    this.saveJobs(allJobs);
    return newJob;
  },

  // Update job
  updateJob(jobId: string, updates: Partial<Job>): Job | null {
    const allJobs = this.getAllJobs();
    const index = allJobs.findIndex((job) => job.id === jobId);
    
    if (index === -1) return null;
    
    const updatedJob: Job = {
      ...allJobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      isActive: updates.status === "active" || (updates.status === undefined && allJobs[index].status === "active"),
    };
    
    allJobs[index] = updatedJob;
    this.saveJobs(allJobs);
    return updatedJob;
  },

  // Delete job
  deleteJob(jobId: string): boolean {
    const allJobs = this.getAllJobs();
    const filteredJobs = allJobs.filter((job) => job.id !== jobId);
    
    if (filteredJobs.length === allJobs.length) return false;
    
    this.saveJobs(filteredJobs);
    return true;
  },

  // Save jobs to localStorage
  saveJobs(jobs: Job[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.error("Error saving jobs to localStorage:", error);
    }
  },

  // Search jobs
  searchJobs(query: string, filters?: {
    category?: string;
    location?: string;
    type?: string;
    status?: string;
  }): Job[] {
    let jobs = this.getAllJobs();
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerQuery) ||
          job.description.toLowerCase().includes(lowerQuery) ||
          job.companyName.toLowerCase().includes(lowerQuery) ||
          job.location.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        jobs = jobs.filter((job) => job.category === filters.category);
      }
      if (filters.location) {
        jobs = jobs.filter(
          (job) =>
            job.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
            job.city?.toLowerCase().includes(filters.location!.toLowerCase()) ||
            job.region?.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.type) {
        jobs = jobs.filter((job) => job.type === filters.type);
      }
      if (filters.status) {
        jobs = jobs.filter((job) => job.status === filters.status);
      }
    }
    
    return jobs;
  },

  // Get categories
  getCategories(): string[] {
    if (typeof window === "undefined") return DEFAULT_CATEGORIES;
    try {
      const categoriesJson = localStorage.getItem(JOB_CATEGORIES_KEY);
      return categoriesJson ? JSON.parse(categoriesJson) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error("Error reading categories:", error);
      return DEFAULT_CATEGORIES;
    }
  },

  // Add category
  addCategory(category: string): void {
    if (typeof window === "undefined") return;
    const categories = this.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      localStorage.setItem(JOB_CATEGORIES_KEY, JSON.stringify(categories));
    }
  },

  // Get regions
  getRegions(): string[] {
    if (typeof window === "undefined") return DEFAULT_REGIONS;
    try {
      const regionsJson = localStorage.getItem(JOB_REGIONS_KEY);
      return regionsJson ? JSON.parse(regionsJson) : DEFAULT_REGIONS;
    } catch (error) {
      console.error("Error reading regions:", error);
      return DEFAULT_REGIONS;
    }
  },

  // Add region
  addRegion(region: string): void {
    if (typeof window === "undefined") return;
    const regions = this.getRegions();
    if (!regions.includes(region)) {
      regions.push(region);
      localStorage.setItem(JOB_REGIONS_KEY, JSON.stringify(regions));
    }
  },
};

// Initialize on module load (client-side only)
if (typeof window !== "undefined") {
  jobService.initializeDefaults();
}

