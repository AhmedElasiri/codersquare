import crypto from 'crypto';

import {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentResponse,
  ListCommentsResponse,
} from '../api';
import { Datastore, db } from '../datastore';
import { Comment, ExpressHandler, ExpressHandlerWithParams } from '../types';

export class CommentHandler {
  constructor(private db: Datastore) {}

  public createCommentHandler: ExpressHandler<CreateCommentRequest, CreateCommentResponse> = async (
    req,
    res
  ) => {
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
    await this.db.createComment(commen);
    return res.sendStatus(201);
  };

  public listComments: ExpressHandlerWithParams<{ postId: string }, null, ListCommentsResponse> =
    async (req, res) => {
      if (!req.params.postId) {
        return res.sendStatus(400);
      }

      const comments: Comment[] = await this.db.listComments(req.params.postId);
      if (comments.length > 0) {
        return res.status(200).send({ comments });
      }
      return res.status(404).send({ error: 'No comments for this post id ' + req.params.postId });
    };

  public deleteCommentHandler: ExpressHandlerWithParams<
    { id: string },
    null,
    DeleteCommentResponse
  > = async (req, res) => {
    if (!req.params.id) {
      return res.sendStatus(400);
    }
    const comment = await this.db.getComment(req.params.id);
    if (!comment) {
      return res.sendStatus(404);
    }
    if (res.locals.userId !== comment.userId) {
      return res.sendStatus(403);
    }
    await this.db.deleteComment(req.params.id);
    return res.sendStatus(204);
  };
}
