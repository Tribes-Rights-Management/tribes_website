import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
      },
    },
    extend: {
      /* ═══════════════════════════════════════════════════════════════════════════
         SPACING — Aligned to locked CSS tokens (DO NOT ADD NEW VALUES)
         ═══════════════════════════════════════════════════════════════════════════ */
      spacing: {
        "1": "0.25rem",   /* 4px  - space-1 */
        "2": "0.5rem",    /* 8px  - space-2 */
        "3": "0.75rem",   /* 12px - space-3 */
        "4": "1rem",      /* 16px - space-4 */
        "5": "1.25rem",   /* 20px - space-5 */
        "6": "1.5rem",    /* 24px - space-6 */
        "7": "2rem",      /* 32px - space-7 */
        "8": "2.5rem",    /* 40px - space-8 */
        "9": "3rem",      /* 48px - space-9 */
        "10": "4rem",     /* 64px - space-10 */
        "11": "5rem",     /* 80px - space-11 */
        "12": "6rem",     /* 96px - space-12 */
      },
      maxWidth: {
        "content": "var(--maxContentWidth)",  /* 720px */
      },
      fontSize: {
        "label": ["var(--labelCapsSize)", { lineHeight: "var(--labelCapsLine)", letterSpacing: "var(--labelCapsTracking)", fontWeight: "var(--labelCapsWeight)" }],
        "xs": ["var(--smallSize)", { lineHeight: "var(--smallLine)", fontWeight: "var(--smallWeight)" }],
        "sm": ["var(--smallSize)", { lineHeight: "var(--smallLine)", fontWeight: "var(--smallWeight)" }],
        "base": ["var(--bodySize)", { lineHeight: "var(--bodyLine)", fontWeight: "var(--bodyWeight)" }],
        "lg": ["var(--h3Size)", { lineHeight: "var(--h3Line)", fontWeight: "var(--h3Weight)" }],
        "xl": ["var(--h2Size)", { lineHeight: "var(--h2Line)", fontWeight: "var(--h2Weight)" }],
        "2xl": ["var(--h1Size)", { lineHeight: "var(--h1Line)", fontWeight: "var(--h1Weight)" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "content-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "content-fade": "content-fade 0.14s ease-out",
        "slide-in-right": "slide-in-right 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "slide-out-right": "slide-out-right 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      transitionDuration: {
        '160': '160ms',
        '220': '220ms',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
