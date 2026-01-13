import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Download, 
  User, 
  LogOut,
  Search,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/learning-library", label: "Learning Library", icon: BookOpen },
    { path: "/subjects", label: "Subjects", icon: GraduationCap },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/download-requests", label: "Download Requests", icon: Download },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card/60 backdrop-blur-md border-r border-border/30 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Viswam OTT Logo" className="w-16 h-16 object-contain" />
          <h1 className="font-display text-2xl font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Viswam OTT
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-primary/20 text-primary border-l-4 border-primary"
                  : "text-[hsl(40,35%,85%)] hover:bg-card/40 hover:text-[hsl(40,40%,90%)]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Account & Logout */}
      <div className="p-4 border-t border-border/30 space-y-2">
        <Link
          to="/account"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
            location.pathname === "/account"
              ? "bg-primary/20 text-primary border-l-4 border-primary"
              : "text-[hsl(40,35%,85%)] hover:bg-card/40 hover:text-[hsl(40,40%,90%)]"
          )}
        >
          <User className="w-5 h-5" />
          <span className="font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Account
          </span>
        </Link>
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-[hsl(40,35%,85%)] hover:bg-card/40 hover:text-[hsl(40,40%,90%)] transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


