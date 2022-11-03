import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

import { userRoute } from './routes/user';
import { pollRoutes } from './routes/poll';
import { guessRoute } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true
  })

  // em produção, colocar o secret no .env
  await fastify.register(jwt, {
    secret: 'nlw-copa'
  })

  await fastify.register(userRoute);
  await fastify.register(authRoutes);
  await fastify.register(pollRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoute);

  await fastify.listen({ port: 3333, host: '0.0.0.0' });
}

bootstrap()