import { CommentDao } from './dao/CommentDao';
import { LikeDao } from './dao/LikeDao';
import { PostDao } from './dao/PostDao';
import { UserDao } from './dao/UserDao';
// import { InMemoryDatastore } from "./memorydb";
import { SqlDatastore } from './sql';

export interface Datastore extends UserDao, PostDao, LikeDao, CommentDao {}

export let db: Datastore;

export async function initDb() {
  //  db = new InMemoryDatastore();
  db = await new SqlDatastore().openDb();
}
