"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  PlaySquare,
  MoreHorizontal,
  Menu,
  Upload,
  LogOut,
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

const MobileNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Documents", icon: FileText, href: "/documents" },
    { name: "Images", icon: Image, href: "/images" },
    { name: "Media", icon: PlaySquare, href: "/media" },
    { name: "Others", icon: MoreHorizontal, href: "/others" },
  ];

  async function handleLogout() {
    await logoutUser();
  }

  return (
    <div className="md:hidden w-full">
      {/* 🔹 Full-width Top Bar */}
      <div className="flex items-center justify-between w-full px-5 py-4 border-b bg-white shadow-sm">
        {/* App Name */}
        <h1 className="text-xl font-semibold flex items-center gap-1">
          <span className="text-orange-500">Cloud</span>
          <span className="text-gray-800">Vault</span>
        </h1>

        {/* Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md hover:bg-orange-100 transition-colors">
              <Menu className="text-gray-800" size={28} />
            </button>
          </SheetTrigger>

          {/* Drawer Menu */}
          <SheetContent
            side="right"
            className="w-64 p-4 flex flex-col bg-white shadow-lg"
          >
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold mb-4 text-gray-800">
                Navigation
              </SheetTitle>
            </SheetHeader>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-3 mt-2 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                <Upload size={18} /> Upload File
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 border-red-400 text-red-500 hover:bg-red-100"
              >
                <LogOut size={18} onClick={handleLogout} /> Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigation;
