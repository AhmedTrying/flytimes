"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FlytimesMark } from "@/components/FlytimesMark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "كلمة المرور غير صحيحة");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream grid place-items-center px-4 py-10" dir="rtl">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <FlytimesMark size={56} href={null} />
          <span className="text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-black tracking-[0.05em]">
            إدارة
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border-[2.5px] border-brand-ink rounded-[20px] p-6 sm:p-7 shadow-hard-md"
        >
          <h1 className="text-[22px] font-black mb-1">دخول لوحة الإدارة</h1>
          <p className="text-brand-muted text-[13px] mb-5 leading-[1.6]">
            هذه المنطقة محمية. أدخل كلمة المرور للمتابعة.
          </p>

          <label className="block">
            <span className="block text-[13px] font-bold mb-2">كلمة المرور</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              className="input-field"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="mt-3 text-[#d93025] text-[13px] font-semibold">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-orange w-full justify-center mt-5 disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>

          <Link
            href="/"
            className="block text-center mt-4 text-[12px] text-brand-muted hover:text-brand-ink underline"
          >
            ← رجوع للموقع
          </Link>
        </form>
      </div>
    </div>
  );
}
