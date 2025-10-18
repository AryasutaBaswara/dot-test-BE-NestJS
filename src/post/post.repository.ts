// src/post/post.repository.ts
import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { Post } from './post.entity'; // Impor "label" Post
import { QueryResultRow } from 'pg'; // Impor tipe dasar

// Tipe gabungan Post

// Tipe untuk hasil query tabel PostLikes
export interface PostLikeQueryResult extends QueryResultRow {
  userId: number;
  postId: number;
}

@Injectable()
export class PostRepository {
  async createPost(
    title: string,
    content: string,
    authorId: number,
  ): Promise<Post> {
    const queryText =
      'INSERT INTO "Post"(title, content, "authorId") VALUES($1, $2, $3) RETURNING *';
    const { rows } = await db.query<Post>(queryText, [
      title,
      content,
      authorId,
    ]);
    return rows[0];
  }

  async findAllPosts(): Promise<Post[]> {
    const queryText = 'SELECT * FROM "Post" ORDER BY "createdAt" DESC';
    const { rows } = await db.query<Post>(queryText, []);
    return rows;
  }

  async findPostById(postId: number): Promise<Post | undefined> {
    const queryText = 'SELECT * FROM "Post" WHERE id = $1';
    const { rows } = await db.query<Post>(queryText, [postId]);
    return rows[0];
  }

  async updatePost(
    postId: number,
    title: string,
    content: string,
  ): Promise<Post> {
    const queryText =
      'UPDATE "Post" SET title = $1, content = $2 WHERE id = $3 RETURNING *';
    const { rows } = await db.query<Post>(queryText, [title, content, postId]);
    return rows[0];
  }

  async deletePost(postId: number): Promise<Post> {
    const queryText = 'DELETE FROM "Post" WHERE id = $1 RETURNING *';
    const { rows } = await db.query<Post>(queryText, [postId]);
    return rows[0];
  }

  async findLike(
    userId: number,
    postId: number,
  ): Promise<PostLikeQueryResult | undefined> {
    const queryText =
      'SELECT * FROM "PostLikes" WHERE "userId" = $1 AND "postId" = $2';
    const { rows } = await db.query<PostLikeQueryResult>(queryText, [
      userId,
      postId,
    ]);
    return rows[0];
  }

  async addLike(userId: number, postId: number): Promise<PostLikeQueryResult> {
    const queryText =
      'INSERT INTO "PostLikes"("userId", "postId") VALUES($1, $2) RETURNING *';
    const { rows } = await db.query<PostLikeQueryResult>(queryText, [
      userId,
      postId,
    ]);
    return rows[0];
  }

  async removeLike(
    userId: number,
    postId: number,
  ): Promise<PostLikeQueryResult> {
    const queryText =
      'DELETE FROM "PostLikes" WHERE "userId" = $1 AND "postId" = $2 RETURNING *';
    const { rows } = await db.query<PostLikeQueryResult>(queryText, [
      userId,
      postId,
    ]);
    return rows[0];
  }
}
