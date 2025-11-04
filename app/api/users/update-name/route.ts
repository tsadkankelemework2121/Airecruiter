import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateNameSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
})

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateNameSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: validatedData.fullName,
      },
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating name:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    )
  }
}

