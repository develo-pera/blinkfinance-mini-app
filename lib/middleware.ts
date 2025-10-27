/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Interface for JWT payload
interface JWTPayload {
  userId: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}

// Middleware function to verify JWT token
export async function verifyToken(request: NextRequest): Promise<{ user: any; error?: string }> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "No token provided" };
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (!decoded.userId) {
      return { user: null, error: "Invalid token payload" };
    }

    // Connect to database and find the user
    await connectDB();
    const user = await User.findById(decoded.userId).select("-__v");

    if (!user) {
      return { user: null, error: "User not found" };
    }

    // Verify wallet address matches (additional security check)
    if (decoded.walletAddress && user.walletAddress !== decoded.walletAddress) {
      return { user: null, error: "Token wallet address mismatch" };
    }

    return { user };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { user: null, error: "Invalid token" };
    }
    if (error instanceof jwt.TokenExpiredError) {
      return { user: null, error: "Token expired" };
    }
    console.error("Token verification error:", error);
    return { user: null, error: "Token verification failed" };
  }
}

// Middleware wrapper for protected routes
export function withAuth(handler: (request: NextRequest, context: any, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context: any) => {
    // Check if route should be protected
    const { pathname } = new URL(request.url);

    // Skip auth for these routes
    const publicRoutes = ["/api/auth", "/api/test-db", "/api/valut-contract/financial-data/]"];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (isPublicRoute) {
      return handler(request, context, null);
    }

    // Verify token for protected routes
    const { user, error } = await verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: error || "Authentication required" },
        { status: 401 }
      );
    }

    // Add user to request context and call the original handler
    return handler(request, context, user);
  };
}

// Helper function to check if user owns the resource
export function checkResourceOwnership(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

// Helper function to extract user ID from request params for ownership checks
export function extractUserIdFromParams(params: any): string | null {
  // Handle both sync and async params (Next.js 15+ compatibility)
  if (params && typeof params.then === "function") {
    // Async params - this will be handled by the caller
    return null;
  }
  return params?.id || params?.userId || null;
}

// Helper function to check ownership for async params
export async function checkOwnershipAsync(userId: string, params: Promise<any>): Promise<boolean> {
  const resolvedParams = await params;
  const resourceUserId = resolvedParams?.id || resolvedParams?.userId;
  return userId === resourceUserId;
}
