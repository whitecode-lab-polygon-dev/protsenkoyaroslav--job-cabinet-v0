import { describe, expect, it } from 'vitest';
import type { Resume, Vacancy } from '@wcl/shared';

import { buildMatchDigest, formatDigest } from './digest.js';

const resume: Resume = {
  id: 'r-1',
  title: 'Frontend Developer',
  skills: ['React', 'TypeScript'],
  level: 'junior',
};

const vacancy = (id: string, stack: string[]): Vacancy => ({
  id,
  title: `Вакансія ${id}`,
  company: 'Acme',
  city: 'Київ',
  level: 'junior',
  format: 'remote',
  experience: 'none',
  stack,
  salaryFrom: null,
  salaryTo: null,
  publishedAt: '2026-10-01',
  description: 'опис',
});

describe('buildMatchDigest', () => {
  it('takes the three best matches, best first', () => {
    const items = buildMatchDigest(resume, [
      vacancy('v-1', ['React', 'Vue', 'Angular', 'Svelte']),
      vacancy('v-2', ['React', 'TypeScript']),
      vacancy('v-3', ['React', 'TypeScript', 'Node']),
      vacancy('v-4', ['React', 'Node', 'PostgreSQL']),
    ]);

    expect(items).toHaveLength(3);
    expect(items[0]?.vacancyId).toBe('v-2');
    expect(items[0]?.score).toBe(100);
  });

  it('explains what is missing', () => {
    const items = buildMatchDigest(resume, [vacancy('v-1', ['React', 'Node'])]);
    expect(items[0]?.gaps).toContain('node');
  });
});

describe('formatDigest', () => {
  it('says so when there is nothing to send', () => {
    expect(formatDigest([])).toContain('поки немає');
  });
});
