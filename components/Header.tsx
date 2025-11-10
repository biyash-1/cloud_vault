"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/app/actions/user.action";
import FileUploader from "./FileUploader";
import Search from "./Search"; // <-- import the new component

export default function Header({ userId, accountId }: { userId: string; accountId: string }) {
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
        <Search placeholder="Search files, folders, and more..." />

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          <FileUploader ownerId={userId} accountId={accountId} />

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

      {fileName && (
        <p className="text-sm text-gray-500 mt-2 ml-1">
          Last uploaded: <span className="font-medium text-gray-700">{fileName}</span>
        </p>
      )}
    </header>
  );
}
