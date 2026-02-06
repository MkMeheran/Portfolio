import { MetadataRoute } from 'next';
import { seoConfig } from '@/config/seo.config';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🗺️ SITEMAP CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * এই file search engines কে আপনার সব pages এর list দেয়।
 * নতুন page add করলে এখানে automatically add হবে না,
 * manually এখানে add করতে হবে।
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoConfig.site.url;
  const lastModified = new Date();

  return [
    // Home page (সবচেয়ে important)
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    
    // About page
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    
    // Skills page
    {
      url: `${baseUrl}/skills`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Projects page (future - যখন create করবেন)
    // {
    //   url: `${baseUrl}/projects`,
    //   lastModified,
    //   changeFrequency: 'weekly',
    //   priority: 0.9,
    // },
    
    // Blog page (future - যদি blog section add করেন)
    // {
    //   url: `${baseUrl}/blog`,
    //   lastModified,
    //   changeFrequency: 'daily',
    //   priority: 0.7,
    // },
    
    // Contact page (future)
    // {
    //   url: `${baseUrl}/contact`,
    //   lastModified,
    //   changeFrequency: 'yearly',
    //   priority: 0.6,
    // },
    
    // 💡 TIP: নতুন public page add করলে এখানে entry করুন
    // Admin pages এখানে add করবেন না (robots.txt এ block করা আছে)
  ];
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 📝 DYNAMIC SITEMAP (Future Enhancement)
 * ═══════════════════════════════════════════════════════════════
 * 
 * যদি blog posts বা projects dynamically database থেকে load করেন,
 * তাহলে এভাবে dynamic sitemap তৈরি করতে পারবেন:
 * 
 * import { createClient } from '@/lib/supabase/server';
 * 
 * export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 *   const supabase = createClient();
 *   
 *   // Fetch all projects
 *   const { data: projects } = await supabase
 *     .from('projects')
 *     .select('id, updated_at');
 *   
 *   const projectUrls = projects?.map((project) => ({
 *     url: `${baseUrl}/projects/${project.id}`,
 *     lastModified: new Date(project.updated_at),
 *     changeFrequency: 'monthly' as const,
 *     priority: 0.7,
 *   })) || [];
 *   
 *   return [...staticPages, ...projectUrls];
 * }
 */
