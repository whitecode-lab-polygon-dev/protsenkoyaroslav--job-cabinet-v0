import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

import { registerCityRoutes } from './cities/cities.route.js';
import { registerMatchRoute } from './match/match.route.js';
import { createResumeRepository } from './resumes/repository.js';
import type { ResumeRepository } from './resumes/repository.js';
import { registerResumeRoutes } from './resumes/resumes.route.js';
import { createVacancyRepository } from './vacancies/repository.js';
import type { VacancyRepository } from './vacancies/repository.js';
import { registerVacancyRoutes } from './vacancies/vacancies.route.js';

export interface ServerOptions {
  repository?: VacancyRepository;
  resumes?: ResumeRepository;
  logger?: boolean;
}

export function buildServer(options: ServerOptions = {}): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });
  const repo = options.repository ?? createVacancyRepository();
  const resumes = options.resumes ?? createResumeRepository();

  app.get('/api/health', async () => ({ status: 'ok' }));
  registerVacancyRoutes(app, repo);
  registerCityRoutes(app, repo);
  registerMatchRoute(app, repo);
  registerResumeRoutes(app, resumes);

  return app;
}
