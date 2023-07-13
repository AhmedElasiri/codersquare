import crypto from 'crypto';
import { Request, Response } from 'express';

import {
  DeletePostResponse,
  GetPostResponse,
  ListPostsRequest,
  ListPostsResponse,
  createPostRequest,
  createPostResponse,
} from '../api';
import { Datastore } from '../datastore';
import { ExpressHandler, ExpressHandlerWithParams, Post } from '../types';

export class PostHandler {
  private db: Datastore;

  constructor(db: Datastore) {
    this.db = db;
  }

  public listPostsHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = async (
    _req,
    res
  ) => {
    // TODO: add pagination and filtering
    res.send({ posts: await this.db.listPosts() });
  };

  public createPostHandler: ExpressHandler<createPostRequest, createPostResponse> = async (
    req,
    res
  ) => {
    // TODO: better error message
    if (!req.body.title || !req.body.url) {
      res.sendStatus(400);
      return;
    }

    // TODO: validate url is new, otherwise add +1 to existing post
    const post: Post = {
      id: crypto.randomUUID(),
      title: req.body.title,
      url: req.body.url,
      userId: res.locals.userId,
      postedAt: Date.now(),
    };
    await this.db.createPost(post);
    res.sendStatus(201);
  };

  public getPostHandler: ExpressHandlerWithParams<{ id: string }, null, GetPostResponse> = async (
    req,
    res
  ) => {
    if (!req.params.id) return res.sendStatus(400);
    const postToReturn = await this.db.getPost(req.params.id);

    if (!postToReturn) {
      return res.sendStatus(404);
    }
    return res.status(200).send({ post: postToReturn });
  };

  public deletePostHandler: ExpressHandlerWithParams<{ id: string }, null, DeletePostResponse> =
    async (req, res) => {
      if (!req.params.id) {
        res.sendStatus(400);
        return;
      }
      if (!this.isPostBelongToCurrentUser(req, res)) {
        res.sendStatus(403);
        return;
      }
      await this.db.deletePost(req.params.id);
      res.sendStatus(204);
    };

  async isPostBelongToCurrentUser(req: Request, res: Response): Promise<boolean> {
    const post = await this.db.getPost(req.params.id);
    if (post?.userId === res.locals.userId) {
      return true;
    }
    return false;
  }
}
