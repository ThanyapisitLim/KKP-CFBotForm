import { Lang } from "../data/survey";

export default function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-cf-gray-light bg-white p-1 text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange("th")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "th" ? "bg-cf-purple text-white" : "text-cf-gray hover:text-cf-purple-dark"
        }`}
      >
        ไทย
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "en" ? "bg-cf-purple text-white" : "text-cf-gray hover:text-cf-purple-dark"
        }`}
      >
        EN
      </button>
    </div>
  );
}
