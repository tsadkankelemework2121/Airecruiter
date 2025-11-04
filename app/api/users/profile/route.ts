import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { 
  jobSeekerProfileSchema, 
  companyProfileSchema, 
  governmentProfileSchema 
} from "@/lib/validators/user-validators"

// GET - Get user profile based on role
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        jobSeekerProfile: true,
        companyProfile: true,
        governmentProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let profile = null
    const role = user.role.toUpperCase()
    if (role === "USER" && user.jobSeekerProfile) {
      // Parse skills JSON string back to array for frontend
      profile = {
        ...user.jobSeekerProfile,
        skills: user.jobSeekerProfile.skills 
          ? (typeof user.jobSeekerProfile.skills === 'string' 
              ? JSON.parse(user.jobSeekerProfile.skills) 
              : user.jobSeekerProfile.skills)
          : [],
        nationalId: user.jobSeekerProfile.nationalId || undefined,
        passportNumber: user.jobSeekerProfile.passportNumber || undefined,
        idType: user.jobSeekerProfile.idType || undefined,
        idFrontUrl: user.jobSeekerProfile.idFrontUrl || undefined,
        idBackUrl: user.jobSeekerProfile.idBackUrl || undefined,
        kycStatus: user.jobSeekerProfile.kycStatus || undefined,
        kycVerifiedAt: user.jobSeekerProfile.kycVerifiedAt || undefined,
        graduationCertificateUrl: user.jobSeekerProfile.graduationCertificateUrl || undefined,
      }
    } else if (role === "COMPANY" && user.companyProfile) {
      profile = user.companyProfile
    } else if (role === "GOVERNMENT" && user.governmentProfile) {
      profile = user.governmentProfile
    }

    return NextResponse.json({ user, profile }, { status: 200 })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// POST - Create user profile
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()

    let profile
    // Handle both uppercase and lowercase role names
    const role = user.role.toUpperCase()
    if (role === "USER") {
      const validatedData = jobSeekerProfileSchema.parse(body)
      // Ensure skills is stored as JSON string
      const profileData: any = {
        ...validatedData,
        skills: typeof validatedData.skills === 'string' 
          ? validatedData.skills 
          : JSON.stringify(validatedData.skills || [])
      }
      // Handle KYC fields if provided
      if (validatedData.nationalId || validatedData.passportNumber || validatedData.idType) {
        profileData.nationalId = validatedData.nationalId || null
        profileData.passportNumber = validatedData.passportNumber || null
        profileData.idType = validatedData.idType || null
      }
      if (validatedData.idFrontUrl || validatedData.idBackUrl) {
        profileData.idFrontUrl = validatedData.idFrontUrl || null
        profileData.idBackUrl = validatedData.idBackUrl || null
      }
      profile = await prisma.jobSeekerProfile.create({
        data: profileData,
      })
    } else if (role === "COMPANY") {
      const validatedData = companyProfileSchema.parse(body)
      profile = await prisma.companyProfile.create({
        data: {
          userId,
          ...validatedData,
        },
      })
    } else if (role === "GOVERNMENT") {
      const validatedData = governmentProfileSchema.parse(body)
      profile = await prisma.governmentProfile.create({
        data: {
          userId,
          ...validatedData,
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 })
    }

    return NextResponse.json({ profile }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating profile:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()

    let profile
    const role = user.role.toUpperCase()
    if (role === "USER") {
      const validatedData = jobSeekerProfileSchema.partial().parse(body)
      // Ensure skills is stored as JSON string if provided
      const updateData: any = validatedData.skills !== undefined
        ? {
            ...validatedData,
            skills: typeof validatedData.skills === 'string' 
              ? validatedData.skills 
              : JSON.stringify(validatedData.skills || [])
          }
        : { ...validatedData }
      
      // Handle KYC fields if provided
      if (validatedData.nationalId !== undefined) updateData.nationalId = validatedData.nationalId || null
      if (validatedData.passportNumber !== undefined) updateData.passportNumber = validatedData.passportNumber || null
      if (validatedData.idType !== undefined) updateData.idType = validatedData.idType || null
      if (validatedData.idFrontUrl !== undefined) updateData.idFrontUrl = validatedData.idFrontUrl || null
      if (validatedData.idBackUrl !== undefined) updateData.idBackUrl = validatedData.idBackUrl || null
      
      profile = await prisma.jobSeekerProfile.update({
        where: { userId },
        data: updateData,
      })
    } else if (role === "COMPANY") {
      const validatedData = companyProfileSchema.partial().parse(body)
      profile = await prisma.companyProfile.update({
        where: { userId },
        data: validatedData,
      })
    } else if (role === "GOVERNMENT") {
      const validatedData = governmentProfileSchema.partial().parse(body)
      profile = await prisma.governmentProfile.update({
        where: { userId },
        data: validatedData,
      })
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 })
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating profile:", error)
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

