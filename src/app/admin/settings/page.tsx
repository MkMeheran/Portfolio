import { AdminHeader } from "@/components/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, Palette, Globe, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <AdminHeader
        title="Settings"
        description="Configure your portfolio settings"
      />

      <div className="space-y-6 max-w-3xl">
        {/* Database Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Database Status</CardTitle>
            </div>
            <CardDescription>
              Your Supabase connection information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection</span>
              <Badge variant="outline" className="text-green-600">
                Configured
              </Badge>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Make sure to run the <code className="bg-muted px-1 rounded">schema.sql</code> file
              in your Supabase SQL Editor to create all necessary tables.
            </p>
          </CardContent>
        </Card>

        {/* Site Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Site Information</CardTitle>
            </div>
            <CardDescription>
              Basic site configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Site Name</span>
                <span className="text-sm text-muted-foreground">Amr Portfolio</span>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Tagline</span>
                <span className="text-sm text-muted-foreground">
                  Urban Planner | GIS Analyst | Full-Stack Developer
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Theme</CardTitle>
            </div>
            <CardDescription>
              Customize the appearance of your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-lg bg-[oklch(0.25_0.08_250)] border" />
                <span className="text-xs">Primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-lg bg-[oklch(0.65_0.15_195)] border" />
                <span className="text-xs">Accent</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-lg bg-background border" />
                <span className="text-xs">Background</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Theme customization can be done by editing the globals.css file.
            </p>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Authentication and access control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Admin Authentication</span>
              <Badge>Supabase Auth</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Row Level Security</span>
              <Badge variant="outline" className="text-green-600">Enabled</Badge>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              All admin routes are protected. Only authenticated users with admin role
              can access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
