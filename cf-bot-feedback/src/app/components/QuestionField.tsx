"use client";

import { Lang, OTHER_PLACEHOLDER, Question, SCALE_LABELS, UI_TEXT } from "../data/survey";

export type AnswerValue =
  | string
  | string[]
  | Record<string, number>
  | undefined;

export interface AnswersMap {
  [key: string]: AnswerValue;
}

interface QuestionFieldProps {
  question: Question;
  lang: Lang;
  answers: AnswersMap;
  setAnswer: (key: string, value: AnswerValue) => void;
}

// text-base (16px) on inputs avoids iOS Safari auto-zoom on focus
const inputBase =
  "w-full rounded-xl border border-cf-gray-light bg-white px-4 py-3 text-base text-foreground placeholder:text-cf-gray/60 focus:outline-none focus:ring-2 focus:ring-cf-purple focus:border-cf-purple transition";

export default function QuestionField({ question, lang, answers, setAnswer }: QuestionFieldProps) {
  const value = answers[question.id];

  return (
    <div className="mb-8 sm:mb-10">
      <QuestionHeader question={question} lang={lang} />

      {question.type === "text" && (
        <input
          type="text"
          className={inputBase}
          placeholder={question.placeholder?.[lang]}
          value={(value as string) ?? ""}
          onChange={(e) => setAnswer(question.id, e.target.value)}
        />
      )}

      {question.type === "textarea" && (
        <textarea
          className={`${inputBase} min-h-[110px] resize-y`}
          placeholder={question.placeholder?.[lang]}
          value={(value as string) ?? ""}
          onChange={(e) => setAnswer(question.id, e.target.value)}
        />
      )}

      {question.type === "radio" && (
        <RadioOptions question={question} lang={lang} answers={answers} setAnswer={setAnswer} />
      )}

      {(question.type === "checkbox" || question.type === "checkboxLimit") && (
        <CheckboxOptions question={question} lang={lang} answers={answers} setAnswer={setAnswer} />
      )}

      {question.type === "matrix" && (
        <MatrixField question={question} lang={lang} answers={answers} setAnswer={setAnswer} />
      )}

      {question.type === "ranking" && (
        <RankingField question={question} lang={lang} answers={answers} setAnswer={setAnswer} />
      )}

      {question.followUp && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            {question.followUp.title[lang]}
          </label>
          <textarea
            className={`${inputBase} min-h-[90px] resize-y`}
            placeholder={question.followUp.placeholder?.[lang]}
            value={(answers[question.followUp.id] as string) ?? ""}
            onChange={(e) => setAnswer(question.followUp!.id, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

function QuestionHeader({ question, lang }: { question: Question; lang: Lang }) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cf-purple text-xs font-semibold text-white">
        {question.number}
      </span>
      <div>
        <h3 className="text-base font-semibold text-foreground leading-snug">
          {question.title[lang]}
        </h3>
        {question.description && (
          <p className="mt-0.5 text-xs text-cf-gray">{question.description[lang]}</p>
        )}
        {question.type === "checkboxLimit" && question.limit && (
          <p className="mt-0.5 text-xs text-cf-purple-dark font-medium">
            {UI_TEXT.selectUpTo[lang]} {question.limit} {UI_TEXT.items[lang]}
          </p>
        )}
      </div>
    </div>
  );
}

function RadioOptions({ question, lang, answers, setAnswer }: QuestionFieldProps) {
  const selected = (answers[question.id] as string) ?? "";

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {question.options!.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <div key={opt.id}>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${
                isSelected
                  ? "border-cf-purple bg-cf-purple-light text-cf-purple-darker font-medium"
                  : "border-cf-gray-light bg-white hover:border-cf-purple/50 hover:bg-cf-purple-lighter"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.id}
                checked={isSelected}
                onChange={() => setAnswer(question.id, opt.id)}
                className="h-4 w-4 accent-[var(--cf-purple)]"
              />
              <span className="flex-1">{opt.label[lang]}</span>
            </label>

            {opt.hasSpec && isSelected && (
              <input
                type="text"
                className={`${inputBase} mt-2`}
                placeholder={OTHER_PLACEHOLDER[lang]}
                value={(answers[`${question.id}__spec__${opt.id}`] as string) ?? ""}
                onChange={(e) => setAnswer(`${question.id}__spec__${opt.id}`, e.target.value)}
              />
            )}

            {opt.isOther && isSelected && (
              <input
                type="text"
                className={`${inputBase} mt-2`}
                placeholder={OTHER_PLACEHOLDER[lang]}
                value={(answers[`${question.id}__other`] as string) ?? ""}
                onChange={(e) => setAnswer(`${question.id}__other`, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckboxOptions({ question, lang, answers, setAnswer }: QuestionFieldProps) {
  const selected = ((answers[question.id] as string[]) ?? []) as string[];
  const limit = question.limit;
  const atLimit = !!limit && selected.length >= limit;

  const toggle = (optId: string) => {
    const isSelected = selected.includes(optId);
    if (isSelected) {
      setAnswer(
        question.id,
        selected.filter((id) => id !== optId)
      );
    } else {
      if (atLimit) return;
      setAnswer(question.id, [...selected, optId]);
    }
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {question.options!.map((opt) => {
        const isSelected = selected.includes(opt.id);
        const disabled = atLimit && !isSelected;
        return (
          <div key={opt.id}>
            <label
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${
                isSelected
                  ? "border-cf-purple bg-cf-purple-light text-cf-purple-darker font-medium"
                  : disabled
                  ? "border-cf-gray-light bg-cf-gray-light/30 text-cf-gray cursor-not-allowed"
                  : "border-cf-gray-light bg-white hover:border-cf-purple/50 hover:bg-cf-purple-lighter cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={() => toggle(opt.id)}
                className="h-4 w-4 accent-[var(--cf-purple)]"
              />
              <span className="flex-1">{opt.label[lang]}</span>
            </label>

            {opt.isOther && isSelected && (
              <input
                type="text"
                className={`${inputBase} mt-2`}
                placeholder={OTHER_PLACEHOLDER[lang]}
                value={(answers[`${question.id}__other`] as string) ?? ""}
                onChange={(e) => setAnswer(`${question.id}__other`, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MatrixField({ question, lang, answers, setAnswer }: QuestionFieldProps) {
  const value = (answers[question.id] as Record<string, number>) ?? {};
  const scale = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-3">
      {question.rows!.map((row) => (
        <div key={row.id} className="rounded-xl border border-cf-gray-light p-3 sm:p-4">
          <p className="mb-3 text-sm font-medium text-foreground">{row.label[lang]}</p>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {scale.map((n) => {
              const isSelected = value[row.id] === n;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${row.label[lang]}: ${n}`}
                  onClick={() => setAnswer(question.id, { ...value, [row.id]: n })}
                  className={`flex h-11 flex-1 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                    isSelected
                      ? "border-cf-purple bg-cf-purple text-white"
                      : "border-cf-gray-light bg-white text-cf-gray hover:border-cf-purple/50 hover:bg-cf-purple-lighter"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-cf-gray">
            <span>{SCALE_LABELS.min[lang]}</span>
            <span>{SCALE_LABELS.max[lang]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RankingField({ question, lang, answers, setAnswer }: QuestionFieldProps) {
  const value = ((answers[question.id] as string[]) ?? ["", "", ""]) as string[];

  const handleChange = (idx: number, text: string) => {
    const next = [...value];
    while (next.length < (question.rankLabels?.length ?? 3)) next.push("");
    next[idx] = text;
    setAnswer(question.id, next);
  };

  return (
    <div className="space-y-3">
      {question.rankLabels!.map((label, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cf-purple-light text-sm font-semibold text-cf-purple-darker">
            {idx + 1}
          </span>
          <input
            type="text"
            className={inputBase}
            placeholder={label[lang]}
            value={value[idx] ?? ""}
            onChange={(e) => handleChange(idx, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
