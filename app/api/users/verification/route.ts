import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { companyVerificationSchema } from "@/lib/validators/user-validators"

// PATCH - Update company verification status (Admin only in production)
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = companyVerificationSchema.parse(body)

    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId },
    })

    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      )
    }

    const updatedProfile = await prisma.companyProfile.update({
      where: { userId },
      data: {
        verificationStatus: validatedData.verificationStatus || companyProfile.verificationStatus,
        verifiedAt: validatedData.verificationStatus === "VERIFIED" ? new Date() : null,
      },
    })

    return NextResponse.json({ profile: updatedProfile }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating verification:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update verification" },
      { status: 500 }
    )
  }
}

// GET - Get verification status
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId },
      select: {
        verificationStatus: true,
        verifiedAt: true,
      },
    })

    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ verification: companyProfile }, { status: 200 })
  } catch (error) {
    console.error("Error fetching verification:", error)
    return NextResponse.json(
      { error: "Failed to fetch verification status" },
      { status: 500 }
    )
  }
}

