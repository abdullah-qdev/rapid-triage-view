import { Link, useLocation } from "react-router-dom";
import { Home, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const location = useLocation();
  const isUploadPage = location.pathname === "/upload";

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card/80 backdrop-blur-lg border border-border rounded-full px-6 py-3 shadow-lg">
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant={!isUploadPage ? "default" : "ghost"}
          size="sm"
          className="rounded-full"
        >
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>
        <Button
          asChild
          variant={isUploadPage ? "default" : "ghost"}
          size="sm"
          className="rounded-full"
        >
          <Link to="/upload">
            <Upload className="w-4 h-4 mr-2" />
            Triage Scans
          </Link>
        </Button>
      </div>
    </nav>
  );
}
