import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Post } from '@prisma/client'
import { CreatePostDto } from 'src/post/dto/create-post.dto'
import { UpdatePostDto } from 'src/post/dto/update-post.dto'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(
    userId: string,
    createPostDto: CreatePostDto
  ): Promise<Post> {
    const { title, content } = createPostDto

    return this.prisma.post.create({
      data: {
        userId,
        title,
        content,
      },
    })
  }

  async getAllPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    })
  }

  async getPostById(postId: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    })
  }

  async updatePost(
    postId: string,
    userId: string,
    updatePostDto: UpdatePostDto
  ): Promise<Post> {
    const { title, content } = updatePostDto

    const existingPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!existingPost || existingPost.userId !== userId) {
      throw new NotFoundException('Post not found or unauthorized to update')
    }

    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
      },
    })
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const existingPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!existingPost || existingPost.userId !== userId) {
      throw new NotFoundException('Post not found or unauthorized to delete')
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    })
  }
}
