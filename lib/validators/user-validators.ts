import { z } from "zod"

// Base user validation
export const baseUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Job Seeker Profile Validation
export const jobSeekerProfileSchema = z.object({
  phone: z.string().optional(),
  dateOfBirth: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  currentPosition: z.string().optional(),
  currentCompany: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).max(50).optional(),
  skills: z.array(z.string()).optional().default([]),
  education: z.string().optional(),
  graduationCertificateUrl: z.string().optional(),
  nationalId: z.string().regex(/^\d{10}$/, "Ethiopian National ID must be 10 digits").optional(),
  passportNumber: z.string().optional(),
  idType: z.enum(["national_id", "passport"]).optional(),
  idFrontUrl: z.string().optional(),
  idBackUrl: z.string().optional(),
})

export const certificateSchema = z.object({
  title: z.string().min(1, "Certificate title is required"),
  issuer: z.string().min(1, "Issuer name is required"),
  issueDate: z.string().transform((val) => new Date(val)),
  expiryDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  description: z.string().optional(),
})

// Company Profile Validation
export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(200),
  phone: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
})

export const companyVerificationSchema = z.object({
  verificationStatus: z.enum(["PENDING", "VERIFIED", "REJECTED"]).optional(),
})

export const companySubscriptionSchema = z.object({
  subscriptionStatus: z.enum(["FREE", "BASIC", "PREMIUM", "ENTERPRISE"]),
  subscriptionExpiresAt: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
})

// Government Profile Validation
export const governmentProfileSchema = z.object({
  department: z.string().min(2, "Department name is required"),
  position: z.string().min(2, "Position is required"),
  office: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  employeeId: z.string().optional(),
})

// File Upload Validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    "File size must be less than 5MB"
  ).refine(
    (file) => ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type),
    "File must be PDF, JPEG, or PNG"
  ),
})

// Profile Update Schemas
export const updateJobSeekerProfileSchema = jobSeekerProfileSchema.partial()
export const updateCompanyProfileSchema = companyProfileSchema.partial()
export const updateGovernmentProfileSchema = governmentProfileSchema.partial()

// Export types
export type JobSeekerProfileInput = z.infer<typeof jobSeekerProfileSchema>
export type CertificateInput = z.infer<typeof certificateSchema>
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>
export type GovernmentProfileInput = z.infer<typeof governmentProfileSchema>
export type FileUploadInput = z.infer<typeof fileUploadSchema>

