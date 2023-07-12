import { CreateLikeResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandlerWithParams, Like } from '../types';

export const createLikeHandler: ExpressHandlerWithParams<
  { postId: string },
  null,
  CreateLikeResponse
> = async (req, res) => {
  if (!req.params.postId) {
    return res.sendStatus(400);
  }
  const like: Like = {
    userId: res.locals.userId,
    postId: req.params.postId,
  };

  await db.createLike(like);
  return res.sendStatus(201);
};

export const deleteLikeHandler: ExpressHandlerWithParams<
  { postId: string },
  null,
  CreateLikeResponse
> = async (req, res) => {
  if (!req.params.postId) {
    return res.sendStatus(400);
  }
  const like: Like = {
    userId: res.locals.userId,
    postId: req.params.postId,
  };
  await db.deleteLike(like);

  return res.sendStatus(204);
};
