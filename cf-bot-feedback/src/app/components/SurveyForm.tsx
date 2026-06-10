"use client";

import { useState } from "react";
import {
  Lang,
  SECTIONS,
  SURVEY_NOTE,
  SURVEY_PURPOSE,
  SURVEY_SUBTITLE,
  SURVEY_TITLE,
  THANK_YOU,
  UI_TEXT,
} from "../data/survey";
import Logo from "./Logo";
import LangToggle from "./LangToggle";
import ProgressBar from "./ProgressBar";
import QuestionField, { AnswersMap, AnswerValue } from "./QuestionField";
import { submitFeedback } from "../lib/api";

type Step = "intro" | "done" | number;

export default function SurveyForm() {
  const [lang, setLang] = useState<Lang>("th");
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const setAnswer = (key: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = () => {
    if (step === "intro") {
      setStep(0);
    } else if (typeof step === "number") {
      if (step < SECTIONS.length - 1) {
        setStep(step + 1);
      } else {
        handleSubmit();
        return;
      }
    }
    scrollToTop();
  };

  const goBack = () => {
    if (typeof step === "number") {
      if (step === 0) {
        setStep("intro");
      } else {
        setStep(step - 1);
      }
      scrollToTop();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(false);
    try {
      const payload = {
        submittedAt: new Date().toISOString(),
        lang,
        answers,
      };
      await submitFeedback(payload);
      setStep("done");
      scrollToTop();
    } catch (err) {
      console.error("CF BOT feedback submission failed", err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setStep("intro");
    scrollToTop();
  };

  const isSection = typeof step === "number";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-cf-gray-light bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
          <Logo />
          <LangToggle lang={lang} onChange={setLang} />
        </div>
      </header>

      <main
        className={`mx-auto flex w-full max-w-2xl flex-1 px-3 py-5 sm:px-6 sm:py-12 ${
          isSection ? "pb-24 sm:pb-12" : ""
        }`}
      >
        {step === "intro" && (
          <IntroScreen lang={lang} onStart={goNext} />
        )}

        {isSection && (
          <SectionScreen
            sectionIndex={step as number}
            lang={lang}
            answers={answers}
            setAnswer={setAnswer}
            onNext={goNext}
            onBack={goBack}
            submitting={submitting}
            submitError={submitError}
          />
        )}

        {step === "done" && <DoneScreen lang={lang} onRestart={restart} />}
      </main>

      {isSection && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-cf-gray-light bg-white/95 backdrop-blur sm:hidden">
          <SectionNav
            isLast={step === SECTIONS.length - 1}
            lang={lang}
            onNext={goNext}
            onBack={goBack}
            submitting={submitting}
            className="mx-auto max-w-2xl px-3 py-3"
          />
        </div>
      )}

      <footer className="border-t border-cf-gray-light py-6 text-center text-xs text-cf-gray">
        © {new Date().getFullYear()} KKP — CF Consumer Finance
      </footer>
    </div>
  );
}

function IntroScreen({ lang, onStart }: { lang: Lang; onStart: () => void }) {
  return (
    <div className="flex w-full flex-col">
      <div className="rounded-2xl border border-cf-gray-light bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-cf-purple">
          {SURVEY_SUBTITLE[lang]}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
          {SURVEY_TITLE[lang]}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-cf-gray">
          {SURVEY_PURPOSE[lang]}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-cf-gray">
          {SURVEY_NOTE[lang]}
        </p>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-cf-purple-light px-4 py-2 text-xs font-semibold text-cf-purple-darker">
            ⏱ {UI_TEXT.estTime[lang]}
          </span>
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-xl bg-cf-purple px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cf-purple-dark sm:w-auto"
          >
            {UI_TEXT.startButton[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionScreen({
  sectionIndex,
  lang,
  answers,
  setAnswer,
  onNext,
  onBack,
  submitting,
  submitError,
}: {
  sectionIndex: number;
  lang: Lang;
  answers: AnswersMap;
  setAnswer: (key: string, value: AnswerValue) => void;
  onNext: () => void;
  onBack: () => void;
  submitting: boolean;
  submitError: boolean;
}) {
  const section = SECTIONS[sectionIndex];
  const isLast = sectionIndex === SECTIONS.length - 1;

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 sm:mb-6">
        <ProgressBar current={sectionIndex} total={SECTIONS.length} lang={lang} />
      </div>

      <div className="rounded-2xl border border-cf-gray-light bg-white p-4 shadow-sm sm:p-8">
        <h2 className="mb-5 text-base font-bold text-cf-purple-darker sm:mb-6 sm:text-xl">
          {section.title[lang]}
        </h2>

        {section.questions.map((q) => (
          <QuestionField key={q.id} question={q} lang={lang} answers={answers} setAnswer={setAnswer} />
        ))}
      </div>

      {isLast && submitError && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {UI_TEXT.submitError[lang]}
        </p>
      )}

      {/* Inline nav for larger screens; mobile uses the fixed bottom bar */}
      <SectionNav
        isLast={isLast}
        lang={lang}
        onNext={onNext}
        onBack={onBack}
        submitting={submitting}
        className="mt-6 hidden sm:flex"
      />
    </div>
  );
}

function SectionNav({
  isLast,
  lang,
  onNext,
  onBack,
  submitting,
  className = "",
}: {
  isLast: boolean;
  lang: Lang;
  onNext: () => void;
  onBack: () => void;
  submitting: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <button
        type="button"
        onClick={onBack}
        className="flex-1 rounded-xl border border-cf-gray-light bg-white px-5 py-3 text-sm font-semibold text-cf-gray transition hover:border-cf-purple/50 hover:text-cf-purple-dark sm:flex-initial"
      >
        {UI_TEXT.back[lang]}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={submitting}
        className="flex-1 rounded-xl bg-cf-purple px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cf-purple-dark disabled:opacity-60 sm:flex-initial"
      >
        {isLast ? UI_TEXT.submit[lang] : UI_TEXT.next[lang]}
      </button>
    </div>
  );
}

function DoneScreen({ lang, onRestart }: { lang: Lang; onRestart: () => void }) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className="w-full rounded-2xl border border-cf-gray-light bg-white p-6 shadow-sm sm:p-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cf-purple-light text-3xl">
          ✅
        </div>
        <h1 className="text-2xl font-bold text-foreground">{UI_TEXT.thankYouTitle[lang]}</h1>
        <p className="mt-4 text-sm leading-relaxed text-cf-gray">{THANK_YOU[lang]}</p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-8 w-full rounded-xl border border-cf-purple px-6 py-3 text-sm font-semibold text-cf-purple-dark transition hover:bg-cf-purple-light sm:w-auto"
        >
          {UI_TEXT.backToHome[lang]}
        </button>
      </div>
    </div>
  );
}
