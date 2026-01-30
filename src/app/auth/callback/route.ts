import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get user info to check if authorized
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Optional: Check if user email is in allowed list
        const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS?.split(",") || [];
        
        // If no allowed emails configured, allow all authenticated users
        // Or check if user's email is in the allowed list
        if (allowedEmails.length === 0 || allowedEmails.includes(user.email || "")) {
          return NextResponse.redirect(`${origin}${next}`);
        } else {
          // User not authorized, sign them out
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/login?error=unauthorized`);
        }
      }
    }
  }

  // Auth error, redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
