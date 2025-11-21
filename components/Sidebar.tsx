"use client";

import {
  LayoutDashboard,
  FileText,
  Image,
  PlaySquare,
  MoreHorizontal,
  Settings,
  LogOut,
  Cloud,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  user: {
    username?: string;
    email?: string;
  } | null; 
}

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Documents", icon: FileText, href: "/dashboard/documents" },
    { name: "Images", icon: Image, href: "/dashboard/images" },
    { name: "Media", icon: PlaySquare, href: "/dashboard/media" },
    { name: "Others", icon: MoreHorizontal, href: "/dashboard/others" },
  ];

  const fullName = user?.username || "Guest User";
  const email = user?.email || "guest@example.com";

  return (
    <aside className="hidden sm:flex flex-col h-screen bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-lg transition-all duration-300 w-16 lg:w-64 group hover:shadow-xl">
      {/* Logo Section - Enhanced */}
      <div className="flex items-center justify-center lg:justify-start h-20 border-b border-slate-200/60 px-4 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CloudVault
            </h1>
            <p className="text-xs text-slate-500 -mt-1">Secure Storage</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group/nav ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transform scale-105"
                  : "text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-md border border-transparent hover:border-slate-200"
              }`}
            >
              <Icon
                size={20}
                className={`transition-all duration-300 ${
                  isActive 
                    ? "text-white scale-110" 
                    : "text-slate-400 group-hover/nav:text-indigo-500"
                }`}
              />
              <span className="hidden lg:inline font-medium">{item.name}</span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Storage Progress Bar */}
    

      {/* User Profile - Enhanced */}
      <div className="flex items-center gap-3 p-2 mt-auto bg-white/80 backdrop-blur-sm border-t border-slate-200/60 hover:bg-white transition-all duration-300 cursor-pointer group/profile">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover/profile:shadow-xl transition-all duration-300">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="hidden lg:block flex-1 min-w-0">
          <span className="font-semibold text-slate-800 block truncate">{fullName}</span>
          <span className="text-xs text-slate-500 block truncate">{email}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-300">
          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <Settings size={16} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden lg:block p-4 border-t border-slate-200/60 text-xs text-slate-500 text-center bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-300"></div>
          </div>
          <span>All systems operational</span>
        </div>
        © {new Date().getFullYear()} CloudVault
      </div>
    </aside>
  );
};

export default Sidebar;