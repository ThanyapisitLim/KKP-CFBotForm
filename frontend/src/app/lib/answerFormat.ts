// Renders a raw answers map (as stored by the backend) into human-readable
// labels for the admin dashboard, using the question/option labels defined
// in data/survey.ts.

import { AnswersMap } from "../components/QuestionField";
import { Lang, Question, SECTIONS } from "../data/survey";

const EMPTY = "—";

export interface FormattedAnswer {
  id: string;
  number: number;
  question: string;
  value: string;
}

export interface FormattedSection {
  id: string;
  title: string;
  items: FormattedAnswer[];
}

function formatValue(question: Question, answers: AnswersMap, lang: Lang): string {
  const value = answers[question.id];

  switch (question.type) {
    case "text":
    case "textarea": {
      const text = (value as string | undefined)?.trim();
      return text || EMPTY;
    }

    case "radio":
    case "select": {
      const selectedId = value as string | undefined;
      if (!selectedId) return EMPTY;

      const opt = question.options?.find((o) => o.id === selectedId);
      let label = opt?.label[lang] ?? selectedId;

      if (opt?.isOther) {
        const other = (answers[`${question.id}__other`] as string | undefined)?.trim();
        if (other) label += `: ${other}`;
      }
      if (opt?.hasSpec) {
        const spec = (answers[`${question.id}__spec__${opt.id}`] as string | undefined)?.trim();
        if (spec) label += ` (${spec})`;
      }

      return label;
    }

    case "checkbox":
    case "checkboxLimit": {
      const selected = (value as string[] | undefined) ?? [];
      if (selected.length === 0) return EMPTY;

      return selected
        .map((id) => {
          const opt = question.options?.find((o) => o.id === id);
          let label = opt?.label[lang] ?? id;
          if (opt?.isOther) {
            const other = (answers[`${question.id}__other`] as string | undefined)?.trim();
            if (other) label += `: ${other}`;
          }
          return label;
        })
        .join(", ");
    }

    case "matrix": {
      const value2 = (value as Record<string, number> | undefined) ?? {};
      const rows = question.rows ?? [];
      if (rows.length === 0 || Object.keys(value2).length === 0) return EMPTY;

      return rows.map((row) => `${row.label[lang]}: ${value2[row.id] ?? "-"}`).join(" / ");
    }

    case "ranking": {
      const value2 = (value as string[] | undefined) ?? [];
      if (value2.every((v) => !v)) return EMPTY;

      return value2.map((v, i) => `${i + 1}. ${v || "-"}`).join(" / ");
    }

    default:
      return EMPTY;
  }
}

/**
 * Groups a raw answers map into sections/questions with display-ready
 * labels and values, for rendering on the admin dashboard.
 */
export function formatSubmission(answers: AnswersMap, lang: Lang): FormattedSection[] {
  return SECTIONS.map((section) => {
    const items: FormattedAnswer[] = [];

    for (const question of section.questions) {
      items.push({
        id: question.id,
        number: question.number,
        question: question.title[lang],
        value: formatValue(question, answers, lang),
      });

      if (question.followUp) {
        const followUpValue = (answers[question.followUp.id] as string | undefined)?.trim();
        items.push({
          id: question.followUp.id,
          number: question.number,
          question: question.followUp.title[lang],
          value: followUpValue || EMPTY,
        });
      }
    }

    return {
      id: section.id,
      title: section.title[lang],
      items,
    };
  });
}
