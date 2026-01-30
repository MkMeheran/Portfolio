import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Admin login page",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  
  // Check if user is already logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-2">
              <span className="text-xl font-bold text-primary-foreground">A</span>
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Sign in with Google to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {params.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {params.error === "unauthorized" 
                  ? "You don't have access to this site" 
                  : "Login failed. Please try again."}
              </div>
            )}
            
            <GoogleSignInButton />
            
            {params.error === "unauthorized" && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Signed in with wrong account?
                </p>
                <a 
                  href="https://accounts.google.com/logout" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline"
                >
                  Sign out from Google
                </a>
                <span className="text-xs text-muted-foreground"> and try again</span>
              </div>
            )}
            
            <p className="text-xs text-center text-muted-foreground">
              Only authorized emails can sign in
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          This is a protected admin area. Only authorized users can access.
        </p>
      </div>
    </div>
  );
}
