// src/post/post.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(title: string, content: string, authorId: number) {
    return this.postRepository.createPost(title, content, authorId);
  }

  async getAllPosts() {
    return this.postRepository.findAllPosts();
  }

  async updatePost(
    postId: number,
    userId: number,
    title: string,
    content: string,
  ) {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not authorized to edit this post');
    }

    return this.postRepository.updatePost(postId, title, content);
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }

    return this.postRepository.deletePost(postId);
  }
}
