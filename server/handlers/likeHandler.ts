import { CreateLikeResponse } from '../api';
import { Datastore, db } from '../datastore';
import { ExpressHandlerWithParams, Like } from '../types';

export class LikeHandler {
  constructor(private db: Datastore) {}
  public createLikeHandler: ExpressHandlerWithParams<{ postId: string }, null, CreateLikeResponse> =
    async (req, res) => {
      if (!req.params.postId) {
        return res.sendStatus(400);
      }
      const like: Like = {
        userId: res.locals.userId,
        postId: req.params.postId,
      };

      await this.db.createLike(like);
      return res.sendStatus(201);
    };

  public deleteLikeHandler: ExpressHandlerWithParams<{ postId: string }, null, CreateLikeResponse> =
    async (req, res) => {
      if (!req.params.postId) {
        return res.sendStatus(400);
      }
      const like: Like = {
        userId: res.locals.userId,
        postId: req.params.postId,
      };
      await this.db.deleteLike(like);

      return res.sendStatus(204);
    };
}
