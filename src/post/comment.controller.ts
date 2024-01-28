// src/comment/comment.controller.ts
import { Body, Controller, Post, Param, UseGuards } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CommentService } from './comment.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '@prisma/client'

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User
  ) {
    return this.commentService.createComment(user.id, postId, createCommentDto)
  }
}
