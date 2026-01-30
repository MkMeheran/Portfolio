import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Skip Supabase auth if not configured (for development/UI preview)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl || supabaseUrl === "your_supabase_project_url") {
    // Supabase not configured - allow all requests for UI development
    return NextResponse.next();
  }

  // When Supabase is configured, use the auth middleware
  const { updateSession } = await import("@/lib/supabase/middleware");
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
