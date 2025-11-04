# Module 2: User Management & Profiles

This module handles user profile management for all stakeholder types in the AI Recruiter platform.

## Overview

The User Management module provides comprehensive profile management for:

- **Job Seekers**: CV management, certificates, skills, professional information
- **Companies**: Company information, verification status, subscription management
- **Government Users**: Department information, position, verification documents

## Structure

```
modules/users/
├── components/
│   ├── JobSeekerProfile.tsx    # Job seeker profile component
│   ├── CompanyProfile.tsx      # Company profile component
│   └── GovernmentProfile.tsx    # Government profile component
├── index.ts                     # Module exports
└── README.md                    # This file

app/api/users/
├── profile/
│   └── route.ts                # Profile CRUD operations
├── upload/
│   └── route.ts                # Document upload handling
├── certificates/
│   └── route.ts                # Certificate management
├── verification/
│   └── route.ts                # Verification status
└── subscription/
    └── route.ts                # Subscription management

lib/validators/
└── user-validators.ts          # Profile validation schemas

prisma/
└── schema.prisma               # Database schema with user models
```

## Features

### Job Seeker Profiles

- Personal information (phone, address, bio)
- Professional information (position, experience, education)
- Skills management
- CV upload and management
- Certificate management with document uploads

### Company Profiles

- Company information and details
- Business registration information
- Verification status management
- Subscription status tracking
- Document uploads (business license, verification docs)

### Government Profiles

- Department and position information
- Employee identification
- Verification status
- Document uploads

## API Endpoints

### Profile Management

- `GET /api/users/profile` - Get user profile
- `POST /api/users/profile` - Create profile
- `PATCH /api/users/profile` - Update profile

### Document Uploads

- `POST /api/users/upload` - Upload documents (CV, certificates, etc.)
  - Headers: `x-file-type`: "cv" | "certificate" | "company-doc" | "government-doc"

### Certificates

- `GET /api/users/certificates` - Get all certificates
- `POST /api/users/certificates` - Add certificate
- `DELETE /api/users/certificates?id={id}` - Delete certificate

### Verification

- `GET /api/users/verification` - Get verification status
- `PATCH /api/users/verification` - Update verification status

### Subscription

- `GET /api/users/subscription` - Get subscription status
- `PATCH /api/users/subscription` - Update subscription

## Usage

### Using Profile Components

```tsx
import {
  JobSeekerProfile,
  CompanyProfile,
  GovernmentProfile,
} from "@/modules/users";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();

  if (user?.role === "USER") {
    return <JobSeekerProfile />;
  } else if (user?.role === "COMPANY") {
    return <CompanyProfile />;
  } else if (user?.role === "GOVERNMENT") {
    return <GovernmentProfile />;
  }

  return <div>Invalid user role</div>;
}
```

### Validation

All profile data is validated using Zod schemas:

```typescript
import {
  jobSeekerProfileSchema,
  companyProfileSchema,
  governmentProfileSchema,
} from "@/lib/validators/user-validators";
```

## Database Schema

The module uses Prisma with SQLite (development). Key models:

- `User` - Base user model with role
- `JobSeekerProfile` - Extended profile for job seekers
- `CompanyProfile` - Extended profile for companies
- `GovernmentProfile` - Extended profile for government users
- `Certificate` - Certificates for job seekers

## Setup

1. Install dependencies:

```bash
npm install @prisma/client zod
npm install -D prisma
```

2. Initialize Prisma:

```bash
npx prisma generate
npx prisma db push
```

3. Set up environment variable:

```env
DATABASE_URL="file:./dev.db"
```

## Notes

- All API routes require authentication via `x-user-id` header
- File uploads are limited to 5MB
- Supported file types: PDF, JPEG, PNG
- Profile validation is enforced on both client and server
- Document uploads are stored in `public/uploads/`
