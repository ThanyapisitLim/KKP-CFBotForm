import { AnswersMap } from "../components/QuestionField";
import { Question, Section } from "../data/survey";

function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isQuestionAnswered(question: Question, answers: AnswersMap): boolean {
  const value = answers[question.id];

  switch (question.type) {
    case "text":
    case "textarea":
      return isNonEmptyString(value);

    case "radio": {
      if (!isNonEmptyString(value)) return false;
      const selected = question.options?.find((opt) => opt.id === value);
      if (selected?.isOther && !isNonEmptyString(answers[`${question.id}__other`])) {
        return false;
      }
      if (selected?.hasSpec && !isNonEmptyString(answers[`${question.id}__spec__${selected.id}`])) {
        return false;
      }
      return true;
    }

    case "checkbox":
    case "checkboxLimit": {
      const selected = (value as string[]) ?? [];
      if (selected.length === 0) return false;
      const hasOtherSelected = question.options?.some(
        (opt) => opt.isOther && selected.includes(opt.id)
      );
      if (hasOtherSelected && !isNonEmptyString(answers[`${question.id}__other`])) {
        return false;
      }
      return true;
    }

    case "matrix": {
      const value2 = (value as Record<string, number>) ?? {};
      return (question.rows ?? []).every((row) => typeof value2[row.id] === "number");
    }

    case "ranking": {
      const value2 = (value as string[]) ?? [];
      const total = question.rankLabels?.length ?? 0;
      if (value2.length < total) return false;
      return value2.slice(0, total).every((v) => isNonEmptyString(v));
    }

    default:
      return true;
  }
}

/**
 * Returns the ids of all questions (and required follow-up fields) in a
 * section that are missing an answer. An empty array means the section is
 * complete and the user can move on.
 */
export function getMissingRequiredQuestionIds(section: Section, answers: AnswersMap): string[] {
  const missing: string[] = [];

  for (const question of section.questions) {
    if (!question.optional && !isQuestionAnswered(question, answers)) {
      missing.push(question.id);
    }

    if (
      question.followUp &&
      !question.followUp.optional &&
      !isNonEmptyString(answers[question.followUp.id])
    ) {
      missing.push(question.followUp.id);
    }
  }

  return missing;
}
