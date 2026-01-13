import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
  schoolName?: string;
}

const DashboardLayout = ({ children, schoolName = "School Name" }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card/40 backdrop-blur-md border-b border-border/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Welcome, {schoolName}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search subjects or topics..."
                  className="pl-10 bg-card/40 border-border/30 text-[hsl(40,40%,90%)] placeholder:text-muted-foreground"
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="text-[hsl(40,40%,90%)] hover:bg-card/40">
                <Bell className="w-5 h-5" />
              </Button>
              
              {/* School Profile Indicator */}
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                <span className="text-primary font-semibold text-sm">
                  {schoolName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;







