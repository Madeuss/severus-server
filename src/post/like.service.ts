import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(postId: string, userId: string): Promise<void> {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (existingLike) {
      throw new NotFoundException('User has already liked this post')
    }

    await this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    })
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (!existingLike) {
      throw new NotFoundException('User has not liked this post')
    }

    await this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })
  }
}
