// src/post/post.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator'; // Impor asisten baru
import { User } from '../user/user.entity'; // Impor "label" User

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.getAllPosts();
  }

  @UseGuards(AuthGuard)
  @Post()
  // Gunakan @GetUser() untuk langsung mendapatkan objek user yang sudah jelas tipenya
  create(@GetUser() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(
      createPostDto.title,
      createPostDto.content,
      user.id, // Ambil ID langsung dari user
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(
      id,
      user.id,
      updatePostDto.title,
      updatePostDto.content,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id, user.id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/like') // POST /posts/:id/like
  @HttpCode(HttpStatus.CREATED) // Set status code default ke 201 Created
  async like(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    await this.postService.likePost(user.id, id); // <-- Jalankan service (tambahkan await)
    return { message: 'Post liked successfully' }; // <-- Return objek pesan
  }

  @UseGuards(AuthGuard)
  @Delete(':id/like') // DELETE /posts/:id/like
  @HttpCode(HttpStatus.OK) // Set status code default ke 200 OK
  async unlike(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    await this.postService.unlikePost(user.id, id); // <-- Jalankan service (tambahkan await)
    return { message: 'Post unliked successfully' }; // <-- Return objek pesan
  }
}
