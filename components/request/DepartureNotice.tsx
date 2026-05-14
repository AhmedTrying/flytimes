import { Icon } from "@/components/Icon";

const REQUIREMENTS = [
  "أن يكون محصّناً بجرعتين من لقاح كوفيد.",
  "أن يكون متعافياً من كورونا ولم يمضِ على تعافيه أكثر من ٦ أشهر.",
  "أن يكون متعافياً وقد حصل على جرعة واحدة على الأقل.",
  "الأطفال دون ١٢ سنة: يلزمهم بوليصة تأمين طبي معتمدة ضد كورونا، ولا يشترط التطعيم.",
];

export function DepartureNotice() {
  return (
    <aside className="bg-brand-orange-soft border-2 border-brand-orange/40 rounded-[20px] p-7">
      <div className="flex gap-3 items-start mb-4">
        <span className="w-9 h-9 bg-brand-orange text-white rounded-[10px] grid place-items-center shrink-0 mt-0.5">
          <Icon name="plane" size={18} />
        </span>
        <div>
          <h3 className="text-[18px] font-black leading-none">اشتراطات المغادرة من السعودية</h3>
          <p className="text-[13px] text-brand-muted mt-1">
            يجب أن تتوفر في المسافر إحدى الحالات التالية:
          </p>
        </div>
      </div>

      <ol className="space-y-3">
        {REQUIREMENTS.map((req, i) => (
          <li key={i} className="flex gap-3 text-[14px] leading-[1.7]">
            <span className="w-6 h-6 bg-brand-orange text-white rounded-full grid place-items-center text-[11px] font-black shrink-0 mt-0.5">
              {i + 1}
            </span>
            {req}
          </li>
        ))}
      </ol>

      <p className="mt-5 text-[12px] text-brand-muted border-t border-brand-orange/20 pt-4">
        المعلومات أعلاه إرشادية — تأكد من متطلبات الدولة المقصودة قبل السفر.
      </p>
    </aside>
  );
}
