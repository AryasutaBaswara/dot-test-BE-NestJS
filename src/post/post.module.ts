// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';

@Module({
  imports: [],
  controllers: [PostController], // Daftarkan "Pramusaji"
  providers: [PostService, PostRepository], // Daftarkan "Koki" dan "Petugas Gudang"
})
export class PostModule {}
