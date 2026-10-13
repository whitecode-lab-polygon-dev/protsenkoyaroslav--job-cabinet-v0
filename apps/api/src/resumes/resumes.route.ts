import type { FastifyInstance } from 'fastify';
import { isLevel } from '@wcl/shared';

import type { ResumeRepository } from './repository.js';

interface SaveResumeBody {
  title?: unknown;
  skills?: unknown;
  level?: unknown;
}

export function registerResumeRoutes(app: FastifyInstance, repo: ResumeRepository): void {
  app.get('/api/resumes', async (_request, reply) => {
    return reply.send({ items: await repo.listResumes() });
  });

  app.get<{ Params: { id: string } }>('/api/resumes/:id', async (request, reply) => {
    const resume = await repo.findResumeById(request.params.id);
    if (!resume) return reply.code(404).send({ message: 'resume not found' });
    return resume;
  });

  app.put<{ Params: { id: string }; Body: SaveResumeBody }>(
    '/api/resumes/:id',
    async (request, reply) => {
      const { title, skills, level } = request.body;
      if (typeof title !== 'string' || title.trim() === '') {
        return reply.code(400).send({ message: 'title is required' });
      }
      if (!Array.isArray(skills) || skills.some((skill) => typeof skill !== 'string')) {
        return reply.code(400).send({ message: 'skills must be an array of strings' });
      }
      if (typeof level !== 'string' || !isLevel(level)) {
        return reply.code(400).send({ message: 'unknown level' });
      }

      const saved = await repo.saveResume(request.params.id, {
        title,
        skills: skills as string[],
        level,
      });
      if (!saved) return reply.code(404).send({ message: 'resume not found' });
      return saved;
    },
  );
}
