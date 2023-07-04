import { CommentDao } from "./CommentDao";
import { LikeDao } from "./LikeDao";
import { PostDao } from "./PostDao";
import { UserDao } from "./UserDao";

export interface Datastore extends UserDao, PostDao, LikeDao, CommentDao {}
