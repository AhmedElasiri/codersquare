import crypto from 'crypto';

import { ListPostsRequest, ListPostsResponse, createPostRequest, createPostResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Post } from '../types';

export const listPostsHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = (
  _req,
  res
) => {
  res.send({ posts: db.listPosts() });
};

export const createPostHandler: ExpressHandler<createPostRequest, createPostResponse> = (
  req,
  res
) => {
  if (!req.body.title || !req.body.url || !req.body.userId) {
    res.sendStatus(400);
    return;
  }
  const post: Post = {
    id: crypto.randomUUID(),
    title: req.body.title,
    url: req.body.url,
    userId: req.body.userId,
    postedAt: Date.now(),
  };
  db.createPost(post);
  res.sendStatus(200);
};
