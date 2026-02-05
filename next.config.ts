import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance & Optimization */
  reactCompiler: true,
  
  // Code splitting & optimization
  experimental: {
    optimizePackageImports: ['lucide-react', '@icons-pack/react-simple-icons', 'react-icons'],
    // Disable image optimization in dev to save memory
    disableOptimizedLoading: process.env.NODE_ENV === 'development',
  },
  
  // Dev options
  allowedDevOrigins: ['192.168.0.109', 'localhost'],
  
  // Image optimization
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Disable image optimization to speed up dev server
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ozhlteeipldvznsvsavz.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'nzeglwdodpurbbygaqpf.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'meheran-portfolio.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'udyomxorg.vercel.app',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
  
  // Compiler options for smaller bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Empty turbopack config to use Turbopack (Next.js 16+)
  turbopack: {},
};

export default nextConfig;
