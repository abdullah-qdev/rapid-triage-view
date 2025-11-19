import { Link, useLocation } from "react-router-dom";
import { Home, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navigation() {
  const location = useLocation();
  const isUploadPage = location.pathname === "/upload";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-card/90 backdrop-blur-xl border-2 border-border/50 rounded-full px-2 py-2 shadow-2xl flex items-center gap-2">
        <Button
          asChild
          variant={!isUploadPage ? "default" : "ghost"}
          size="sm"
          className={`rounded-full transition-all duration-300 ${
            !isUploadPage 
              ? "bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg" 
              : "hover:bg-muted"
          }`}
        >
          <Link to="/" className="px-4 py-2">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>
        <Button
          asChild
          variant={isUploadPage ? "default" : "ghost"}
          size="sm"
          className={`rounded-full transition-all duration-300 ${
            isUploadPage 
              ? "bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg" 
              : "hover:bg-muted"
          }`}
        >
          <Link to="/upload" className="px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            Triage Scans
          </Link>
        </Button>
        
        <div className="w-px h-6 bg-border/50 mx-1" />
        
        <ThemeToggle />
      </div>
    </nav>
  );
}
