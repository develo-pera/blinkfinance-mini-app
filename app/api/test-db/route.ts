import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

// GET /api/test-db - Test database connection
export async function GET() {
  try {
    await connectDB();

    // Test basic database operations
    const userCount = await User.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      data: {
        userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
