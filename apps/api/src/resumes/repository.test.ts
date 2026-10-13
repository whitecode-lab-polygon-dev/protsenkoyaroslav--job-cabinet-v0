import { describe, expect, it } from 'vitest';
import type { Resume } from '@wcl/shared';

import { createResumeRepository } from './repository.js';

const sample = (): Resume[] => [
  { id: 'r-1', title: 'Frontend Developer', skills: ['React'], level: 'junior' },
  { id: 'r-2', title: 'Fullstack Developer', skills: ['React', 'Node'], level: 'middle' },
];

describe('createResumeRepository', () => {
  it('lists and finds resumes', async () => {
    const repo = createResumeRepository(sample());
    expect(await repo.listResumes()).toHaveLength(2);
    expect((await repo.findResumeById('r-2'))?.level).toBe('middle');
    expect(await repo.findResumeById('nope')).toBeUndefined();
  });

  it('saves a resume and answers undefined for an unknown id', async () => {
    const repo = createResumeRepository(sample());
    const saved = await repo.saveResume('r-1', {
      title: 'React Developer',
      skills: ['React', 'TypeScript'],
      level: 'middle',
    });
    expect(saved).toEqual({
      id: 'r-1',
      title: 'React Developer',
      skills: ['React', 'TypeScript'],
      level: 'middle',
    });
    expect((await repo.findResumeById('r-1'))?.title).toBe('React Developer');
    expect(
      await repo.saveResume('nope', { title: 'x', skills: [], level: 'junior' }),
    ).toBeUndefined();
  });
});
