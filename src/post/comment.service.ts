// src/comment/comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Comment } from '@prisma/client'

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto
  ): Promise<Comment> {
    const { content } = createCommentDto

    // Ensure the post exists
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    return this.prisma.comment.create({
      data: {
        userId,
        postId,
        content,
      },
    })
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const existingComment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!existingComment) {
      throw new NotFoundException('Comment not found')
    }

    if (existingComment.userId !== userId) {
      throw new NotFoundException('You are not allowed to delete this comment')
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    })
  }
}
