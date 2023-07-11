import { Comment, Post, User } from './types';

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}

export type createPostRequest = Pick<Post, 'title' | 'url'>;
export interface createPostResponse {}

export interface GetPostResponse {
  post: Post;
}

export interface DeletePostResponse {}

// Comment APIs
export type ListCommentsResponse = { comments: Comment[] };

export type CreateCommentRequest = Pick<Comment, 'comment' | 'postId' | 'parentId'>;
export interface CreateCommentResponse {}

export interface DeleteCommentResponse {}

// Like APIs

// User APIs
export type SingUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'username' | 'password'
>;
export interface SingUpResponse {
  jwt: string;
}

export interface SingInRequest {
  login: string;
  password: string;
}

export type SingInResponse = {
  user: Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
  jwt: string;
};
