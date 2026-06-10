import { Lang, UI_TEXT } from "../data/survey";

export default function ProgressBar({
  current,
  total,
  lang,
}: {
  current: number; // 0-indexed step within sections
  total: number;
  lang: Lang;
}) {
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs font-medium text-cf-gray">
        <span>
          {UI_TEXT.step[lang]} {current + 1} {UI_TEXT.of[lang]} {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-cf-purple-light overflow-hidden">
        <div
          className="h-full rounded-full bg-cf-purple transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
