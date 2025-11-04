# Setup Guide for Module 2: User Management & Profiles

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Initialize Prisma**

   Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

   Create the database:

   ```bash
   npm run prisma:push
   ```

4. **Verify Setup**

   You can optionally open Prisma Studio to view your database:

   ```bash
   npm run prisma:studio
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Module Structure

The User Management module has been set up at:

- **Components**: `modules/users/components/`

  - `JobSeekerProfile.tsx` - Profile management for job seekers
  - `CompanyProfile.tsx` - Profile management for companies
  - `GovernmentProfile.tsx` - Profile management for government users

- **API Routes**: `app/api/users/`

  - `profile/route.ts` - Profile CRUD operations
  - `upload/route.ts` - Document upload handling
  - `certificates/route.ts` - Certificate management
  - `verification/route.ts` - Verification status
  - `subscription/route.ts` - Subscription management

- **Validators**: `lib/validators/user-validators.ts`

  - Zod schemas for profile validation

- **Database Schema**: `prisma/schema.prisma`
  - User models and relationships

## Accessing Profiles

Once set up, users can access their profiles at:

- `/profile` - Automatically shows the correct profile based on user role

## User Roles

The system supports three user types:

1. **USER** (Job Seeker) - Can manage CV, certificates, skills
2. **COMPANY** - Can manage company info, verification, subscription
3. **GOVERNMENT** - Can manage department info, verification documents

## Testing

1. Create accounts with different roles via `/signup`
2. Navigate to `/profile` to view and edit profiles
3. Test document uploads (CV, certificates, verification docs)
4. Test profile CRUD operations

## Notes

- All file uploads are stored in `public/uploads/`
- Maximum file size: 5MB
- Supported file types: PDF, JPEG, PNG
- Authentication is handled via `x-user-id` header in API routes
