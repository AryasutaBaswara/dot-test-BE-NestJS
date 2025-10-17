// src/post/post.repository.ts
import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { Post } from './post.entity'; // Impor "label" Post

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
}
