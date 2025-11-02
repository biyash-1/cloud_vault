"use server";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import React from "react";
import { getCurrentUser } from "../actions/user.action";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in"); // Redirect if not logged in
  }

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-amber-50 to-white">
      <Sidebar user={currentUser} />

      <section className="flex flex-1 flex-col">
        <div className="sticky top-0 z-50 md:hidden">
          <MobileNavigation />
        </div>

        <header className="sticky top-0 z-50 hidden md:block bg-white shadow-sm border-b border-gray-100">
          <Header userId = {currentUser.$id} accountId ={currentUser.accountId} />
        </header>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </section>
    </main>
  );
}
