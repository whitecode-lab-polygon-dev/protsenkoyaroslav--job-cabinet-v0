import type { FastifyInstance } from 'fastify';

import type { ResumeRepository } from '../resumes/repository.js';
import type { VacancyRepository } from '../vacancies/repository.js';
import { buildMatchDigest, formatDigest } from './digest.js';
import type { ChannelSender } from './telegram.js';

interface LinkBody {
  resumeId?: unknown;
  chatId?: unknown;
}

interface DigestBody {
  resumeId?: unknown;
}

// Chat per resume. A table for this is the next ticket; the sprint only needs the contract.
const links = new Map<string, string>();

export interface ChannelDeps {
  vacancies: VacancyRepository;
  resumes: ResumeRepository;
  sender: ChannelSender;
}

export function registerChannelRoutes(app: FastifyInstance, deps: ChannelDeps): void {
  app.post<{ Body: LinkBody }>('/api/channels/telegram/link', async (request, reply) => {
    const { resumeId, chatId } = request.body;
    if (typeof resumeId !== 'string' || typeof chatId !== 'string') {
      return reply.code(400).send({ message: 'resumeId and chatId are required' });
    }
    const resume = await deps.resumes.findResumeById(resumeId);
    if (!resume) return reply.code(404).send({ message: 'resume not found' });

    links.set(resumeId, chatId);
    return reply.send({ resumeId, chatId, linked: true });
  });

  app.post<{ Body: DigestBody }>('/api/channels/telegram/digest', async (request, reply) => {
    const { resumeId } = request.body;
    if (typeof resumeId !== 'string') {
      return reply.code(400).send({ message: 'resumeId is required' });
    }
    const chatId = links.get(resumeId);
    if (!chatId) return reply.code(404).send({ message: 'channel is not linked' });
    const resume = await deps.resumes.findResumeById(resumeId);
    if (!resume) return reply.code(404).send({ message: 'resume not found' });

    const items = buildMatchDigest(resume, await deps.vacancies.listVacancies());
    await deps.sender.send(chatId, formatDigest(items));
    return reply.send({ sent: items.length });
  });
}
