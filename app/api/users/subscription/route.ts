import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { companySubscriptionSchema } from "@/lib/validators/user-validators"

// PATCH - Update company subscription
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = companySubscriptionSchema.parse(body)

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
        subscriptionStatus: validatedData.subscriptionStatus,
        subscriptionExpiresAt: validatedData.subscriptionExpiresAt || null,
      },
    })

    return NextResponse.json({ profile: updatedProfile }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    )
  }
}

// GET - Get subscription status
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId },
      select: {
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    })

    if (!companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ subscription: companyProfile }, { status: 200 })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    )
  }
}

