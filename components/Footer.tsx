import Link from "next/link";
import { FlytimesMark } from "./FlytimesMark";
import { CONTACT } from "@/data/contact";
import { PACKAGES } from "@/data/packages";
import { SERVICES } from "@/data/services";

export function Footer() {
  return (
    <footer className="bg-brand-orange text-white pt-14 pb-6">
      <div className="container-flytimes">
        <div className="grid grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
          <div>
            <FlytimesMark size={60} href={null} />
            <p className="mt-4 leading-[1.7] text-[14px] opacity-90 max-w-xs">
              وكالة سياحة وسفر وتعليم في الخارج. صمّمنا إجازتك من قبل ما تسألنا عنها.
            </p>
          </div>

          <div>
            <h5 className="font-black text-[14px] mb-4 uppercase tracking-[0.08em]">البكجات</h5>
            {PACKAGES.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href="/packages"
                className="block py-1 text-[14px] opacity-85 hover:opacity-100 hover:underline"
              >
                {p.name}
              </Link>
            ))}
          </div>

          <div>
            <h5 className="font-black text-[14px] mb-4 uppercase tracking-[0.08em]">الخدمات</h5>
            {SERVICES.slice(0, 5).map((s) => (
              <Link
                key={s.id}
                href="/#services"
                className="block py-1 text-[14px] opacity-85 hover:opacity-100 hover:underline"
              >
                {s.label}
              </Link>
            ))}
          </div>

          <div>
            <h5 className="font-black text-[14px] mb-4 uppercase tracking-[0.08em]">تواصل</h5>
            {CONTACT.phones.map((p) => (
              <a
                key={p.value}
                href={p.whatsapp ? `https://wa.me/${p.value.replace(/^0/, "966")}` : `tel:${p.value}`}
                className="block py-1 text-[14px] opacity-85 hover:opacity-100 hover:underline font-mono"
              >
                {p.value}
              </a>
            ))}
            <a
              href={`mailto:${CONTACT.email}`}
              className="block py-1 text-[14px] opacity-85 hover:opacity-100 hover:underline"
            >
              {CONTACT.email}
            </a>
            <span className="block py-1 text-[14px] opacity-85">{CONTACT.address}</span>
          </div>
        </div>

        <div className="border-t-2 border-white/30 mt-10 pt-5 text-[13px] flex flex-wrap gap-3 justify-between">
          <div>© ٢٠٢٦ فلاي تايمز</div>
          <div>مصنوع بشغف في الرياض</div>
        </div>
      </div>
    </footer>
  );
}
