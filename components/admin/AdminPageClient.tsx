"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export function AdminPageClient() {
  const [newCount, setNewCount] = useState(0);

  return (
    <div className="flex min-h-screen bg-[#f4f4f2] font-body" dir="rtl">
      <AdminSidebar newCount={newCount} />
      <AdminDashboard onNewCount={setNewCount} />
    </div>
  );
}
