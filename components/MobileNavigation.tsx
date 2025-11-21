"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FileUploader from "./FileUploader";
import {
  LayoutDashboard,
  FileText,
  Image,
  PlaySquare,
  MoreHorizontal,
  Menu,
  Upload,
  LogOut,
  Cloud,
  Settings,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/app/actions/user.action";


const MobileNavigation = ({userId,accountId}:{userId:string,accountId:string}) => {
  const pathname = usePathname();
  const path = pathname?.split("/").pop() || "files";
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Documents", icon: FileText, href: "/dashboard/documents" },
    { name: "Images", icon: Image, href: "/dashboard/images" },
    { name: "Media", icon: PlaySquare, href: "/dashboard/media" },
    { name: "Others", icon: MoreHorizontal, href: "/dashboard/others" },
  ];

  async function handleLogout() {
    await logoutUser();
  }

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="md:hidden w-full">
      {/* Enhanced Top Bar */}
      <div className="flex items-center justify-between w-full px-5 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
        {/* Logo with new design */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            CloudVault
          </h1>
        </div>

        {/* Menu Button */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300">
              <Menu className="text-slate-700" size={24} />
            </button>
          </SheetTrigger>

          {/* Enhanced Drawer Menu */}
          <SheetContent
            side="right"
            className="w-80 p-0 flex flex-col bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 shadow-xl"
          >
            <SheetHeader className="px-6 py-4 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold text-slate-800">
                    CloudVault
                  </SheetTitle>
                  <p className="text-xs text-slate-500 -mt-1">Navigation Menu</p>
                </div>
              </div>
            </SheetHeader>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 p-4 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                        : "text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-md border border-transparent hover:border-slate-200"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`transition-colors ${
                        isActive 
                          ? "text-white" 
                          : "text-slate-400 group-hover:text-indigo-500"
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Buttons */}
            <div className="flex flex-col gap-3 p-4 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
              
              <div className="flex gap-2">
             <div>
              <FileUploader path= {path} ownerId={userId} accountId={accountId} />
             </div>
            
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsSheetOpen(false);
                  }}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200/60 text-xs text-slate-500 text-center bg-white/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              © {new Date().getFullYear()} CloudVault
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigation;