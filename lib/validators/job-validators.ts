import { z } from "zod";

// Job posting validation schema
export const jobPostingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000, "Description must be less than 5000 characters"),
  location: z.string().min(2, "Location is required").max(200),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  salary: z.string().optional(),
  salaryType: z.enum(["Monthly", "Annual", "Hourly"]).optional(),
  type: z.enum(["Full Time", "Part Time", "Contract", "Internship"], {
    errorMap: () => ({ message: "Invalid job type" }),
  }),
  requirements: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  vacancies: z.number().int().min(1, "At least 1 vacancy required").max(1000),
  category: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(["active", "closed", "draft"]).default("draft"),
});

// Job update schema (all fields optional)
export const jobUpdateSchema = jobPostingSchema.partial();

// Job search/filter schema
export const jobSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

// Export types
export type JobPostingInput = z.infer<typeof jobPostingSchema>;
export type JobUpdateInput = z.infer<typeof jobUpdateSchema>;
export type JobSearchInput = z.infer<typeof jobSearchSchema>;

