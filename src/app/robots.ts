import { MetadataRoute } from 'next';
import { seoConfig } from '@/config/seo.config';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🤖 ROBOTS.TXT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * এই file search engines কে বলে কোন pages crawl করা যাবে।
 * Admin pages crawl করা থেকে block করা হয়েছে।
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: seoConfig.robots.allow,
        disallow: seoConfig.robots.disallow,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${seoConfig.site.url}/sitemap.xml`,
  };
}
