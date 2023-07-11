import crypto from 'crypto';

import { CreateCommentRequest, CreateCommentResponse } from '../api';
import { db } from '../datastore';
import { Comment, ExpressHandler } from '../types';

export const createCommentHandler: ExpressHandler<
  CreateCommentRequest,
  CreateCommentResponse
> = async (req, res) => {
  const { comment, postId } = req.body;
  if (!comment || !postId) {
    return res.status(404).send({ error: 'All fields are required' });
  }
  let parentId: string | undefined = undefined;
  if (req.body.parentId) {
    parentId = req.body.parentId;
  }
  const commen: Comment = {
    comment,
    createdAt: Date.now(),
    id: crypto.randomUUID(),
    postId,
    userId: res.locals.userId,
    parentId,
  };
  await db.createComment(commen);
  return res.sendStatus(200);
};
