"use client";

import {
  LayoutDashboard,
  FileText,
  Image,
  PlaySquare,
  MoreHorizontal,
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
    { name: "media", icon: PlaySquare, href: "/dashboard/media" },
    { name: "Others", icon: MoreHorizontal, href: "/dashboard/others" },
  ];

  const fullName = user?.username || "Guest User";
  const email = user?.email || "guest@example.com";

  return (
    <aside className="hidden sm:flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 w-16 md:w-64">
      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start h-16 border-b border-gray-200 px-2 md:px-4">
        <h1 className="text-lg md:text-2xl font-semibold tracking-wide">
          <span className="text-orange-500">C</span>
          <span className="hidden md:inline text-orange-500">loud</span>
          <span className="hidden md:inline text-gray-800">Vault</span>
        </h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 gap-4 px-1 md:px-4 py-6 space-y-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-center md:justify-start gap-0 md:gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
              }`}
            >
              <Icon
                size={20}
                className={`${
                  isActive ? "text-white" : "text-gray-500"
                } transition-colors`}
              />
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="flex items-center gap-3 px-4 py-3 mt-auto mb-6 bg-gray-50 rounded-lg mx-2 hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
          {fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-800 truncate">{fullName}</span>
          <span className="text-xs text-gray-500 truncate">{email}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden md:block p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        © {new Date().getFullYear()} CloudVault
      </div>
    </aside>
  );
};

export default Sidebar;
