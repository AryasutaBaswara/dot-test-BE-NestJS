// src/comment/comment.repository.ts
import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg'; // Import tipe dasar
import { db } from '../db';
import { Comment } from './comment.entity'; // Impor entity Comment

interface CommentQueryResult extends QueryResultRow, Comment {} // Tipe gabungan

@Injectable()
export class CommentRepository {
  async createComment(
    text: string,
    authorId: number,
    postId: number,
  ): Promise<Comment> {
    const queryText =
      'INSERT INTO "Comment"(text, "authorId", "postId") VALUES($1, $2, $3) RETURNING *';
    const { rows } = await db.query<CommentQueryResult>(queryText, [
      text,
      authorId,
      postId,
    ]);
    return rows[0];
  }

  async findCommentsByPostId(postId: number): Promise<Comment[]> {
    const queryText =
      'SELECT * FROM "Comment" WHERE "postId" = $1 ORDER BY "createdAt" ASC';
    const { rows } = await db.query<CommentQueryResult>(queryText, [postId]);
    return rows;
  }

  async findCommentById(commentId: number): Promise<Comment | undefined> {
    const queryText = 'SELECT * FROM "Comment" WHERE id = $1';
    const { rows } = await db.query<CommentQueryResult>(queryText, [commentId]);
    return rows[0];
  }

  async updateComment(commentId: number, text: string): Promise<Comment> {
    const queryText =
      'UPDATE "Comment" SET text = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query<CommentQueryResult>(queryText, [
      text,
      commentId,
    ]);
    return rows[0];
  }

  async deleteComment(commentId: number): Promise<Comment> {
    const queryText = 'DELETE FROM "Comment" WHERE id = $1 RETURNING *';
    const { rows } = await db.query<CommentQueryResult>(queryText, [commentId]);
    return rows[0];
  }
}
