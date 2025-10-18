// src/comment/comment.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/user.entity';

// Tidak ada prefix utama di sini, karena URL sudah lengkap di method
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  // URL lengkap: POST /posts/:postId/comments
  @Post('posts/:postId/comments')
  create(
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      createCommentDto.text,
      user.id,
      postId,
    );
  }

  // URL lengkap: GET /posts/:postId/comments
  @Get('posts/:postId/comments')
  findByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.getCommentsByPostId(postId);
  }

  @UseGuards(AuthGuard)
  // URL lengkap: PATCH /comments/:commentId
  @Patch('comments/:commentId')
  update(
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      commentId,
      user.id,
      updateCommentDto.text,
    );
  }

  @UseGuards(AuthGuard)
  // URL lengkap: DELETE /comments/:commentId
  @Delete('comments/:commentId')
  remove(
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.deleteComment(commentId, user.id);
  }
}
