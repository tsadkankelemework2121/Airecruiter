import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH - Update KYC verification status (Admin only in production)
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { kycStatus } = body

    if (!kycStatus || !["PENDING", "VERIFIED", "REJECTED"].includes(kycStatus)) {
      return NextResponse.json(
        { error: "Invalid KYC status" },
        { status: 400 }
      )
    }

    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Job seeker profile not found" },
        { status: 404 }
      )
    }

    const updatedProfile = await prisma.jobSeekerProfile.update({
      where: { userId },
      data: {
        kycStatus,
        kycVerifiedAt: kycStatus === "VERIFIED" ? new Date() : null,
      },
    })

    return NextResponse.json({ profile: updatedProfile }, { status: 200 })
  } catch (error) {
    console.error("Error updating KYC:", error)
    return NextResponse.json(
      { error: "Failed to update KYC status" },
      { status: 500 }
    )
  }
}

// GET - Get KYC status
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
      select: {
        kycStatus: true,
        kycVerifiedAt: true,
        nationalId: true,
        passportNumber: true,
        idType: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Job seeker profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ kyc: profile }, { status: 200 })
  } catch (error) {
    console.error("Error fetching KYC:", error)
    return NextResponse.json(
      { error: "Failed to fetch KYC status" },
      { status: 500 }
    )
  }
}

