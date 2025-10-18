// src/comment/comment.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { PostRepository } from '../post/post.repository'; // Kita butuh repository post

@Injectable()
export class CommentService {
  // Suntikkan kedua repository yang dibutuhkan
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository, // <-- Suntikkan PostRepository
  ) {}

  async createComment(text: string, authorId: number, postId: number) {
    // Cek dulu apakah post-nya ada
    const post = await this.postRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.commentRepository.createComment(text, authorId, postId);
  }

  async getCommentsByPostId(postId: number) {
    return this.commentRepository.findCommentsByPostId(postId);
  }

  async updateComment(commentId: number, userId: number, text: string) {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to edit this comment',
      );
    }
    return this.commentRepository.updateComment(commentId, text);
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment',
      );
    }
    return this.commentRepository.deleteComment(commentId);
  }
}
