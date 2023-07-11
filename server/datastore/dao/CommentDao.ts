import { Comment } from '../../types';

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  listComments(postId: string): Promise<Comment[]>;
  getComment(id: string): Promise<Comment | undefined>;
  deleteComment(id: string): Promise<void>;
}
