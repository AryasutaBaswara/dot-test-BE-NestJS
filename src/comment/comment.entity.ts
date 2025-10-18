// src/comment/comment.entity.ts
export class Comment {
  id: number;
  text: string;
  createdAt: Date;
  authorId: number;
  postId: number;
}
