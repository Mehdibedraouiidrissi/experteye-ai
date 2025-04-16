
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ModeToggle() {
  const { toast } = useToast();
  const [theme, setTheme] = useState(() => {
    // Check for theme in localStorage or use system preference
    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme;
      }
      // Check for system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light"; // Default theme
  });

  // Apply theme when component mounts and when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      
      // Remove both classes first to ensure clean state
      root.classList.remove("light", "dark");
      
      // Add current theme class
      root.classList.add(theme);
      
      // Store theme preference
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: `${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`,
      description: `The application is now in ${newTheme} mode.`,
      duration: 2000,
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all duration-300 hover:bg-primary/10"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-warning" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
