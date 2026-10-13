import type { Level, Resume } from '@wcl/shared';

import { resumes } from '../data/resumes.js';

export interface ResumeInput {
  title: string;
  skills: string[];
  level: Level;
}

// Async on purpose, like the vacancy repository: the mock list is the first implementation of an
// interface a real database will fill in later, and the routes are written against the interface.
export interface ResumeRepository {
  listResumes(): Promise<Resume[]>;
  findResumeById(id: string): Promise<Resume | undefined>;
  saveResume(id: string, input: ResumeInput): Promise<Resume | undefined>;
}

export function createResumeRepository(source: Resume[] = resumes): ResumeRepository {
  return {
    async listResumes() {
      return source;
    },
    async findResumeById(id) {
      return source.find((resume) => resume.id === id);
    },
    async saveResume(id, input) {
      const index = source.findIndex((resume) => resume.id === id);
      if (index === -1) return undefined;
      const next: Resume = { id, title: input.title, skills: input.skills, level: input.level };
      source[index] = next;
      return next;
    },
  };
}

const defaultRepository = createResumeRepository();

// /api/match imported these two directly before there was a repository; kept so that pull request
// does not have to change to make this one compile.
export const findResumeById = (id: string): Promise<Resume | undefined> =>
  defaultRepository.findResumeById(id);
export const listResumes = (): Promise<Resume[]> => defaultRepository.listResumes();
