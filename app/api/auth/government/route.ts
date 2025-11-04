import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Get government credentials from environment variables
    const govEmail = process.env.GOVERNMENT_EMAIL;
    const govPassword = process.env.GOVERNMENT_PASSWORD;

    // Check if credentials are configured
    if (!govEmail || !govPassword) {
      console.error("Government credentials not configured in environment variables");
      return NextResponse.json(
        { error: "Government authentication not configured" },
        { status: 500 }
      );
    }

    // Verify credentials
    if (email === govEmail && password === govPassword) {
      // Return success with user data
      return NextResponse.json({
        success: true,
        user: {
          id: "government_admin",
          fullName: "Government Administrator",
          email: govEmail,
          role: "government",
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Government login error:", error);
    return NextResponse.json(
      { error: "An error occurred during authentication" },
      { status: 500 }
    );
  }
}

