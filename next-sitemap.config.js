/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://portfolio-ok6guoutt-mokammel-morsheds-projects.vercel.app/", // 👉 এখানে তোমার লাইভ ডোমেইন / vercel URL দাও
  generateRobotsTxt: true,
  sitemapSize: 7000,
   robotsTxtOptions: {
    policies: [
      // সার্বজনীন ক্রলিং
      { userAgent: "*", allow: "/" },

      // OpenAI: সার্চ/ব্রাউজিং/ট্রেনিং—নিয়ন্ত্রণ আলাদা বট
      { userAgent: "ChatGPT-User", allow: "/" },   // লাইভ ব্রাউজিং
      { userAgent: "OAI-SearchBot", allow: "/" },  // সার্চ ইনডেক্সিং
      { userAgent: "GPTBot", allow: "/" },         // ট্রেনিং উদ্দেশ্যে

      // Anthropic (Claude)
      { userAgent: "ClaudeBot", allow: "/" },

      // Google এর AI কন্ট্রোল
      { userAgent: "Google-Extended", allow: "/" },

      // Perplexity (নতুন AI সার্চ)
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      ],},
};
