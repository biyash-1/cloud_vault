"use client";

import { useState, useTransition } from "react";
import { Search, LogOut } from "lucide-react";
import { logoutUser } from "@/app/actions/user.action";
import FileUploader from "./FileUploader";

export default function Header({userId,accountId}:{userId:string,accountId:string}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
      window.location.href = "/sign-in";
    });
  };

  return (
    <header className="bg-white w-full border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search files, folders, and more..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center ">
          {/* ✅ Use FileUploader directly instead of wrapping in a <button> */}
          <FileUploader
            ownerId={userId}
            accountId= {accountId}
            
          />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* Optional last-upload feedback */}
      {fileName && (
        <p className="text-sm text-gray-500 mt-2 ml-1">
          Last uploaded:{" "}
          <span className="font-medium text-gray-700">{fileName}</span>
        </p>
      )}
    </header>
  );
}
