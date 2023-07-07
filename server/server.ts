import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import morgan from 'morgan';

import { initDb } from './datastore';
import { singInHandler, singUpHandler } from './handlers/authHandler';
import { createPostHandler, listPostsHandler } from './handlers/postHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorMiddleware';

(async () => {
  await initDb();
  dotenv.config();

  const app = express();

  app.use(express.json());

  app.use(morgan('tiny'));

  // Public endpoints
  app.post('/v1/signup', asyncHandler(singUpHandler));
  app.post('/v1/signin', asyncHandler(singInHandler));

  app.use(authMiddleware);

  // Protedcted endpoints
  app.get('/v1/posts', asyncHandler(listPostsHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));

  app.use(errorHandler);

  app.listen(3000, () => {
    console.log('Server runing on port 3000');
  });
})();
