import { Post, User } from './types';

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}

export type createPostRequest = Pick<Post, 'title' | 'url' | 'userId'>;
export interface createPostResponse {}

export interface GetPostRequest {}
export interface GetPostResponse {
  post: Post;
}
// Comment APIs

// Like APIs

// User APIs
export type SingUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'username' | 'password'
>;
export interface SingUpResponse {}

export interface SingInRequest {
  login: string;
  password: string;
}

export type SingInResponse = Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
