"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlytimesMark } from "@/components/FlytimesMark";

type Props = {
  newCount?: number;
};

export function AdminSidebar({ newCount = 0 }: Props) {
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <aside className="hidden md:flex flex-col bg-brand-ink text-white/75 min-h-screen w-[240px] p-5 gap-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 pb-5 border-b border-white/10 mb-5">
        <FlytimesMark size={44} href={null} />
        <span className="text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-black tracking-[0.05em]">
          إدارة
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-[0.15em] text-white/35 px-3.5 py-2 mt-3 first:mt-0">
          الرئيسية
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-2.5 rounded-[10px] text-[14px] font-bold flex items-center gap-2.5 hover:bg-white/5 hover:text-white"
        >
          <span>📊</span> لوحة التحكم
        </Link>

        {/* Bookings — with new-submissions badge */}
        <Link
          href="/admin"
          className="px-3.5 py-2.5 rounded-[10px] text-[14px] font-bold flex items-center gap-2.5 bg-brand-orange/15 text-brand-orange"
        >
          <span>📨</span>
          <span className="flex-1">طلبات الحجز</span>
          {newCount > 0 && (
            <span className="bg-brand-orange text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {newCount}
            </span>
          )}
        </Link>

        <Link
          href="/packages"
          className="px-3.5 py-2.5 rounded-[10px] text-[14px] font-bold flex items-center gap-2.5 hover:bg-white/5 hover:text-white"
        >
          <span>📦</span> البكجات
        </Link>

        <Link
          href="/"
          className="px-3.5 py-2.5 rounded-[10px] text-[14px] font-bold flex items-center gap-2.5 hover:bg-white/5 hover:text-white"
        >
          <span>←</span> زيارة الموقع
        </Link>

        <div className="text-[10px] uppercase tracking-[0.15em] text-white/35 px-3.5 py-2 mt-4">
          الإدارة
        </div>
        <Link href="/admin" className="px-3.5 py-2.5 rounded-[10px] text-[14px] font-bold flex items-center gap-2.5 hover:bg-white/5 hover:text-white">
          <span>📈</span> التقارير
        </Link>
        <Link href="/admin" className="px-3.5 py-2.5 rounded-[10px] text-[14px] font-bold flex items-center gap-2.5 hover:bg-white/5 hover:text-white">
          <span>⚙</span> الإعدادات
        </Link>
      </nav>

      {/* User badge */}
      <div className="mt-auto pt-5 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-orange rounded-full grid place-items-center font-heading font-black text-white">
          أ
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-[13px]">مدير الحجوزات</div>
          <div className="text-white/40 text-[11px]">فلاي تايمز</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/55 hover:text-white text-[11px] font-bold"
          title="تسجيل خروج"
        >
          خروج ↩
        </button>
      </div>
    </aside>
  );
}
