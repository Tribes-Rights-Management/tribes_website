import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  isPortal: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "tribes-theme-preference";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeProviderProps {
  children: ReactNode;
  forceLight?: boolean; // For portal routes
}

export function ThemeProvider({ children, forceLight = false }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (forceLight) return "light";
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (forceLight) return "light";
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) as Theme : "system";
    if (stored === "dark") return "dark";
    if (stored === "light") return "light";
    return getSystemTheme();
  });

  useEffect(() => {
    if (forceLight) {
      setResolvedTheme("light");
      document.documentElement.classList.remove("dark");
      return;
    }

    const updateResolvedTheme = () => {
      let resolved: ResolvedTheme;
      if (theme === "system") {
        resolved = getSystemTheme();
      } else {
        resolved = theme;
      }
      setResolvedTheme(resolved);

      if (resolved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateResolvedTheme();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, forceLight]);

  const setTheme = (newTheme: Theme) => {
    if (forceLight) return; // Cannot change theme in portal
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, isPortal: forceLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
