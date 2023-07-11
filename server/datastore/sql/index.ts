import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '..';
import { Comment, Like, Post, User } from '../../types';

export class SqlDatastore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb() {
    // open the database
    this.db = await sqliteOpen({
      filename: path.join(__dirname, 'hackerNews.sqlite'),
      driver: sqlite3.Database,
    });

    this.db.run('PRAGMA foreign_keys = ON;');

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
    });

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      'INSERT INTO users (id, email, password, firstName, lastName, username, createdAT) VALUES (?,?,?,?,?,?,?)',
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.username,
      user.createdAt
    );
  }

  getUserById(id: string): Promise<User | undefined> {
    return this.db.get('SELECT * FROM users WHERE id = ?', id);
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.db.get(`SELECT * FROM users WHERE email = ?`, email);
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    // console.log(username);
    let xz = this.db.get(`SELECT * FROM users WHERE username = ?`, username);
    return xz;
  }

  listPosts(): Promise<Post[]> {
    return this.db.all<Post[]>('SELECT * FROM posts');
  }

  async createPost(post: Post): Promise<void> {
    await this.db.run(
      'INSERT INTO posts (id, title, url, postedAt, userId) VALUES (?,?,?,?,?)',
      post.id,
      post.title,
      post.url,
      post.postedAt,
      post.userId
    );
  }

  getPost(id: string): Promise<Post | undefined> {
    return this.db.get(`SELECT * FROM posts WHERE id = ?`, id);
  }
  async deletePost(id: string): Promise<void> {
    this.db.run(`DELETE FROM posts WHERE id = ?`, id);
  }
  createLike(like: Like): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async createComment(comment: Comment): Promise<void> {
    this.db.run(
      'INSERT INTO comments (id, userId, postId, content, createdAt, parent_comment_id) VALUES (?,?,?,?,?,?)',
      comment.id,
      comment.userId,
      comment.postId,
      comment.comment,
      comment.createdAt,
      comment.parentId
    );
  }
  listComments(postId: string): Promise<Comment[]> {
    throw new Error('Method not implemented.');
  }
  deleteComment(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
