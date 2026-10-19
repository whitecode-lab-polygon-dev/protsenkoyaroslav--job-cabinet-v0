import type { Resume, Vacancy } from '@wcl/shared';

import { computeMatch } from '../match/score.js';

export interface DigestItem {
  vacancyId: string;
  title: string;
  company: string;
  score: number;
  gaps: string;
}

export const DIGEST_SIZE = 3;

export function buildMatchDigest(resume: Resume, vacancies: Vacancy[]): DigestItem[] {
  const scored = vacancies.sort((a, b) => {
    const left = computeMatch(resume, { skills: a.stack }).score;
    const right = computeMatch(resume, { skills: b.stack }).score;
    return right - left;
  });

  return scored.slice(0, DIGEST_SIZE).map((vacancy) => {
    const { score, gaps } = computeMatch(resume, { skills: vacancy.stack });
    return {
      vacancyId: vacancy.id,
      title: vacancy.title,
      company: vacancy.company,
      score,
      gaps,
    };
  });
}

export function formatDigest(items: DigestItem[]): string {
  if (items.length === 0) return 'Нових вакансій під твоє резюме поки немає.';
  const lines = items.map(
    (item) =>
      `${item.title} — ${item.company}, збіг ${item.score}%` +
      (item.gaps ? `\nне вистачає: ${item.gaps}` : ''),
  );
  return ['Нові вакансії під твоє резюме:', ...lines].join('\n\n');
}
