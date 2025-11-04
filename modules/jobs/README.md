# Module 3: Job Posting & Management

This module handles job creation, editing, and management by companies in the AI Recruiter platform.

## Overview

The Job Management module provides comprehensive job posting capabilities including:
- Job creation with detailed information
- Job editing and deletion
- Job status management (active, closed, draft)
- Job categories and filtering
- Region/city tagging for analytics
- Job search and listing

## Structure

```
modules/jobs/
├── components/
│   ├── JobPostingForm.tsx    # Job creation and editing form
│   └── JobListing.tsx        # Job listing component
├── index.ts                   # Module exports
└── README.md                  # This file

app/api/jobs/
└── route.ts                   # Job API routes (GET, POST, PATCH, DELETE)

lib/
├── services/
│   └── jobService.ts         # Job business logic with localStorage
└── validators/
    └── job-validators.ts     # Job validation schemas
```

## Features

### Job Posting
- Create new job postings with comprehensive details
- Edit existing job postings
- Delete job postings
- Save as draft or publish immediately
- Support for multiple job types (Full Time, Part Time, Contract, Internship)

### Job Management
- View all posted jobs
- Filter by status (active, draft, closed)
- Search jobs by title, description, location
- Toggle job status (active/closed)
- Track job statistics

### Job Information
- Job title and description
- Location (with city, region, country tagging)
- Salary information (with type: Monthly, Annual, Hourly)
- Job requirements (education, experience, additional requirements)
- Number of vacancies
- Application deadline
- Job category
- Job type

### Data Persistence
All jobs are stored in `localStorage` under the key `airecruiter_jobs`. This ensures:
- Jobs persist across browser sessions
- Fast access without server dependency
- Works offline

## API Endpoints

### Job Management

- `GET /api/jobs` - Get all jobs (with optional filtering)
  - Query params: `companyId`, `id`, `query`, `category`, `location`, `type`, `status`
  
- `GET /api/jobs?companyId={id}` - Get jobs for a specific company

- `GET /api/jobs?id={jobId}` - Get a single job by ID

- `POST /api/jobs` - Create new job
  - Headers: `x-user-id` (required)
  - Body: Job posting data

- `PATCH /api/jobs` - Update job
  - Headers: `x-user-id` (required)
  - Body: Job ID and update fields

- `DELETE /api/jobs?id={jobId}` - Delete job
  - Headers: `x-user-id` (required)

## Usage

### Using Job Components

```tsx
import { JobPostingForm, JobListing, jobService } from "@/modules/jobs";
import { useAuth } from "@/lib/auth-context";

export default function JobManagement() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const companyJobs = jobService.getJobsByCompany(user.id);
      setJobs(companyJobs);
    }
  }, [user]);

  return (
    <div>
      <JobListing 
        jobs={jobs}
        onEdit={(job) => handleEdit(job)}
        onDelete={(id) => handleDelete(id)}
      />
      {showForm && (
        <JobPostingForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            // Reload jobs
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
```

### Using Job Service

```typescript
import { jobService } from "@/modules/jobs";

// Get all jobs
const allJobs = jobService.getAllJobs();

// Get jobs for a company
const companyJobs = jobService.getJobsByCompany(companyId);

// Get active jobs
const activeJobs = jobService.getActiveJobs();

// Search jobs
const results = jobService.searchJobs("developer", {
  category: "Technology",
  location: "Addis Ababa",
  type: "Full Time"
});

// Create job
const newJob = jobService.createJob({
  title: "Software Engineer",
  description: "...",
  // ... other fields
});

// Update job
const updated = jobService.updateJob(jobId, {
  status: "active"
});

// Delete job
jobService.deleteJob(jobId);
```

### Validation

All job data is validated using Zod schemas:

```typescript
import { jobPostingSchema, jobUpdateSchema } from "@/lib/validators/job-validators";

const validatedData = jobPostingSchema.parse(jobData);
```

## Default Categories

- Technology
- Healthcare
- Finance
- Education
- Engineering
- Marketing
- Sales
- Human Resources
- Operations
- Other

## Default Regions

- Addis Ababa
- Dire Dawa
- Mekelle
- Gondar
- Awassa
- Bahir Dar
- Dessie
- Jimma
- Jijiga
- Shashamane
- Other

## Integration

The job management module is integrated into the company dashboard at `/dashboard/company`. Companies can:

1. View all their posted jobs
2. Filter by status (all, active, draft, closed)
3. Search jobs
4. Create new jobs
5. Edit existing jobs
6. Delete jobs
7. Toggle job status

## Notes

- Jobs are stored in `localStorage`, so they persist across sessions
- Each job is linked to a company via `companyId`
- Job status can be: "active", "closed", or "draft"
- Only active jobs are visible in public job listings
- Jobs include location tagging for analytics (city, region, country)
- Categories and regions are stored separately and can be extended

