/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {  fontFamily: {
      sans: ["Poppins", "ui-sans-serif", "system-ui"],
      cyber: ["Orbitron", "sans-serif"],

    },
      boxShadow: {
        custom: "0 6px 18px rgba(0,0,0,.28)", // theme.json shadow
      },
      borderRadius: {
        custom: "18px", // theme.json radius
      },
      screens: {
        'xs': '480px', // Extra small screens
        // 'sm': '640px', // Small screens (default in Tailwind)
        // 'md': '768px', // Medium screens (default in Tailwind)
        'sc750': '750px',
        'sc875': '875px', // Custom breakpoint between md and lg
        // 'lg': '1024px', // Large screens (default in Tailwind)
        // 'xl': '1280px', // Extra large screens (default in Tailwind)
        // '2xl': '1536px', // 2X extra large screens (default in Tailwind)
      },
    },
  },
  plugins: [
  require("tailwind-scrollbar-hide"),
],
}
