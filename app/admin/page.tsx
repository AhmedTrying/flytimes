import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import { AdminPageClient } from "@/components/admin/AdminPageClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  if (!isAdminAuthed()) {
    redirect("/admin/login");
  }
  return <AdminPageClient />;
}
