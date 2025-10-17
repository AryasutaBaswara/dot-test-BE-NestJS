// src/post/post.entity.ts
export class Post {
  id: number;
  title: string;
  content: string | null;
  createdAt: Date;
  authorId: number;
}
