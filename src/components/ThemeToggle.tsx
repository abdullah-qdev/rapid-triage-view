import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 p-0 hover:bg-muted transition-all duration-300"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "light" ? (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
      )}
    </Button>
  );
}
