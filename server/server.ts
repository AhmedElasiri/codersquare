import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import morgan from 'morgan';

import { initDb } from './datastore';
import { db } from './datastore/index';
import { CommentHandler } from './handlers/commentHandler';
import { LikeHandler } from './handlers/likeHandler';
import { PostHandler } from './handlers/postHandler';
import { UserHandler } from './handlers/userHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorMiddleware';

(async () => {
  await initDb();
  dotenv.config();

  const userHandler = new UserHandler(db);
  const postHandler = new PostHandler(db);
  const likeHandler = new LikeHandler(db);
  const commentHandler = new CommentHandler(db);

  const PORT = process.env.PORT || 3000;

  const app = express();

  app.use(express.json());

  app.use(morgan('tiny'));

  // Public endpoints
  app.get('/v1/healthz', (req, res) => res.send({ status: 'OK ✌️' }));
  app.post('/v1/signup', asyncHandler(userHandler.singUpHandler));
  app.post('/v1/signin', asyncHandler(userHandler.singInHandler));
  app.get('/v1/posts', asyncHandler(postHandler.listPostsHandler));
  app.get('/v1/posts/:id', asyncHandler(postHandler.getPostHandler));
  app.get('/v1/comments/:postId', asyncHandler(commentHandler.listComments));

  app.use(authMiddleware);

  // Protedcted endpoints
  app.post('/v1/posts', asyncHandler(postHandler.createPostHandler));
  app.delete('/v1/posts/:id', asyncHandler(postHandler.deletePostHandler));
  app.post('/v1/comment', asyncHandler(commentHandler.createCommentHandler));
  app.delete('/v1/comments/:id', asyncHandler(commentHandler.deleteCommentHandler));
  app.post('/v1/likes/:postId', asyncHandler(likeHandler.createLikeHandler));
  app.delete('/v1/likes/:postId', asyncHandler(likeHandler.deleteLikeHandler));

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`);
  });
})();
